# ai-autoscaling-system/src/api/routes/scaling.py
from fastapi import APIRouter, HTTPException
from src.api.models.schemas import SystemMetrics, ScalingDecision
from src.services.scaling_service import ScalingService
from datetime import datetime
import logging

router = APIRouter(prefix="/scaling", tags=["Scaling"])
logger = logging.getLogger(__name__)

@router.post("/decide", response_model=ScalingDecision)
async def get_scaling_decision(metrics: SystemMetrics):
    """Get scaling decision"""
    try:
        service = ScalingService()
        decision = await service.get_scaling_decision(metrics)
        
        return decision
    except Exception as e:
        logger.error(f"Scaling decision error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/execute")
async def execute_scaling(decision: ScalingDecision):
    """Execute scaling decision"""
    try:
        service = ScalingService()
        result = await service.execute_scaling(decision)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "action": decision.action,
            "success": result,
            "message": f"Scaling {decision.action} executed"
        }
    except Exception as e:
        logger.error(f"Scaling execution error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_scaling_status():
    """Get current scaling status"""
    try:
        service = ScalingService()
        status = service.get_status()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "active_instances": status["active_instances"],
            "scaling_history": status["scaling_history"][-10:],  # Last 10 actions
            "current_load": status["current_load"]
        }
    except Exception as e:
        logger.error(f"Status error: {e}")
        raise HTTPException(status_code=500, detail=str(e))