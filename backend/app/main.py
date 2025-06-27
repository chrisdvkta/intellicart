from fastapi import Depends, FastAPI
from sqlmodel import SQLModel, Session, text
from app.database import engine, get_session
from app.models.user import User, UserCreate


app = FastAPI()


@app.on_event("startup")
async def startup_event():
    SQLModel.metadata.create_all(engine)
    print("tables created")


@app.get("/")
async def read_root():
    return {"hello"}


@app.post("/users")
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    db_user = User(**user.dict())
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
