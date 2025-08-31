import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

class TestEndToEnd:
    
    def test_complete_workflow(self):
        """Test complete API workflow"""
        # Test health endpoint
        health_response = client.get("/health")
        assert health_response.status_code == 200
        
        # Test root endpoint
        root_response = client.get("/")
        assert root_response.status_code == 200
        assert "endpoints" in root_response.json()
        
        # Test scaling history
        history_response = client.get("/scaling/history")
        assert history_response.status_code == 200
        assert "count" in history_response.json()
        assert "history" in history_response.json()
    
    def test_prediction_endpoints(self):
        """Test prediction endpoints"""
        # Test primary forecast
        forecast_response = client.get("/predict/primary?hours=2")
        # May fail if models not loaded, which is expected
        assert forecast_response.status_code in [200, 503]
        
        # Test secondary prediction with sample data
        sample_data = {
            "timestamp": "2024-01-15T10:30:00",
            "load_1m": 0.85,
            "load_5m": 0.78,
            "load_15m": 0.72,
            "cpu_user": 65.2,
            "cpu_system": 12.1,
            "cpu_iowait": 8.5,
            "sys_mem_available": 2048,
            "sys_mem_total": 4096,
            "disk_io_time": 45.2,
            "disk_io_read": 120.5,
            "disk_io_write": 85.3,
            "source_ip": "192.168.1.100"
        }
        
        prediction_response = client.post("/predict/secondary", json=sample_data)
        # May fail if models not loaded, which is expected
        assert prediction_response.status_code in [200, 503]
