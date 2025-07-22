from datetime import datetime
from sqlalchemy import Select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.product import Product, ProductCreate


class ProductService:
    async def add_product(self, data: ProductCreate, session: AsyncSession):
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
        print(result)
        return result

    async def fetch_product(self, product_id: int, session: AsyncSession):
        statement = Select(Product).where(Product.id == product_id)
        result = await session.execute(statement)
        product = result.scalar_one_or_none()
        return product

    async def update_product(
        self, product_id: int, data: ProductCreate, session: AsyncSession
    ):
        statement = Select(Product).where(Product.id == product_id)
        result = await session.execute(statement)
        product = result.scalar_one_or_none()

        if not product:
            return {"error": "product not found"}

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
