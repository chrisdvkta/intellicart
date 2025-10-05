from datetime import datetime
from typing import List
from fastapi import HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderCreate, OrderItem, OrderStatus
from app.models.product import Product


class OrderService:
    async def create_order_from_cart(
        self, session: AsyncSession, cart_id: int, user_id: int, order_data: OrderCreate
    ):
        total_amount = 0

        # validate cart items
        statement = select(Cart).where(Cart.id == cart_id)
        result = await session.execute(statement)
        cart = result.scalar_one_or_none()
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        if cart.user_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        statement = select(CartItem).where(CartItem.cart_id == cart_id)
        result = await session.execute(statement)
        cart_items: List[CartItem] = result.scalars().all()
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        for cart_item in cart_items:
            statement = select(Product).where(Product.id == cart_item.product_id)
            result = await session.execute(statement)
            product: Product = result.scalar_one_or_none()

            if not product or not product.is_active:
                raise HTTPException(
                    status_code=400,
                    detail=f"Product {cart_item.product_id} is not available",
                )

            if product.stock_quantity < cart_item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}. Available: {product.stock_quantity}, Requested: {cart_item.quantity}",
                )
            total_amount += cart_item.quantity * cart_item.price_at_time

        # create order
        new_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            shipping_address=order_data.shipping_address,
            payment_method=order_data.payment_method,
            status=OrderStatus.PENDING,
        )
        session.add(new_order)
        await session.flush()
        await session.refresh(new_order)
        # create order-items
        for cart_item in cart_items:
            statement = select(Product).where(Product.id == cart_item.product_id)
            result = await session.execute(statement)
            product: Product = result.scalar_one_or_none()

            product.stock_quantity -= cart_item.quantity
            session.add(product)
            new_order_item = OrderItem(
                order_id=new_order.id,
                quantity=cart_item.quantity,
                price_at_time=cart_item.price_at_time,
                product_id=cart_item.product_id,
            )
            session.add(new_order_item)

        await session.commit()
        await session.refresh(new_order)
        # clear cart
        for cart_item in cart_items:
            await session.delete(cart_item)

        await session.commit()
        return new_order

    async def get_user_orders(self, user_id: int, session: AsyncSession):
        statement = (
            select(Order)
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        )
        result = await session.execute(statement)
        orders = result.scalars().all()
        return orders

    async def get_order_by_id(self, order_id: int, user_id: int, session: AsyncSession):
        statement = select(Order).where(Order.id == order_id)
        result = await session.execute(statement)
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.user_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        return order

    async def update_order_status(
        self, order_id: int, new_status: OrderStatus, session: AsyncSession
    ):
        statement = select(Order).where(Order.id == order_id)
        result = await session.execute(statement)
        order: Order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order.status == OrderStatus.CANCELLED:
            raise HTTPException(status_code=400, detail="Cannot modify cancelled order")

        status_order = {
            OrderStatus.PENDING: 1,
            OrderStatus.CONFIRMED: 2,
            OrderStatus.PROCESSING: 3,
            OrderStatus.SHIPPED: 4,
            OrderStatus.DELIVERED: 5,
        }

        if new_status != OrderStatus.CANCELLED:
            if status_order.get(new_status, 0) < status_order.get(order.status, 0):
                raise HTTPException(
                    status_code=400, detail="Cannot move order to a previous status"
                )
        order.status = new_status
        order.updated_at = datetime.now()
        session.add(order)
        await session.commit()
        await session.refresh(order)
        return order

    async def cancel_order(self, order_id: int, user_id: int, session: AsyncSession):
        statement = select(Order).where(Order.id == order_id)
        result = await session.execute(statement)
        order: Order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if order.user_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        if order.status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot cancel order with status: {order.status}",
            )

        statement = select(OrderItem).where(OrderItem.order_id == order_id)
        result = await session.execute(statement)
        order_items = await result.scalars().all()

        # restock
        for order_item in order_items:
            statement = select(Product).where(Product.id == order_item.product_id)
            result = await session.execute(statement)
            product: Product = result.scalar_one_or_none()
            if product:
                product.stock_quantity += order_item.quantity
                session.add(product)

            order.status = OrderStatus.CANCELLED
            order.updated_at = datetime.now()
            session.add(order)

        await session.commit()
        await session.refresh(order)
        return order
