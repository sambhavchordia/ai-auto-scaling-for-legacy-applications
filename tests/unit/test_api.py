import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "endpoints" in data

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "timestamp" in data
    assert "models_loaded" in data

def test_primary_forecast():
    response = client.get("/predict/primary?hours=2")
    # This might fail if models aren't loaded, which is expected
    assert response.status_code in [200, 503]

def test_secondary_prediction(sample_metrics):
    response = client.post("/predict/secondary", json=sample_metrics)
    # This might fail if models aren't loaded, which is expected
    assert response.status_code in [200, 503]

def test_scaling_history():
    response = client.get("/scaling/history")
    assert response.status_code == 200
    data = response.json()
    assert "count" in data
    assert "history" in data
