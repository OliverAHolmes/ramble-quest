from fastapi import FastAPI

from db import init_db
from routes import api

init_db()

app = FastAPI()
app.include_router(api)
