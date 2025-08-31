#!/usr/bin/env python3
"""
Minimal AI Auto-Scaling System - Main Entry Point
(Without heavy ML dependencies for testing)
"""

import uvicorn
import sys
import os
from datetime import datetime
from typing import Dict, Any

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

# Create a minimal FastAPI app
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Auto-Scaling System (Minimal)",
    description="Minimal version for testing",
    version="1.0.0"
)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Auto-Scaling System (Minimal Version)",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    """Health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": {"primary": False, "secondary": False},
        "active_instances": 2
    }

@app.get("/predictions/forecast")
async def get_forecast():
    """Mock forecast endpoint"""
    return {
        "forecast_hours": 2,
        "generated_at": datetime.now().isoformat(),
        "forecast": [
            {
                "timestamp": datetime.now().isoformat(),
                "predicted_load": 0.65,
                "confidence": 0.85,
                "model_used": "mock"
            }
        ]
    }

@app.post("/scaling/decide")
async def get_scaling_decision():
    """Mock scaling decision"""
    return {
        "action": "maintain",
        "confidence": 0.8,
        "reason": "Load within normal range",
        "source": "mock_model",
        "scores": {"load_score": 0.65},
        "target_instances": 2,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main_minimal:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
