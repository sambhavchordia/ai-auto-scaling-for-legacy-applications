import pytest
import asyncio
from fastapi.testclient import TestClient
from src.api.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_metrics():
    return {
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
