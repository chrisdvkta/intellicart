from typing import Optional
from fastapi import Header, HTTPException

from app.auth.utils import decode_token


async def get_token_from_header(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    return authorization.split(" ", 1)[1]


async def get_current_token(authorization: Optional[str] = Header(None)):
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = authorization[len("Bearer ") :]
    try:
        payload = decode_token(token)
        print(payload)
        if payload:
            return token
    except HTTPException:
        raise HTTPException(status_code=401, detail="Missing or invalid token")
