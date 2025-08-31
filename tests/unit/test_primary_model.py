import pytest
import pandas as pd
import numpy as np
from src.models.primary_model import PrimaryModel

class TestPrimaryModel:
    
    def test_primary_model_initialization(self):
        """Test PrimaryModel initialization"""
        model = PrimaryModel()
        assert model.prophet_model is None
        assert model.rf_model is None
        assert model.ensemble_predictions is None
    
    def test_load_data_file_not_found(self):
        """Test loading data with non-existent file"""
        model = PrimaryModel()
        result = model.load_data("non_existent_file.csv")
        assert result is None
    
    def test_preprocess_data(self):
        """Test data preprocessing"""
        model = PrimaryModel()
        
        # Create sample data
        data = {
            'Timestamp': ['01-01-2024 10:00', '01-01-2024 11:00'],
            'Active_Users': [100, 150],
            'day_of_week': [0, 0],
            'hour_of_day': [10, 11],
            'hour_sin': [0.5, 0.6],
            'hour_cos': [0.8, 0.7],
            'Lagged_Features': [90, 100],
            'is_payday': [0, 0],
            'is_month_end': [0, 0],
            'is_fiscal_year_end': [0, 0]
        }
        df = pd.DataFrame(data)
        
        result = model.preprocess_data(df)
        assert len(result) == 6  # Should return 6 components
        assert isinstance(result[0], pd.DataFrame)  # Prophet data
        assert isinstance(result[1], pd.DataFrame)  # RF features
