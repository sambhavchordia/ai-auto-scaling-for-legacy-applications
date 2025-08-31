# ai-autoscaling-system/tests/unit/test_services.py
import pytest
from unittest.mock import Mock, patch
from src.services.scaling_service import ScalingService
from src.services.monitoring_service import MonitoringService
from src.api.models.schemas import SystemMetrics
from datetime import datetime

class TestScalingService:
    
    def test_scaling_service_initialization(self):
        """Test ScalingService initialization"""
        service = ScalingService()
        assert service.primary_model is None
        assert service.secondary_model is None
        assert service.scaling_history == []
        assert service.active_instances == 2  # MIN_INSTANCES
    
    @patch('src.services.scaling_service.joblib.load')
    def test_load_primary_model(self, mock_load):
        """Test loading primary model"""
        service = ScalingService()
        # Since models are loaded in __init__, we test the behavior indirectly
        assert service.primary_model is None  # Because models don't exist yet
    
    def test_extract_features(self):
        """Test feature extraction from metrics"""
        service = ScalingService()
        metrics = SystemMetrics(
            timestamp=datetime.now(),
            cpu_usage=75.0,
            memory_usage=80.0,
            network_io=1000.0,
            disk_io=500.0,
            user_count=100,
            response_time=150.0,
            error_rate=0.02
        )
        
        features = service._extract_features(metrics)
        assert features.shape == (1, 7)  # 7 basic features
        assert features[0][0] == 75.0  # cpu_usage

class TestMonitoringService:
    
    def test_monitoring_service_initialization(self):
        """Test MonitoringService initialization"""
        service = MonitoringService()
        assert service.metrics_history == []
        assert service.anomaly_threshold == 0.95
        assert service.collection_interval == 30
    
    def test_simulate_user_count(self):
        """Test user count simulation"""
        service = MonitoringService()
        user_count = service._simulate_user_count()
        assert isinstance(user_count, int)
        assert user_count > 0
    
    def test_simulate_response_time(self):
        """Test response time simulation"""
        service = MonitoringService()
        response_time = service._simulate_response_time()
        assert isinstance(response_time, float)
        assert response_time > 0
    
    def test_simulate_error_rate(self):
        """Test error rate simulation"""
        service = MonitoringService()
        error_rate = service._simulate_error_rate()
        assert isinstance(error_rate, float)
        assert 0 <= error_rate <= 1
    
    def test_get_average_metrics_empty(self):
        """Test average metrics with empty history"""
        service = MonitoringService()
        avg_metrics = service.get_average_metrics()
        assert avg_metrics == {}
