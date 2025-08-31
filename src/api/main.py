from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import logging

from src.api.routes import health, predictions, scaling, websocket
from src.config.settings import settings
from src.services.monitoring_service import MonitoringService

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting up AI-Powered Auto-Scaling API")
    
    # Initialize services
    monitoring = MonitoringService()
    await monitoring.initialize()
    
    yield
    
    # Shutdown
    logger.info(" Shutting down AI-Powered Auto-Scaling API")

# Create FastAPI app
app = FastAPI(
    title="AI-Powered Auto-Scaling API",
    description="API for intelligent scaling decisions based on ML models",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(predictions.router)
app.include_router(scaling.router)
app.include_router(websocket.router)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AI-Powered Auto-Scaling API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predictions": "/predictions",
            "scaling": "/scaling",
            "websocket": "/ws"
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "src.api.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
