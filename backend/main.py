from fastapi import FastAPI

from db import create_db
from routes import router

create_db()

app = FastAPI()
app.include_router(router)
