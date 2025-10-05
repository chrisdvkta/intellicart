from datetime import timedelta, datetime
from fastapi import HTTPException
import jwt
from passlib.context import CryptContext
from starlette.status import HTTP_401_UNAUTHORIZED

from app.config import Config

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000
passwd_context = CryptContext(
    schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12, bcrype__min_rounds=10
)


def generate_hash(passwd: str) -> str:
    return passwd_context.hash(passwd)


def verify_hash(hash: str, passwd: str) -> bool:
    return passwd_context.verify(passwd, hash)


def decode_token(token: str):
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        print("RECEIVED PAYLOAD AFTER SENDING TOKEN ", payload)
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, Config.SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.DecodeError:
        return None
