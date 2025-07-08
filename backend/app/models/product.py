from datetime import datetime
from typing import Optional
from sqlmodel import Column, Field, SQLModel
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY, BYTEA, ENUM, TIMESTAMP


class Product(SQLModel, table=True):
    __tablename__ = "products"
    id: int = Field(default=None, primary_key=True)
    name: str
    description: str
    price: float
    stock_quantity: int
    category_id: Optional[int] = Field(default=None)
    image_url: str
    is_active: bool
    created_at: datetime = Field(sa_column=Column(TIMESTAMP, default=datetime.now()))
    updated_at: datetime = Field(sa_column=Column(TIMESTAMP, default=datetime.now()))

    def __repr__(self):
        return f"<Product {self.name}>"


class ProductCreate(SQLModel):
    name: str
    description: str
    price: float
    stock_quantity: int
    category_id: Optional[int] = None
    image_url: str
    is_active: bool
