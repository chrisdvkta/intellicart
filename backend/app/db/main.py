from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, select
from app.auth.utils import generate_hash
from app.models.user import User
from app.config import Config

engine = create_async_engine(Config.DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    await seed_admin()


async def seed_admin():
    async with SessionLocal() as session:
        exists = await session.execute(
            select(User).where(User.email == Config.ADMIN_EMAIL)
        )
        if exists.scalar_one_or_none():
            return

        admin_user = User(
            email=Config.ADMIN_EMAIL,
            password=generate_hash(Config.ADMIN_PASSWORD),
            name=Config.ADMIN_NAME,
            admin=True,
        )
        session.add(admin_user)
        await session.commit()


async def get_session():
    async with SessionLocal() as session:
        yield session


sessionInstance = Annotated[AsyncSession, Depends(get_session)]
