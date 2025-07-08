from typing import Annotated
from fastapi import APIRouter, Body

from app.models.product import Product, ProductCreate
from app.products.service import ProductService
from app.db.main import sessionInstance

product_router = APIRouter()
product_service = ProductService()


@product_router.get("/products")
async def fetch_products():
    return {"testing products": "shoudl send all products"}


@product_router.post("/products")
async def post_products(
    product: Annotated[ProductCreate, Body()], session: sessionInstance
):
    return await product_service.add_product(product, session)
