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

    # Initialize database session
    db = SessionLocal()

    print(json.dumps(geojson_dict))
    
    feature_type = geojson_dict.get("type", "Unknown")
    db_feature = Feature(feature=json.dumps(geojson_dict), feature_type=feature_type)
    db.add(db_feature)
    
    db.commit()
    db.close()

    return {"message": "GeoJSON features saved to SQLite"}

