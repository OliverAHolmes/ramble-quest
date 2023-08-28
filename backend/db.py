"""Module for database setup and utilities using SQLModel and SQLAlchemy."""

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
    """Creates a new database if it doesn't exist, and removes it if we are in testing mode."""

    if settings.ENV == "testing" and os.path.exists(settings.db_path):
        os.remove(settings.db_path)

    if not os.path.exists(settings.db_path):
        SQLModel.metadata.create_all(engine)


def get_db():
    """Gets a new database session and closes it when done.

    Yields:
        Session: a new database session
    """

    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
