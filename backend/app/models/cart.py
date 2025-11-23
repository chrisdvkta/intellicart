from datetime import datetime
from sqlmodel import Field, SQLModel


class Cart(SQLModel, table=True):
    __tablename__ = "carts"
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class CartItem(SQLModel, table=True):
    __tablename__ = "cart_items"
    id: int = Field(default=None, primary_key=True)
    cart_id: int = Field(foreign_key="carts.id")
    product_id: int = Field(foreign_key="products.id")
    quantity: int = Field(default=1, gt=0)
    price_at_time: float
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class CartCreate(SQLModel):
    user_id: int


class CartItemCreate(SQLModel):
    product_id: int
    quantity: int = Field(default=1, gt=0)
