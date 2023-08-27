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
            "/features/upload",
            files={
                "file": ("InputMultipolygonExample_1.geojson", f, "application/json")
            },
        )

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "GeoJSON features saved to SQLite"}

    # Validate database
    db = SessionLocal()
    db_features = db.query(Feature).all()
    # Replace 1 with the expected number of features in test_data.json
    assert len(db_features) == 1
    db.close()


def test_get_feature_by_id():
    db = SessionLocal()
    db_feature = db.query(Feature).first()
    feature_id = db_feature.id
    db.close()

    response = client.get(f"/features/{feature_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == feature_id


def test_get_all_features():
    response = client.get("/features")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) >= 1


def test_delete_feature_by_id():
    db = SessionLocal()
    db_feature = db.query(Feature).first()
    feature_id = db_feature.id
    db.close()

    response = client.delete(f"/features/delete/{feature_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Feature deleted"}

    # Validate the feature is deleted
    db = SessionLocal()
    db_feature = db.query(Feature).filter(Feature.id == feature_id).first()
    db.close()
    assert db_feature is None
