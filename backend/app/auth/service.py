import httpx
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.auth.utils import create_access_token, generate_hash, verify_hash
from app.config import Config
from app.models.user import User


class AuthService:
    async def get_user_by_email(self, email: str, session: AsyncSession):
        statement = select(User).where(User.email == email)
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    async def is_user_exist(self, email: str, session: AsyncSession):
        user = await self.get_user_by_email(email, session)
        return user is not None

    async def update_user(self, user: User, data: dict, session: AsyncSession):
        for key, value in data.items():
            setattr(user, key, value)
        await session.commit()
        return user

    # # (Example) Handle Google callback
    async def google_callback_handler(self, code: str, session: AsyncSession):
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": Config.GOOGLE_CLIENT_ID,
            "client_secret": Config.GOOGLE_CLIENT_SECRET,
            "redirect_uri": Config.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        }

        async with httpx.AsyncClient() as client:
            token_response = await client.post(token_url, data=data)
            token_response.raise_for_status()
            tokens = token_response.json()

            access_token = tokens["access_token"]

            # Get user info
            userinfo_response = await client.get(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                params={"alt": "json"},
                headers={"Authorization": f"Bearer {access_token}"},
            )
            userinfo_response.raise_for_status()
            userinfo = userinfo_response.json()

            email = userinfo["email"]
            name = userinfo.get("name")

            # Optional: create or update user in DB
            if not await self.is_user_exist(email, session):
                new_user = User(email=email, name=name)
                session.add(new_user)
                await session.commit()

            return access_token, tokens.get("refresh_token", "")

    async def manual_register(
        self, email: str, password: str, name: str, role: str, session: AsyncSession
    ):
        if await self.get_user_by_email(email, session):
            raise ValueError("User already exists")

        print(role)
        print(password)
        userRole = False
        if role == "ADMIN":
            userRole = True

        user = User(
            email=email, password=generate_hash(password), name=name, admin=userRole
        )
        session.add(user)
        await session.commit()
        return user

    async def login(self, email: str, password: str, session: AsyncSession):
        user = await self.get_user_by_email(email, session)
        print(user)
        if not user or not verify_hash(user.password, password):
            return None
        return create_access_token({"user": {"email": user.email, "admin": user.admin}})
