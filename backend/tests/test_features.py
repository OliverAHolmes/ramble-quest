from fastapi import status
from fastapi.testclient import TestClient
from main import app 
from db import SessionLocal 
from models import Feature 

client = TestClient(app)

def test_upload_geojson():
    # Open the test_data.json file
    with open("data/InputMultipolygonExample_1.geojson", "rb") as f:
        # Perform the upload
        response = client.post(
            "/feature/upload/",
            files={"file": ("test_data.json", f, "application/json")}
        )
    
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "GeoJSON features saved to SQLite"}

    # Validate database
    db = SessionLocal()
    db_features = db.query(Feature).all()
    # Replace 1 with the expected number of features in test_data.json
    assert len(db_features) == 1  
    db.close()
