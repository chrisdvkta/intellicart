from typing import Dict
from fastapi import APIRouter, Depends, Body, HTTPException
from app.auth.dependencies import get_current_user
from app.db.main import sessionInstance
from app.order.service import OrderService
from app.models.order import OrderCreate, OrderStatus
from app.models.user import User

order_router = APIRouter()
order_service = OrderService()


@order_router.post("/orders/from-cart")
async def create_order_from_cart(
    cart_id: int,
    order_data: OrderCreate,
    session: sessionInstance,
    user: Dict = Depends(get_current_user),
):
    """Convert user's cart to order"""
    return await order_service.create_order_from_cart(
        session=session,
        cart_id=cart_id,
        user_id=user.id,
        order_data=order_data,
    )


@order_router.get("/orders")
async def get_user_orders(
    session: sessionInstance, user: Dict = Depends(get_current_user)
):
    """Get user's order history"""
    return await order_service.get_user_orders(user_id=user.id, session=session)


@order_router.get("/orders/all")
async def get_all_orders(session: sessionInstance, user: User = Depends(get_current_user)):
    """Admin: Get all orders"""
    if not getattr(user, "admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return await order_service.get_all_orders(session=session)


@order_router.get("/orders/{order_id}")
async def get_order_details(
    order_id: int,
    session: sessionInstance,
    user: Dict = Depends(get_current_user),
):
    """Get specific order details"""
    return await order_service.get_order_by_id(
        order_id=order_id, user_id=user.id, session=session
    )


@order_router.patch("/orders/{order_id}/status")
async def update_order_status(
    order_id: int,
    session: sessionInstance,
    new_status: OrderStatus = Body(..., embed=True),
    user: Dict = Depends(get_current_user),
):
    print(user)
    """Admin: Update order status"""
    if not user.admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await order_service.update_order_status(
        order_id=order_id, new_status=new_status, session=session
    )


@order_router.post("/orders/{order_id}/cancel")
async def cancel_order(
    order_id: int,
    session: sessionInstance,
    user: Dict = Depends(get_current_user),
):
    """User: Cancel pending order"""
    return await order_service.cancel_order(
        order_id=order_id, user_id=user.id, session=session
    )
