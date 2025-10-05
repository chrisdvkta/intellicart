from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Category(SQLModel, table=True):
    __tablename__ = "categories"
    id: int = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    description: str
    image_url: Optional[str] = None
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class CategoryCreate(SQLModel):
    name: str
    description: str
    image_url: Optional[str] = None
    is_active: bool = Field(default=True)
