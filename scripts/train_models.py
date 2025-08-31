#!/usr/bin/env python3
"""
Model Training Script

Trains both primary and secondary models for the AI auto-scaling system.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import logging
from pathlib import Path
import joblib
import pickle
import pandas as pd
import numpy as np
from datetime import datetime

# Import from the correct module paths
from src.models.primary_model import PrimaryModel
from src.models.secondary_model import SecondaryModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_primary_model():
    """Train the primary model"""
    try:
        logger.info("📊 Training primary model...")
        
        # Initialize primary model
        primary_model = PrimaryModel()
        
        # Load and preprocess data
        df = primary_model.load_data()
        if df is None:
            logger.error("❌ Failed to load primary dataset")
            return None
        
        # Preprocess data
        prophet_train_df, rf_X_train, rf_X_test, rf_y_train, rf_y_test, features = primary_model.preprocess_data(df)
        
        # Train Prophet model
        prophet_model = primary_model.train_prophet(prophet_train_df, features)
        
        # Train Random Forest model
        rf_model = primary_model.train_random_forest(rf_X_train, rf_y_train)
        
        # Save models
        models_dir = Path("models")
        models_dir.mkdir(exist_ok=True)
        
        joblib.dump(prophet_model, models_dir / "prophet_model.pkl")
        joblib.dump(rf_model, models_dir / "rf_model.pkl")
        
        logger.info("✅ Primary model training completed")
        return True
        
    except Exception as e:
        logger.error(f"❌ Primary model training error: {e}")
        return None

def train_secondary_model():
    """Train the secondary model"""
    try:
        logger.info("🛡️ Training secondary model...")
        
        # Initialize secondary model
        secondary_model = SecondaryModel()
        
        # Load and preprocess data
        df = secondary_model.load_data()
        if df is None:
            logger.error("❌ Failed to load secondary dataset")
            return None
        
        # Preprocess data
        merged_df, metrics_scaled, labels = secondary_model.preprocess_data(df)
        
        # Train models
        secondary_model.train_models(merged_df, metrics_scaled)
        
        # Save model
        models_dir = Path("models")
        models_dir.mkdir(exist_ok=True)
        
        model_data = {
            'metrics_scaler': secondary_model.metrics_scaler,
            'resid_scaler': secondary_model.resid_scaler,
            'iso_forest': secondary_model.iso_forest,
            'available_features': secondary_model.available_features,
            'sequence_length': secondary_model.sequence_length
        }
        
        with open(models_dir / "enhanced_secondary_model.pkl", 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info("✅ Secondary model training completed")
        return True
        
    except Exception as e:
        logger.error(f"❌ Secondary model training error: {e}")
        return None

def create_mock_models():
    """Create mock models for testing when real training fails"""
    try:
        logger.info("🎭 Creating mock models for testing...")
        
        models_dir = Path("models")
        models_dir.mkdir(exist_ok=True)
        
        # Create mock primary model
        mock_prophet = {"type": "mock_prophet", "created": datetime.now().isoformat()}
        mock_rf = {"type": "mock_random_forest", "created": datetime.now().isoformat()}
        
        joblib.dump(mock_prophet, models_dir / "prophet_model.pkl")
        joblib.dump(mock_rf, models_dir / "rf_model.pkl")
        
        # Create mock secondary model
        mock_secondary = {
            'metrics_scaler': None,
            'resid_scaler': None,
            'iso_forest': None,
            'available_features': ['load-1m', 'load-5m', 'load-15m'],
            'sequence_length': 12,
            'type': 'mock_secondary',
            'created': datetime.now().isoformat()
        }
        
        with open(models_dir / "enhanced_secondary_model.pkl", 'wb') as f:
            pickle.dump(mock_secondary, f)
        
        logger.info("✅ Mock models created successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Mock model creation error: {e}")
        return None

def main():
    """Train all models"""
    logger.info("🚀 Starting model training pipeline...")
    
    # Create models directory
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    # Check if datasets exist
    primary_data_path = Path("data/yearly_synthetic_dataset_with_scaling.csv")
    secondary_data_path = Path("data/system-10_with_binned_instances.csv")
    
    if not primary_data_path.exists():
        logger.warning("⚠️ Primary dataset not found, creating mock models")
        return create_mock_models()
    
    if not secondary_data_path.exists():
        logger.warning("⚠️ Secondary dataset not found, creating mock models")
        return create_mock_models()
    
    # Train primary model
    primary_success = train_primary_model()
    if primary_success is None:
        logger.warning("⚠️ Primary model training failed, creating mock model")
        create_mock_models()
        return False
    
    # Train secondary model
    secondary_success = train_secondary_model()
    if secondary_success is None:
        logger.warning("⚠️ Secondary model training failed, creating mock model")
        create_mock_models()
        return False
    
    logger.info(" All models trained successfully!")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
