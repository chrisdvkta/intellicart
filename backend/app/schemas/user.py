from typing import Optional
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    first_name = Optional[str] = None
    last_name = Optional[str] = None
    is_active = bool = True


class UserCreate(UserBase):
    password: str
