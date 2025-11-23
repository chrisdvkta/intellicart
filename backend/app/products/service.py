from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy import Select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.category import Category
from app.models.product import Product, ProductCreate


class ProductService:
    async def add_product(self, data: ProductCreate, session: AsyncSession):
        if data.category_id:
            category_statement = Select(Category).where(Category.id == data.category_id)
            result = await session.execute(category_statement)
            category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(
                status_code=400,
                detail=f"Category with id {data.category_id} does not exist",
            )
        new_product = Product(
            name=data.name,
            description=data.description,
            price=data.price,
            stock_quantity=data.stock_quantity,
            category_id=data.category_id,
            image_url=data.image_url,
            is_active=data.is_active,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

        session.add(new_product)
        await session.commit()
        await session.refresh(new_product)

        return new_product

    async def fetch_all_products(self, session: AsyncSession):
        statement = Select(Product)
        result = await session.execute(statement)
        return result.scalars().all()

    async def fetch_product(self, product_id: int, session: AsyncSession):
        statement = Select(Product).where(Product.id == product_id)
        result = await session.execute(statement)
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found",
            )
        return product

    async def update_product(
        self, product_id: int, data: ProductCreate, session: AsyncSession
    ):
        statement = Select(Product).where(Product.id == product_id)
        result = await session.execute(statement)
        product = result.scalar_one_or_none()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found",
            )

        product.name = data.name
        product.description = data.description
        product.price = data.price
        product.stock_quantity = data.stock_quantity
        product.category_id = data.category_id
        product.image_url = data.image_url
        product.is_active = data.is_active
        product.updated_at = datetime.now()

        session.add(product)
        await session.commit()
        await session.refresh(product)

        return product

    async def buy_product(self, product_id: int, session: AsyncSession):
        product = await self.fetch_product(product_id, session)
        if not product.is_active or product.stock_quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product is not available for purchase",
            )
        product.stock_quantity -= 1
        product.updated_at = datetime.now()
        session.add(product)
        await session.commit()
        await session.refresh(product)
        return product

    async def delete_product(self, product_id: int, session: AsyncSession):
        statement = Select(Product).where(Product.id == product_id)
        result = await session.execute(statement)
        product = result.scalar_one_or_none()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found",
            )

        await session.delete(product)
        await session.commit()
        return {"message": "Product deleted successfully"}
