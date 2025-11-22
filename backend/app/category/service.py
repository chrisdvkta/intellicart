from datetime import datetime
from fastapi import HTTPException
from sqlalchemy import Select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.category import Category, CategoryCreate


class CategoryService:
    async def get_all_categories(self, session: AsyncSession):
        statement = Select(Category)
        result = await session.execute(statement)
        categories = result.scalars().all()
        return {
            "categories": categories,
            "item_count": len(categories),
        }

    async def get_category_by_id(self, category_id: int, session: AsyncSession):
        statement = Select(Category).where(Category.id == category_id)
        result = await session.execute(statement)
        category = result.scalar_one_or_none()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category

    async def create_category(
        self, category_data: CategoryCreate, session: AsyncSession
    ):
        statement = Select(Category).where(Category.name == category_data.name)
        result = await session.execute(statement)
        existing_category = result.scalar_one_or_none()

        if existing_category:
            raise HTTPException(
                status_code=400, detail="Category with this name already exists"
            )

        new_category = Category(**category_data.model_dump())
        session.add(new_category)
        await session.commit()
        await session.refresh(new_category)
        return new_category

    async def update_category(
        self, category_id: int, category_data: CategoryCreate, session: AsyncSession
    ):
        statement = Select(Category).where(Category.id == category_id)
        result = await session.execute(statement)
        category = result.scalar_one_or_none()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        if category_data.name != category.name:
            statement = Select(Category).where(Category.name == category_data.name)
            result = await session.execute(statement)
            existing_category = result.scalar_one_or_none()

            if existing_category:
                raise HTTPException(
                    status_code=400, detail="Category with this name already exists"
                )

        category.name = category_data.name
        category.description = category_data.description
        category.image_url = category_data.image_url
        category.is_active = category_data.is_active
        category.updated_at = datetime.now()
        session.add(category)
        await session.commit()
        await session.refresh(category)
        return category

    async def delete_category(self, category_id: int, session: AsyncSession):
        statement = Select(Category).where(Category.id == category_id)
        result = await session.execute(statement)
        category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        session.delete(category)
        await session.commit()
        return {"message": "Category deleted successfully"}
