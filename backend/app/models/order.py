from datetime import datetime
from enum import Enum
from typing import List

from sqlmodel import Field, Relationship, SQLModel

from app.models.product import Product


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(SQLModel, table=True):
    __tablename__ = "orders"
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    total_amount: float
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    shipping_address: str
    payment_method: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    items: List["OrderItem"] = Relationship(back_populates="order")


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"
    id: int = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id")
    product_id: int = Field(foreign_key="products.id")
    quantity: int = Field(gt=0)
    price_at_time: float
    created_at: datetime = Field(default_factory=datetime.now)
    order: Order = Relationship(back_populates="items")


class OrderCreate(SQLModel):
    shipping_address: str
    payment_method: str


class OrderItemCreate(SQLModel):
    product_id: int
    quantity: int = Field(default=1, gt=0)


class OrderResponse(Order):
    """Response model that includes order items"""

    items: List["OrderItem"] = []
