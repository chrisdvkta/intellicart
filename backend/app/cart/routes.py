from typing import Dict
from fastapi import APIRouter, Depends, Query

from app.cart.service import CartService
from app.models.cart import CartItemCreate
from app.db.main import sessionInstance
from app.auth.dependencies import current_user_data

cart_router = APIRouter()
cart_service = CartService()


@cart_router.get("/cart")
async def get_cart(session: sessionInstance, user: Dict = Depends(current_user_data)):
    cart = await cart_service.get_or_create_cart(user["id"], session)
    cart_details = await cart_service.get_cart_with_items(
        cart_id=cart.id, user_id=user["id"], session=session
    )
    return cart_details


@cart_router.post("/cart/items")
async def add_to_cart(
    item: CartItemCreate,
    session: sessionInstance,
    user: Dict = Depends(current_user_data),
):
    return await cart_service.add_item_to_cart(
        user_id=user["id"],
        product_id=item.product_id,
        quantity=item.quantity,
        session=session,
    )


@cart_router.put("/cart/items/{item_id}")
async def update_cart_item(
    item_id: int,
    session: sessionInstance,
    quantity: int = Query(..., ge=0, le=999, description="New quantity (0 to remove)"),
    user: Dict = Depends(current_user_data),
):
    return await cart_service.update_item_quantity(
        cart_item_id=item_id, quantity=quantity, user_id=user["id"], session=session
    )


@cart_router.delete("/cart/items/{item_id}")
async def remove_cart_item(
    item_id: int,
    session: sessionInstance,
    user: Dict = Depends(current_user_data),
):
    return await cart_service.remove_item_from_cart(
        cart_item_id=item_id, user_id=user["id"], session=session
    )
