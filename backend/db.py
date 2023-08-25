import os
from sqlmodel import create_engine, SQLModel
from sqlalchemy.orm import sessionmaker
from config import settings


SQLALCHEMY_DATABASE_URL = f"sqlite:///{settings.db_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_db():
    if settings.ENV == "testing" and os.path.exists(settings.db_path):
        os.remove(settings.db_path)

    if not os.path.exists(settings.db_path):
        SQLModel.metadata.create_all(engine)
"type"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
