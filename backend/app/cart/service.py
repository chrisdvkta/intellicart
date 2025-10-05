from datetime import datetime
from fastapi import HTTPException
from sqlalchemy import select
from app.models.cart import Cart, CartItem
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.product import Product


class CartService:
    async def get_or_create_cart(self, user_id: int, session: AsyncSession) -> Cart:
        statement = select(Cart).where(Cart.user_id == user_id)
        result = await session.execute(statement)
        cart = result.scalar_one_or_none()
        if cart:
            return cart

        new_cart = Cart(user_id=user_id)
        session.add(new_cart)
        await session.commit()
        await session.refresh(new_cart)

        return new_cart

    async def add_item_to_cart(
        self,
        user_id: int,
        product_id: int,
        quantity: int,
        session: AsyncSession,
    ):
        if quantity <= 0:
            raise HTTPException(
                status_code=400, detail="Quantity must be greater than 0"
            )

        cart = await self.get_or_create_cart(user_id, session)

        statement = select(Product).where(Product.id == product_id)
        result = await session.execute(statement)
        product = result.scalar_one_or_none()

        if not product or not product.is_active:
            raise HTTPException(
                status_code=404, detail="Product not found or unavailable"
            )

        statement = select(CartItem).where(
            CartItem.cart_id == cart.id, CartItem.product_id == product_id
        )
        result = await session.execute(statement)
        existing_item = result.scalar_one_or_none()

        if existing_item:
            new_quantity = existing_item.quantity + quantity
            if new_quantity > product.stock_quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock. Available: {product.stock_quantity}, Requested: {new_quantity}",
                )
            existing_item.quantity = new_quantity
            existing_item.updated_at = datetime.now()
            session.add(existing_item)
            await session.commit()
            await session.refresh(existing_item)
            return existing_item
        else:
            if quantity > product.stock_quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock. Available: {product.stock_quantity}, Requested: {quantity}",
                )
            new_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity,
                price_at_time=product.price,
            )
            session.add(new_item)
            await session.commit()
            await session.refresh(new_item)
            return new_item

    async def get_cart_with_items(self, cart_id: int, session: AsyncSession):
        statement = select(Cart).where(Cart.id == cart_id)
        result = await session.execute(statement)
        cart = result.scalar_one_or_none()

        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")

        statement = select(CartItem).where(CartItem.cart_id == cart_id)
        result = await session.execute(statement)
        items = result.scalars().all()
        total = sum(item.quantity * item.price_at_time for item in items)

        return {"cart": cart, "items": items, "total": total, "item_count": len(items)}

    async def update_item_quantity(
        self,
        cart_item_id: int,
        quantity: int,
        user_id: int,
        session: AsyncSession,
    ):
        if quantity < 0:
            raise HTTPException(status_code=400, detail="Quantity cannot be negative")
        statement = select(CartItem).where(CartItem.id == cart_item_id)
        result = await session.execute(statement)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        statement = select(Cart).where(Cart.id == item.cart_id, Cart.user_id == user_id)
        result = await session.execute(statement)
        cart = result.scalar_one_or_none()

        if not cart:
            raise HTTPException(status_code=403, detail="Access denied")

        if quantity == 0:
            await session.delete(item)
            await session.commit()
            return {"message": "Item removed from cart"}

        statement = select(Product).where(Product.id == item.product_id)
        result = await session.execute(statement)
        product = result.scalar_one_or_none()

        if not product or not product.is_active:
            raise HTTPException(
                status_code=404, detail="Product not found or unavailable"
            )

        if quantity > product.stock_quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock. Available: {product.stock_quantity}, Requested: {quantity}",
            )

        item.quantity = quantity
        item.updated_at = datetime.now()
        session.add(item)
        await session.commit()
        await session.refresh(item)
        return item

    async def remove_item_from_cart(
        self, cart_item_id: int, user_id: int, session: AsyncSession
    ):
        statement = select(CartItem).where(CartItem.id == cart_item_id)
        result = await session.execute(statement)
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        statement = select(Cart).where(Cart.id == item.cart_id, Cart.user_id == user_id)
        result = await session.execute(statement)
        cart = result.scalar_one_or_none()

        if not cart:
            raise HTTPException(status_code=403, detail="Access denied")

        await session.delete(item)
        await session.commit()
        return {"message": "Item removed from cart"}
