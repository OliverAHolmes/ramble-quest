from fastapi import FastAPI

from db import init_db
from routes import router

init_db()

app = FastAPI()
app.include_router(router)
