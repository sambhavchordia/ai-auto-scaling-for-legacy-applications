# ai-autoscaling-system/main.py
#!/usr/bin/env python3
"""
AI Auto-Scaling System - Main Entry Point

Run with: python main.py
"""

import uvicorn
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.api.main import app
from src.config.settings import settings

def main():
    """Main entry point for the application"""
    uvicorn.run(
        "src.api.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )

if __name__ == "__main__":
    main()
