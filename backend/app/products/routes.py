from typing import Annotated
from fastapi import APIRouter, Body, Depends
from fastapi.encoders import jsonable_encoder
from requests import session

from app.models.product import Product, ProductCreate
from app.products.service import ProductService
from app.db.main import sessionInstance
from app.utils import get_current_token

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


# @product_router.put("/product/{id}")
# async def update_product(item_id: str, product):
# update_product_encoded = jsonable_encoder()
