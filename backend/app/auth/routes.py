from enum import verify
from fastapi import APIRouter
from fastapi.responses import JSONResponse, RedirectResponse
from app.auth.service import AuthService
from app.auth.utils import generate_hash, verify_hash
from app.config import Config
from app.db.main import sessionInstance
from app.models.user import User
from app.auth.dependencies import current_user_data
from starlette.status import HTTP_200_OK

auth_router = APIRouter()
auth_service = AuthService()

cookie_options = {
    "httponly": True,
    "secure": False,  # Set True in production (requires HTTPS)
    "samesite": "lax",  # Or "none" with secure=True
    "path": "/",
}


@auth_router.get("/google")
def login_via_google():
    print("USING REDIRECT URL : ", Config.GOOGLE_REDIRECT_URI)
    auth_url = f"https://accounts.google.com/o/oauth2/auth?client_id={Config.GOOGLE_CLIENT_ID}&redirect_uri={Config.GOOGLE_REDIRECT_URI}&scope=profile email&response_type=code&include_granted_scopes=true&access_type=online"
    return RedirectResponse(auth_url)


@auth_router.get("/google/callback")
async def auth_via_google(code: str, session: sessionInstance):
    token_data = await auth_service.google_callback_handler(code, session)
    response = JSONResponse(content={"message": "Login Successful"})
    response.set_cookie(key="access_token", value=token_data[0], **cookie_options)
    response.set_cookie(key="refresh_token", value=token_data[1], **cookie_options)
    return response


@auth_router.post("/register")
async def register(body: dict, session: sessionInstance):
    try:
        await auth_service.manual_register(
            body["email"], body["password"], body["name"], session
        )
        return {"message": "Registered successfully"}
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})


@auth_router.post("/login")
async def login(body: dict, session: sessionInstance):
    token = await auth_service.login(body["email"], body["password"], session)

    if not token:
        return JSONResponse(status_code=401, content={"error": "Invalid credentials"})
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(key="access_token", value=token, **cookie_options)
    return response


@auth_router.get("/me")
async def get_profile(user: current_user_data):
    return {"email": user.email, "name": user.name}
