import os
from typing import Dict
from fastapi import APIRouter, Body, Depends, HTTPException, Request
import stripe

from app.auth.dependencies import get_current_user
from app.payment.service import PaymentService
from app.db.main import sessionInstance
from app.models.payment import PaymentMethod


payment_router = APIRouter()

# Initialize payment service with Stripe key from environment
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_YOUR_KEY_HERE")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_YOUR_WEBHOOK_SECRET")
payment_service = PaymentService(stripe_api_key=STRIPE_SECRET_KEY)


@payment_router.post("/payments/create")
async def create_payment(
    order_id: int,
    session: sessionInstance,
    payment_method: PaymentMethod = Body(default=PaymentMethod.CASH_ON_DELIVERY, embed=True),
    user: Dict = Depends(get_current_user),
):
    """Create a payment intent for an order"""

    payment = await payment_service.create_payment_intent(
        order_id=order_id,
        user_id=user.id,
        payment_method=payment_method or PaymentMethod.CASH_ON_DELIVERY,
        session=session,
    )

    return {
        "payment_id": payment.id,
        "order_id": payment.order_id,
        "amount": payment.amount,
        "currency": payment.currency,
        "status": payment.status,
        "client_secret": payment.stripe_client_secret,  # Frontend needs this
        "payment_method": payment.payment_method,
    }


@payment_router.get("/payments/order/{order_id}")
async def get_payment_by_order(
    order_id: int, session: sessionInstance, user: Dict = Depends(get_current_user)
):
    """Get payment details for an order"""
    payment = await payment_service.get_payment_by_order(
        order_id=order_id, user_id=user.id, session=session
    )

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    return payment


@payment_router.post("/payment/webhook")
async def stripe_webhook(request: Request, session: sessionInstance):
    """Handle Stripe webhook events"""

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "payment_intent:succeeded":
        payment_intent = event["data"]["object"]
        await payment_service.handle_payment_webhook(
            payment_intent_id=payment_intent["id"], status="succeeded", session=session
        )

    elif event["type"] == "payment_intent.processing":
        payment_intent = event["data"]["object"]
        await payment_service.handle_payment_webhook(
            payment_intent_id=payment_intent["id"], status="processing", session=session
        )

    elif event["type"] == "payment_intent.payment_failed":
        payment_intent = event["data"]["object"]
        await payment_service.handle_payment_webhook(
            payment_intent_id=payment_intent["id"],
            status="payment_failed",
            session=session,
        )

    return {"status": "success"}


@payment_router.post("/payments/{payment_id}/refund")
async def refund_payment(
    payment_id: int,
    session: sessionInstance,
    user: Dict = Depends(get_current_user),
):
    """Refund a payment (Admin only)"""

    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    payment = await payment_service.refund_payment(
        payment_id=payment_id, session=session
    )

    return {"message": "Payment refunded successfully", "payment": payment}
