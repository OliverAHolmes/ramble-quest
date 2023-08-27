from fastapi import APIRouter, UploadFile, File, HTTPException
import json
from db import SessionLocal
from models import Feature

router = APIRouter(prefix="/features")


@router.post("/upload")
async def upload_geojson(file: UploadFile = File(...)):
    # Read and parse the GeoJSON file
    geojson_content = await file.read()
    geojson_dict = json.loads(geojson_content)

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
    db = SessionLocal()
    db_features = db.query(Feature).all()
    db.close()
    return db_features


@router.get("/{feature_id}")
async def get_feature_by_id(feature_id: int):
    db = SessionLocal()
    db_feature = db.query(Feature).filter(Feature.id == feature_id).first()
    db.close()

    if db_feature is None:
        raise HTTPException(status_code=404, detail="Feature not found")

    return db_feature


@router.delete("/delete/{feature_id}")
async def delete_feature_by_id(feature_id: int):
    db = SessionLocal()
    db_feature = db.query(Feature).filter(Feature.id == feature_id).first()

    if db_feature is None:
        db.close()
        raise HTTPException(status_code=404, detail="Feature not found")

    db.delete(db_feature)
    db.commit()
    db.close()

    return {"message": "Feature deleted"}
