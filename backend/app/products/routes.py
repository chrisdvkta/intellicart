from typing import Annotated
from fastapi import APIRouter, Body, Depends, HTTPException, status

from app.models.product import ProductCreate
from app.products.service import ProductService
from app.db.main import sessionInstance
from app.utils import get_current_token
from app.auth.dependencies import get_current_user
from app.models.user import User

product_router = APIRouter()
product_service = ProductService()


@product_router.get("/products")
async def fetch_products(session: sessionInstance):
    return await product_service.fetch_all_products(session)


@product_router.post("/products")
async def post_products(
    product: Annotated[ProductCreate, Body()],
    session: sessionInstance,
    token: Annotated[str, Depends(get_current_token)],
):
    print("Received Token : ", token)
    return await product_service.add_product(product, session)


@product_router.get("/products/{product_id}")
async def fetch_product(product_id: int, session: sessionInstance):
    return await product_service.fetch_product(product_id, session)


@product_router.put("/products/{product_id}")
async def update_product(
    product_id: int,
    product: Annotated[ProductCreate, Body()],
    token: Annotated[str, Depends(get_current_token)],
    session: sessionInstance,
):
    return await product_service.update_product(product_id, product, session)


@product_router.post("/products/{product_id}/buy", status_code=status.HTTP_200_OK)
async def buy_product(
    product_id: int,
    token: Annotated[str, Depends(get_current_token)],
    session: sessionInstance,
):
    print("user token : ", token)
    return await product_service.buy_product(product_id, session)


@product_router.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    session: sessionInstance,
    user: User = Depends(get_current_user),
):
    if not getattr(user, "admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return await product_service.delete_product(product_id, session)
