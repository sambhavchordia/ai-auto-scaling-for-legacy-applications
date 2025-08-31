#!/usr/bin/env python3
"""
Environment Setup Script

Sets up the development environment for the AI auto-scaling system.
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_command(command: str, description: str) -> bool:
    """Run a shell command with error handling"""
    logger.info(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        logger.info(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ {description} failed: {e}")
        logger.error(f"Error output: {e.stderr}")
        return False

def create_directories():
    """Create necessary directories"""
    directories = [
        "models",
        "data",
        "logs",
        "tests/fixtures",
        "docs/images"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        logger.info(f"�� Created directory: {directory}")

def setup_pre_commit():
    """Setup pre-commit hooks"""
    if run_command("pre-commit install", "Installing pre-commit hooks"):
        logger.info("✅ Pre-commit hooks installed")
    else:
        logger.warning("⚠️ Pre-commit hooks installation failed")

def main():
    """Main setup function"""
    logger.info("�� Setting up AI Auto-Scaling System environment...")
    
    # Create directories
    create_directories()
    
    # Install dependencies
    if not run_command("pip install -r requirements.txt", "Installing dependencies"):
        logger.error("❌ Failed to install dependencies")
        return False
    
    # Install dev dependencies
    if not run_command("pip install -r requirements-dev.txt", "Installing development dependencies"):
        logger.warning("⚠️ Failed to install development dependencies")
    
    # Setup pre-commit
    setup_pre_commit()
    
    logger.info("✅ Environment setup completed!")
    logger.info("📋 Next steps:")
    logger.info("   1. Copy your data files to the 'data/' directory")
    logger.info("   2. Run 'python scripts/train_models.py' to train models")
    logger.info("   3. Run 'python src/api/main.py' to start the API server")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
