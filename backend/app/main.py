from fastapi import APIRouter, FastAPI
from app.auth.routes import auth_router
from app.products.routes import product_router
from app.db.main import init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


@app.on_event("startup")
async def on_startup():
    await init_db()


@app.get("/")
async def root():
    return {"message": "Hello World"}


v1_router = APIRouter(prefix="/v1")
v1_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
v1_router.include_router(product_router, tags=["Products"])
app.include_router(v1_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
