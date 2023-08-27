from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import create_db
from routes import router

create_db()

app = FastAPI()
app.include_router(router)

# CORS configuration
origins = [
    "http://localhost:3000",  # Adjust this as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
