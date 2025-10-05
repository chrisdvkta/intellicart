from typing import Annotated
from fastapi import Depends, Request, HTTPException
from fastapi.security import OAuth2PasswordBearer
from starlette.status import HTTP_401_UNAUTHORIZED
from app.auth.utils import decode_token
from app.auth.service import AuthService
from app.db.main import sessionInstance
from app.models.user import User

auth_service = AuthService()


class AccessTokenBearer(OAuth2PasswordBearer):
    def __init__(self):
        super().__init__(tokenUrl="/auth/login")

    async def __call__(self, request: Request):
        token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED, detail="Missing token"
            )
        token_data = decode_token(token)
        if not token_data:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        return token_data


async def get_current_user(
    session: sessionInstance, tokenData: dict = Depends(AccessTokenBearer())
):
    email = tokenData["user"]["email"]
    admin = tokenData["user"]["admin"]
    user = await auth_service.get_user_by_email(email, admin, session)
    if not user:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


current_user_data = Annotated[User, Depends(get_current_user)]
