from typing import Annotated
from fastapi import Depends, HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED
from app.auth.utils import decode_token
from app.auth.service import AuthService
from app.db.main import sessionInstance
from app.models.user import User
from app.utils import get_token_from_header

auth_service = AuthService()


async def get_current_user(session: sessionInstance, token: str = Depends(get_token_from_header)):
    """Resolve the user from the Authorization header Bearer token."""
    token_data = decode_token(token)
    email = token_data["user"]["email"]
    user = await auth_service.get_user_by_email(email, session)
    if not user:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


current_user_data = Annotated[User, Depends(get_current_user)]
