"""
FastAPI router for handling GeoJSON features.

This module contains endpoints for uploading, retrieving, and deleting GeoJSON
features. Features are saved in a SQLite database.

The upload endpoint expects a valid GeoJSON file and validates it before saving.
The other endpoints allow for retrieval and deletion of features by their IDs.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
import json
from db import SessionLocal
from models import Feature

router = APIRouter(prefix="/features")


@router.post("/upload")
async def upload_geojson(file: UploadFile = File(...)):
    """
    Upload a GeoJSON file to be saved into the database.
    
    Parameters:
        file (UploadFile): The GeoJSON file to upload. The file should be a valid GeoJSON
            with required 'type' and 'features' fields.
            
    Returns:
        dict: Confirmation message and feature_id of the saved GeoJSON.
    
    Raises:
        HTTPException: An exception is raised if the file is not a valid JSON or missing
            required GeoJSON fields ('type' or 'features').
    """

    # Read and parse the GeoJSON file
    geojson_content = await file.read()
    try:
        geojson_dict = json.loads(geojson_content)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid GeoJson content in file.") from exc
    except UnicodeDecodeError as ude:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a vaild GeoJson file.") from ude

    # Validate that it is a GeoJSON file by checking for required properties
    if 'type' not in geojson_dict:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid GeoJSON, missing 'type' field.")
    if 'features' not in geojson_dict:  
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid GeoJSON, missing 'features' field.")

    # Get file name to set as feature_name
    filename = file.filename

    # Initialize database session
    db = SessionLocal()

    db_feature = Feature(feature=geojson_dict, name=filename)
    db.add(db_feature)

    db.commit()
    # Fetching the ID of the committed feature
    feature_id = db_feature.id

    db.close()

    return {"message": "GeoJSON features saved to SQLite", "feature_id": feature_id}


@router.get("")
async def get_all_features():
    """
    Retrieve all features stored in the database.
    
    Returns:
        list: A list of all features.
    """
    db = SessionLocal()
    db_features = db.query(Feature).all()
    db.close()
    return db_features


@router.get("/{feature_id}")
async def get_feature_by_id(feature_id: int):
    """
    Retrieve a specific feature by its ID.
    
    Parameters:
        feature_id (int): The ID of the feature to retrieve.
        
    Returns:
        Feature: The feature object if found.
    """
    db = SessionLocal()
    db_feature = db.query(Feature).filter(Feature.id == feature_id).first()
    db.close()

    if db_feature is None:
        raise HTTPException(status_code=404, detail="Feature not found")

    return db_feature


@router.delete("/delete/{feature_id}")
async def delete_feature_by_id(feature_id: int):
    """
    Delete a specific feature by its ID.
    
    Parameters:
        feature_id (int): The ID of the feature to delete.
        
    Returns:
        dict: Confirmation message.
    """
    db = SessionLocal()
    db_feature = db.query(Feature).filter(Feature.id == feature_id).first()

    if db_feature is None:
        db.close()
        raise HTTPException(status_code=404, detail="Feature not found")

    db.delete(db_feature)
    db.commit()
    db.close()

    return {"message": "Feature deleted"}
