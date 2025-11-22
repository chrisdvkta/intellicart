from datetime import datetime
from typing import Optional
from fastapi import HTTPException
from sqlmodel import select
import stripe
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentStatus, PaymentMethod


class PaymentService:
    def __init__(self, stripe_api_key: str):
        """Initialize with Stripe API key from environment"""
        stripe.api_key = stripe_api_key

    async def create_payment_intent(
        self,
        order_id: int,
        user_id: int,
        payment_method: PaymentMethod,
        session: AsyncSession,
    ) -> Payment:
        """Create a Stripe Payment Intent for an order"""

        statement = select(Order).where(Order.id == order_id)
        result = await session.execute(statement)
        order = result.scalar_one_or_none()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.user_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        if order.status != OrderStatus.PENDING:
            raise HTTPException(
                status_code=400, detail="Can only create payment for pending orders"
            )

        statement = select(Payment).where(Payment.order_id == order_id)
        result = await session.execute(statement)
        existing_payment = result.scalar_one_or_none()

        if existing_payment:
            if existing_payment.status == PaymentStatus.SUCCEEDED:
                raise HTTPException(
                    status_code=400, detail="Payment already completed for this order"
                )
            return existing_payment

        # cod
        if payment_method == PaymentMethod.CASH_ON_DELIVERY:
            new_payment = Payment(
                order_id=order_id,
                amount=order.total_amount,
                payment_method=PaymentMethod.CASH_ON_DELIVERY,
                status=PaymentStatus.PENDING,
            )

            session.add(new_payment)

            order.status = OrderStatus.CONFIRMED
            order.updated_at = datetime.now()
            session.add(order)
            await session.commit()
            await session.refresh(new_payment)
            return new_payment

        # stripe (requires a valid API key)
        if not stripe.api_key or "YOUR_KEY_HERE" in stripe.api_key:
            raise HTTPException(
                status_code=400, detail="Stripe is not configured; use cash_on_delivery"
            )
        # stripe
        try:
            amount_cents = int(order.total_amount * 100)
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency="usd",
                metadata={"order_id": order_id, "user_id": user_id},
                automatic_payment_methods={"enabled": True},
            )

            new_payment = Payment(
                order_id=order_id,
                stripe_payment_intent_id=payment_intent.id,
                stripe_client_secret=payment_intent.client_secret,
                amount=order.total_amount,
                currency="usd",
                payment_method=payment_method,
                status=PaymentStatus.PENDING,
            )
            session.add(new_payment)
            await session.commit()
            await session.refresh(new_payment)

            return new_payment

        except stripe.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")

    async def handle_payment_webhook(
        self, payment_intent_id: str, status: str, session: AsyncSession
    ):
        """Handle Stripe webhook events to update payment status"""
        statement = select(Payment).where(
            Payment.stripe_payment_intent_id == payment_intent_id
        )
        result = await session.execute(statement)
        payment = result.scalar_one_or_none()

        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")

        # Update payment status based on Stripe event
        if status == "succeeded":
            payment.status = PaymentStatus.SUCCEEDED

            # Update order status
            statement = select(Order).where(Order.id == payment.order_id)
            result = await session.execute(statement)
            order = result.scalar_one_or_none()

            if order:
                order.status = OrderStatus.CONFIRMED
                order.updated_at = datetime.now()
                session.add(order)

        elif status == "processing":
            payment.status = PaymentStatus.PROCESSING

        elif status == "payment_failed":
            payment.status = PaymentStatus.FAILED

        payment.updated_at = datetime.now()
        session.add(payment)
        await session.commit()
        await session.refresh(payment)

        return payment

    async def get_payment_by_order(
        self, order_id: int, user_id: int, session: AsyncSession
    ) -> Optional[Payment]:
        statement = select(Order).where(Order.id == order_id)
        result = await session.execute(statement)
        order = result.scalar_one_or_none()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.user_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        statement = select(Payment).where(Payment.order_id == order_id)
        result = await session.execute(statement)
        payment = result.scalar_one_or_none()

        return payment

    async def refund_payment(self, payment_id: int, session: AsyncSession) -> Payment:
        """Refund a payment (admin only)"""
        statement = select(Payment).where(Payment.id == payment_id)
        result = await session.execute(statement)
        payment = result.scalar_one_or_none()

        if not payment:
            raise HTTPException(status_code=404, detail="Payment not found")

        if payment.status != PaymentStatus.SUCCEEDED:
            raise HTTPException(
                status_code=400, detail="Can only refund succeeded payments"
            )
        if payment.stripe_payment_intent_id:
            try:
                stripe.Refund.create(payment_intent=payment.stripe_payment_intent_id)
            except stripe.error.StripeError as e:
                raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")

        # Update payment status
        payment.status = PaymentStatus.REFUNDED
        payment.updated_at = datetime.now()
        session.add(payment)
        await session.commit()
        await session.refresh(payment)

        return payment
