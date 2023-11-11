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
# GDAL_LIBRARY_PATH = os.getenv('GDAL_LIBRARY_PATH')
# GEOS_LIBRARY_PATH = os.getenv('GEOS_LIBRARY_PATH')

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
# from osgeo import gdal
# import io
# from starlette.responses import StreamingResponse
# import services.tiles as tiles

from routers import (
    home,
    health,
    features,
)

from db import create_db

create_db()

app = FastAPI(
    title="Ramble Quest API",
    description="API for the Ramble Quest game.",
    version="0.1.0",
)
# app.include_router(router)

app.include_router(health.router, tags=["healthcheck"])
app.include_router(home.router, tags=["home"])
app.include_router(features.router, tags=["features"], prefix="/features")


# @app.get("/")
# async def read_root():
#     """Root endpoint for the FastAPI application.

#     Returns:
#         dict: A dictionary containing a welcome message.
#     """
#     return {"message": "Welcome to the Ramble Quest API!!!"}


# @app.get("/gdal-version")
# def get_gdal_version():
#     return {"gdal_version": gdal.__version__}

# @app.get("/{path:path}")
# async def tile(path: str):
#     req_para = path.split("/")
#     if len(req_para) < 4:
#         raise HTTPException(status_code=400, detail="Invalid path format")

#     layer_name = req_para[0]
#     layer_zoom = req_para[1]
#     layer_row = req_para[2]
#     layer_col = req_para[3]

#     return_image = tiles.return_tile(
#         layer_name, int(layer_row), int(layer_col), int(layer_zoom)
#     )

#     if return_image.mode in ("RGBA", "P"):
#         format = "png"
#     else:
#         return_image = return_image.convert("RGB")
#         format = "jpeg"

#     byte_io = io.BytesIO()
#     return_image.save("test.png", format=format.upper())
#     return_image.save(byte_io, format=format.upper())
#     byte_io.seek(0)  # Reset the pointer to the beginning of the stream.

#     headers = {
#         "Content-Length": str(byte_io.getbuffer().nbytes),
#         "Content-Type": f"image/{format}",
#     }

#     return StreamingResponse(byte_io, headers=headers, media_type=f"image/{format}")


@app.get("/favicon.ico")
def favicon():
    return {}

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
