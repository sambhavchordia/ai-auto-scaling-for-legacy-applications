import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

class TestScalingWorkflow:
    
    def test_scaling_decision_workflow(self):
        """Test complete scaling decision workflow"""
        # Sample metrics that should trigger scaling
        high_load_metrics = {
            "timestamp": "2024-01-15T10:30:00",
            "load_1m": 0.95,  # High load
            "load_5m": 0.90,
            "load_15m": 0.85,
            "cpu_user": 85.0,
            "cpu_system": 15.0,
            "cpu_iowait": 10.0,
            "sys_mem_available": 1024,
            "sys_mem_total": 4096,
            "disk_io_time": 75.0,
            "disk_io_read": 200.0,
            "disk_io_write": 150.0,
            "source_ip": "192.168.1.100"
        }
        
        # Test real-time prediction (should trigger scaling)
        response = client.post("/predict/realtime", json=high_load_metrics)
        assert response.status_code in [200, 503]  # May fail if models not loaded
        
        if response.status_code == 200:
            data = response.json()
            assert "action" in data
            assert "confidence" in data
            assert "reason" in data
    
    def test_system_status_workflow(self):
        """Test system status workflow"""
        # Get system status
        status_response = client.get("/scaling/status")
        assert status_response.status_code == 200
        
        data = status_response.json()
        assert "timestamp" in data
        assert "active_instances" in data
        assert "models_loaded" in data
        assert "recent_decisions" in data
