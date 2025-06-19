from fastapi import Depends, FastAPI
from sqlmodel import SQLModel, Session, text
from app.database import engine, get_session
from app.models.user import User


app = FastAPI()


@app.on_event("startup")
async def startup_event():
    SQLModel.metadata.create_all(engine)
    print("tables created")


@app.get("/")
async def read_root():
    return {"hello"}


# @app.get("/users")
# def read_users(session: Session = Depends(get_session)):
#     users = session.exec(text("SELECT * FROM user")).all()
#     return {users}


@app.post("/users")
def create_user(name: str, session: Session = Depends(get_session)):
    user = User(name=name)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
