import pandas as pd
import os
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class DataLoader:
    """Data loading utilities for the auto-scaling system"""
    
    @staticmethod
    def load_csv(file_path: str) -> Optional[pd.DataFrame]:
        """Load CSV file with error handling"""
        try:
            if not os.path.exists(file_path):
                logger.error(f"File not found: {file_path}")
                return None
            
            df = pd.read_csv(file_path)
            logger.info(f"Successfully loaded {file_path} with shape {df.shape}")
            return df
        except Exception as e:
            logger.error(f"Error loading {file_path}: {e}")
            return None
    
    @staticmethod
    def load_primary_data(file_path: str = "data/yearly_synthetic_dataset_with_scaling.csv") -> Optional[pd.DataFrame]:
        """Load primary dataset for time series forecasting"""
        df = DataLoader.load_csv(file_path)
        if df is not None:
            # Ensure timestamp conversion
            if 'Timestamp' in df.columns:
                df['Timestamp'] = pd.to_datetime(df['Timestamp'], format='%d-%m-%Y %H:%M', errors='coerce')
        return df
    
    @staticmethod
    def load_secondary_data(file_path: str = "data/system-10_with_binned_instances.csv") -> Optional[pd.DataFrame]:
        """Load secondary dataset for anomaly detection"""
        df = DataLoader.load_csv(file_path)
        if df is not None:
            # Ensure timestamp conversion
            if 'timestamp' in df.columns:
                df['timestamp'] = pd.to_datetime(df['timestamp'])
        return df
    
    @staticmethod
    def validate_dataframe(df: pd.DataFrame, required_columns: list) -> bool:
        """Validate DataFrame has required columns"""
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            logger.error(f"Missing required columns: {missing_columns}")
            return False
        return True
