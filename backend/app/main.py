from fastapi import FastAPI
from sqlmodel import SQLModel
from app.database import engine


app = FastAPI()


@app.on_event("startup")
async def startup_event():
    SQLModel.metadata.create_all(engine)
    print("working")


@app.get("/")
async def read_root():
    return {"hello"}
