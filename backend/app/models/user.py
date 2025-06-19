from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

# from app.schemas.user import UserBase


# class User(UserBase, table=True):
#     __tablename__ = "users"

#     id: int = Field(default=None, primary_key=True)
#     password_hash: str
#     created_at: Optional[datetime] = Field(default_factory=datetime.now)
#     updated_at: Optional[datetime] = Field(default_factory=datetime.now)


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
