from datetime import datetime
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
