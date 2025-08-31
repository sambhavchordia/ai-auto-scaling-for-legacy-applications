import os
from typing import List
from pydantic_settings import BaseSettings  # Changed from pydantic import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    # Model Configuration
    MODEL_PATH: str = "models/"
    PRIMARY_MODEL_FILE: str = "prophet_model.pkl"
    SECONDARY_MODEL_FILE: str = "enhanced_secondary_model.pkl"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    CORS_ORIGINS: List[str] = ["*"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # Scaling Configuration
    MIN_INSTANCES: int = 2
    MAX_INSTANCES: int = 20
    SCALE_UP_THRESHOLD: float = 0.8
    SCALE_DOWN_THRESHOLD: float = 0.3
    ANOMALY_THRESHOLD: float = 0.95
    
    class Config:
        env_file = ".env"

settings = Settings()
