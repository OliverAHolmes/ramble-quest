from fastapi import APIRouter, UploadFile, File
import json
from db import SessionLocal
from models import Feature

router = APIRouter(prefix="/feature")

@router.post("/upload/")
async def upload_geojson(file: UploadFile = File(...)):
    # Read and parse the GeoJSON file
    geojson_content = await file.read()
    geojson_dict = json.loads(geojson_content)

    # Get features from GeoJSON
    features = geojson_dict.get("features", [])

    # Initialize database session
    db = SessionLocal()

    # Save features to SQLite
    for feature in features:
        db_feature = Feature(feature=json.dumps(feature))
        db.add(db_feature)
    
    db.commit()
    db.close()

    return {"message": "GeoJSON features saved to SQLite"}

