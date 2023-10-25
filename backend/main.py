"""Main module for the FastAPI application.

This module initializes the FastAPI application, database, and includes all the routes.
It also sets up CORS (Cross-Origin Resource Sharing) to allow requests from specified origins.

Functions:
    create_db(): Initializes the database by creating all tables.

Imports:
    FastAPI: Class to create a new FastAPI instance.
    CORSMiddleware: Middleware for managing CORS.
    create_db: Function to initialize the database.
    router: FastAPI router containing all application routes.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from db import create_db
# from routes import router

# create_db()

app = FastAPI()
# app.include_router(router)

@app.get("/")
async def read_root():
    """Root endpoint for the FastAPI application.

    Returns:
        dict: A dictionary containing a welcome message.
    """
    return {"message": "Welcome to the Ramble Quest API!!!"}

# CORS configuration
origins = [
    "*",  # Adjust this as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
