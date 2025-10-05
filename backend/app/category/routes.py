from typing import Dict
from fastapi import APIRouter, Depends, HTTPException
from app.auth.dependencies import get_current_user
from app.category.service import CategoryService
from app.db.main import sessionInstance
from app.models.category import CategoryCreate

category_router = APIRouter()
category_service = CategoryService()


@category_router.get("/categories")
async def get_categories(session: sessionInstance):
    return await category_service.get_all_categories(session)


@category_router.post("/categories")
async def create_categories(
    category: CategoryCreate,
    session: sessionInstance,
    user: Dict = Depends(get_current_user),
):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return await category_service.create_category(category, session)


@category_router.get("/category/{id}")
async def get_specific_category(id: int, session: sessionInstance):
    return await category_service.get_category_by_id(id, session)


@category_router.put("/categories/{id}")
async def update_category(
    id: int,
    category: CategoryCreate,
    session: sessionInstance,
    user: Dict = Depends(get_current_user),
):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await category_service.update_category(id, category, session)


@category_router.delete("/categories/{id}")
async def delete_category(
    id: int, session: sessionInstance, user: Dict = Depends(get_current_user)
):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await category_service.delete_category(id, session)
