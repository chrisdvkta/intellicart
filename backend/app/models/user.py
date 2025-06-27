from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import Column, Field, SQLModel
from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import pg

# rom app.schemas.user import UserBase


# class User(UserBase, table=True):
#     __tablename__ = "users"

#     id: int = Field(default=None, primary_key=True)
#     password_hash: str
#     created_at: Optional[datetime] = Field(default_factory=datetime.now)
#     updated_at: Optional[datetime] = Field(default_factory=datetime.now)


class providerEnum(Enum):
    GOOGLE = "GOOGLE"
    CREDENTIALS = "CREDENTIALS"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int = Field(default=None, primary_key=True)  # use uuid as a future update
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now()))
    updated_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now()))
    email: str = Field(unique=True)
    password: Optional[str] = Field(exclude=True)
    name: str
    image: Optional[str] = Field(
        default="https://ui-avatars.com/api/?name=User&background=random"
    )
    provider: providerEnum = Field(sa_column=Column(pg.ENUM(providerEnum)))
    refreshToken: Optional[str] = Field(exclude=True)
    status: int = Field(default=1)

    # lists: List["AudienceList"] = Relationship(back_populates="user", sa_relationship_kwargs={"lazy": "selectin"}) todo:relationships


def __repr__(self):
    return f"<User {self.email}>"
