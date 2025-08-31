import pytest
import pandas as pd
import numpy as np
from src.models.secondary_model import SecondaryModel

class TestSecondaryModel:
    
    def test_secondary_model_initialization(self):
        """Test SecondaryModel initialization"""
        model = SecondaryModel()
        assert model.sequence_length == 12
        assert model.iso_forest is None
        assert model.lstm_model is None
        assert len(model.all_features) > 0
    
    def test_load_data_file_not_found(self):
        """Test loading data with non-existent file"""
        model = SecondaryModel()
        result = model.load_data("non_existent_file.csv")
        assert result is None
    
    def test_preprocess_data(self):
        """Test data preprocessing"""
        model = SecondaryModel()
        
        # Create sample data
        data = {
            'timestamp': ['2024-01-01 10:00:00', '2024-01-01 11:00:00'],
            'load-1m': [0.5, 0.6],
            'load-5m': [0.4, 0.5],
            'load-15m': [0.3, 0.4],
            'cpu-user': [25, 30],
            'cpu-system': [5, 6],
            'cpu-iowait': [2, 3],
            'sys-mem-available': [2048, 1800],
            'sys-mem-total': [4096, 4096],
            'disk-io-time': [10, 15],
            'disk-io-read': [50, 60],
            'disk-io-write': [30, 40],
            'requests_per_ip': [10, 12],
            'source_variety': [5, 6],
            'instances': [2, 2],
            'is_ddos_attack': [0, 0]
        }
        df = pd.DataFrame(data)
        
        result = model.preprocess_data(df)
        assert len(result) == 3  # Should return 3 components
        assert isinstance(result[0], pd.DataFrame)  # Original data
        assert isinstance(result[1], np.ndarray)    # Scaled metrics