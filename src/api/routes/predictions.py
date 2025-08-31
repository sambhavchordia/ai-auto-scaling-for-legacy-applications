from fastapi import APIRouter, HTTPException, BackgroundTasks
from src.api.models.schemas import SystemMetrics, ScalingDecision, ForecastResponse
from src.services.scaling_service import ScalingService
from datetime import datetime
from typing import List, Dict, Any
import logging

router = APIRouter(prefix="/predictions", tags=["Predictions"])
logger = logging.getLogger(__name__)

@router.post("/forecast", response_model=ForecastResponse)
async def get_forecast(metrics: SystemMetrics, forecast_hours: int = 2):
    """Get load forecast"""
    try:
        service = ScalingService()
        predictions = service.get_forecast(metrics, forecast_hours)
        
        return ForecastResponse(
            forecast_hours=forecast_hours,
            generated_at=datetime.now().isoformat(),
            forecast=predictions
        )
    except Exception as e:
        logger.error(f"Forecast error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/anomaly")
async def detect_anomaly(metrics: SystemMetrics):
    """Detect anomalies"""
    try:
        service = ScalingService()
        anomaly_score = service.detect_anomaly(metrics)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "anomaly_detected": anomaly_score > 0.95,
            "anomaly_score": anomaly_score,
            "model_used": "isolation_forest"
        }
    except Exception as e:
        logger.error(f"Anomaly detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
