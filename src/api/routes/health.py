from fastapi import APIRouter, HTTPException
from src.api.models.schemas import HealthResponse
from src.services.monitoring_service import MonitoringService
from datetime import datetime

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        monitoring = MonitoringService()
        models_loaded = monitoring.check_models_status()
        active_instances = monitoring.get_active_instances()
        
        return HealthResponse(
            status="healthy",
            timestamp=datetime.now().isoformat(),
            models_loaded=models_loaded,
            active_instances=active_instances
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Health check failed: {str(e)}")

@router.get("/ready")
async def readiness_check():
    """Readiness check endpoint"""
    return {"status": "ready"}

@router.get("/live")
async def liveness_check():
    """Liveness check endpoint"""
    return {"status": "alive"}
