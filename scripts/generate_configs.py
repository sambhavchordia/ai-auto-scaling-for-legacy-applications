#!/usr/bin/env python3
"""
Configuration Generation Script

Generates infrastructure configurations using AI models.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import glob
from datetime import datetime
from src.services.config_generator import ConfigGenerator
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Generate configurations from action files"""
    logger.info("🚀 Starting AI Configuration Generation...")
    
    # Find action files
    action_files = glob.glob('action_*.json')
    if not action_files:
        logger.warning("🟡 No action_*.json files found to process.")
        return True
    
    logger.info(f"🔍 Found {len(action_files)} action files to process: {sorted(action_files)}")
    
    generator = ConfigGenerator()
    
    for action_file in sorted(action_files):
        logger.info(f"\n--- Processing {action_file} ---")
        
        try:
            with open(action_file, 'r') as f:
                decision = json.load(f)
            
            logger.info(f"▶️ Decision: {decision['action']} to {decision['instances']} instances.")
            
            # Generate configurations
            config_data = generator.generate_scaling_config(decision)
            
            # Save Docker Compose config
            if config_data['docker_compose']:
                docker_filename = f"docker-compose-{decision['action']}-{datetime.now().strftime('%Y%m%d_%H%M%S')}.yml"
                generator.save_config(config_data['docker_compose'], docker_filename)
            
            # Save Kubernetes config
            if config_data['kubernetes']:
                k8s_filename = f"k8s-deployment-{decision['action']}-{datetime.now().strftime('%Y%m%d_%H%M%S')}.yml"
                generator.save_config(config_data['kubernetes'], k8s_filename)
            
            # Save metadata
            metadata_filename = f"config-metadata-{decision['action']}-{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(metadata_filename, 'w') as f:
                json.dump(config_data, f, indent=2)
            
        except Exception as e:
            logger.error(f"❌ Error processing {action_file}: {e}")
    
    logger.info("✅ Configuration generation completed!")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)