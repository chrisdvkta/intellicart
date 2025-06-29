from datetime import datetime
from enum import Enum
from typing import Optional
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY, BYTEA, ENUM, TIMESTAMP

from sqlmodel import Column, Field, SQLModel


class ProviderEnum(Enum):
    GOOGLE = "GOOGLE"
    CREDENTIALS = "CREDENTIALS"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int = Field(default=None, primary_key=True)
    created_at: datetime = Field(sa_column=Column(TIMESTAMP, default=datetime.now()))
    updated_at: datetime = Field(sa_column=Column(TIMESTAMP, default=datetime.now()))

    email: str = Field(unique=True)
    password: Optional[str] = Field(exclude=True)
    name: str
    image: Optional[str] = Field(default="https://i.imgur.com/2yaf2wb.png")
    provider: Optional[ProviderEnum] = Field(
        default=ProviderEnum.CREDENTIALS,
        sa_column=Column(ENUM(ProviderEnum), nullable=True),
    )
    refreshToken: Optional[str] = Field(exclude=True)
    status: int = Field(default=1)

    def __repr__(self):
        return f"<User {self.email}>"
