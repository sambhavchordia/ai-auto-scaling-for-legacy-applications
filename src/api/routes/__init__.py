# ai-autoscaling-system/src/api/routes/__init__.py
from .health import router as health_router
from .predictions import router as predictions_router
from .scaling import router as scaling_router

__all__ = ["health_router", "predictions_router", "scaling_router"]