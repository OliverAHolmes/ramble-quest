"""
FastAPI router for handling GeoJSON features.

This module contains endpoints for uploading, retrieving, and deleting GeoJSON
features. Features are saved in a SQLite database.

The upload endpoint expects a valid GeoJSON file and validates it before saving.
The other endpoints allow for retrieval and deletion of features by their IDs.
"""

import json
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from db import SessionLocal
from models import Feature, FeatureCollection
from shapely.geometry import shape, mapping
from geoalchemy2.shape import to_shape
from db import get_db
from sqlalchemy.orm import Session, joinedload

router = APIRouter()


@router.post("/upload")
async def upload_geojson(file: UploadFile = File(...), session: Session = Depends(get_db)):
    """
    Upload a GeoJSON file to be saved into the database.
    """

    # Read and parse the GeoJSON file
    geojson_content = await file.read()
    try:
        geojson_dict = json.loads(geojson_content)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GeoJSON content in file.",
        ) from exc
    except UnicodeDecodeError as ude:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Not a vaild GeoJson file."
        ) from ude

    # Validate that it is a GeoJSON file by checking for required properties
    if geojson_dict.get("type") not in ["Feature", "FeatureCollection"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GeoJSON, missing or incorrect 'type' field.",
        )
    if "features" not in geojson_dict and "geometry" not in geojson_dict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GeoJSON, missing 'geometry' or 'features' field.",
        )

    db_feature_collection = FeatureCollection(name=file.filename)
    session.add(db_feature_collection)
    session.flush()  # To get the ID of the feature collection

    if geojson_dict["type"] == "Feature":
        # Process a single feature
        db_feature = Feature(
            feature_collection_id=db_feature_collection.id,
            geometry=shape(geojson_dict["geometry"]).wkt,
            properties=geojson_dict.get("properties", {}),
        )
        session.add(db_feature)

    # Process a feature collection
    elif geojson_dict["type"] == "FeatureCollection":
        for feature in geojson_dict["features"]:
            db_feature = Feature(
                feature_collection_id=db_feature_collection.id,
                geometry=shape(feature["geometry"]).wkt,
                properties=feature.get("properties", {}),
            )
            session.add(db_feature)

    session.commit()

    return {
        "message": f"Feature added to Database.",
        "id": db_feature_collection.id,
    }


@router.get("")
async def get_all_feature_collections(session: Session = Depends(get_db)):
    """
    Retrieve all feature collections and their features stored in the database.

    Returns:
        list: A list of all feature collections with their features in GeoJSON format.
    """
    db_feature_collections = session.query(FeatureCollection).options(joinedload(FeatureCollection.features)).all()

    geojson_collections = []
    for db_feature_collection in db_feature_collections:
        collection_features = []

        for db_feature in db_feature_collection.features:
            # Convert PostGIS geometry to GeoJSON
            geometry = mapping(to_shape(db_feature.geometry))

            # Create a GeoJSON feature
            feature = {
                "type": "Feature",
                "geometry": geometry,
                "properties": db_feature.properties,
            }

            collection_features.append(feature)

        # Assemble the feature collection in GeoJSON format
        feature_collection = {
            "id": db_feature_collection.id,
            "created_at": db_feature_collection.created_at,
            "name": db_feature_collection.name
        }

        # If there is only one feature, return it directly; otherwise, return a FeatureCollection
        if len(collection_features) == 1:
            feature_collection["feature"] = collection_features[0]
        else:
            feature_collection["feature"] = {
                "type": "FeatureCollection",
                "features": collection_features
            }

        geojson_collections.append(feature_collection)

    return geojson_collections

@router.get("/{feature_id}")
async def get_feature_by_id(feature_id: int, session: Session = Depends(get_db)):
    """
    Retrieve a specific feature by its ID.

    Parameters:
        feature_id (int): The ID of the feature to retrieve.

    Returns:
        Feature: The feature object if found.
    """

    db_feature_collection = session.query(FeatureCollection).filter(FeatureCollection.id == feature_id).options(joinedload(FeatureCollection.features)).first()

    if db_feature_collection is None:
        raise HTTPException(status_code=404, detail="Feature not found")

    features = []

    for db_feature in db_feature_collection.features:
        # Convert PostGIS geometry to GeoJSON
        geometry = mapping(to_shape(db_feature.geometry))

        # Create a GeoJSON feature
        feature = {
            "type": "Feature",
            "geometry": geometry,
            "properties": db_feature.properties,
        }

        features.append(feature)

    # Assemble the feature collection in GeoJSON format
    feature_collection = {
        "id": db_feature_collection.id,
        "created_at": db_feature_collection.created_at,
        "name": db_feature_collection.name
    }

    # If there is only one feature, return it directly; otherwise, return a FeatureCollection
    if len(features) == 1:
        feature_collection["feature"] = features[0]
    else:
        feature_collection["feature"] = {
            "type": "FeatureCollection",
            "features": features
        }

    return feature_collection


@router.delete("/delete/{feature_id}")
async def delete_feature_by_id(feature_id: int, session: Session = Depends(get_db)):
    """
    Delete a specific feature by its ID.

    Parameters:
        feature_id (int): The ID of the feature to delete.

    Returns:
        dict: Confirmation message.
    """
    db_feature_collection = session.query(FeatureCollection).filter(FeatureCollection.id == feature_id).first()

    if db_feature_collection is None:
        raise HTTPException(status_code=404, detail="Feature not found")

    session.delete(db_feature_collection)
    session.commit()

    return {"message": "Feature deleted"}
