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
    assert response.json() == {
        "message": "GeoJSON features saved to SQLite",
        "feature_id": 1,
    }

    # Validate database
    db = SessionLocal()
    db_features = db.query(Feature).all()
    # Replace 1 with the expected number of features in test_data.json
    assert len(db_features) == 1
    db.close()


def test_upload_invalid_file():
    # Open the test_data.json file
    with open("data/failed_test.txt", "rb") as f:
        # Perform the upload
        response = client.post(
            "/features/upload",
            files={"file": ("failed_test.txt", f, "application/json")},
        )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "Invalid GeoJson content in file."}


def test_upload_geojson_decode_error():
    # Prepare a binary file that will cause a UnicodeDecodeError when decoded as utf-8
    # This is just a simple PNG header
    with open("data/logo.jpeg", "rb") as f:
        # Perform the upload
        response = client.post(
            "/features/upload",
            files={"file": ("logo.jpeg", f, "application/jpeg")},
        )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "Not a vaild GeoJson file."}


def test_upload_missing_type_field():
    # Open the test_data.json file
    with open("data/failed_case_no_type.geojson", "rb") as f:
        # Perform the upload
        response = client.post(
            "/features/upload",
            files={"file": ("failed_case_no_type.geojson", f, "application/json")},
        )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "Invalid GeoJSON, missing 'type' field."}


def test_upload_missing_features_field():
    # Open the test_data.json file
    with open("data/failed_case_no_features.geojson", "rb") as f:
        # Perform the upload
        response = client.post(
            "/features/upload",
            files={"file": ("failed_case_no_features.geojson", f, "application/json")},
        )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "Invalid GeoJSON, missing 'features' field."}


def test_get_feature_by_id():
    db = SessionLocal()
    db_feature = db.query(Feature).first()
    feature_id = db_feature.id
    db.close()

    response = client.get(f"/features/{feature_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["id"] == feature_id


def test_get_feature_by_id_not_found():
    # Test a feature ID that does not exist
    response = client.get(
        "/features/9999"
    )  # Assuming 9999 is an ID that does not exist in your DB

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "Feature not found"}


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


def test_delete_feature_by_id_not_found():
    # Test a feature ID that does not exist
    response = client.delete(
        "/features/delete/9999"
    )  # Assuming 9999 is an ID that does not exist in your DB

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "Feature not found"}
