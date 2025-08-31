import yaml
import json
from datetime import datetime
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class ConfigGenerator:
    """AI-powered configuration generator for infrastructure"""
    
    def __init__(self):
        self.templates = self._load_templates()
    
    def _load_templates(self) -> Dict[str, str]:
        """Load configuration templates"""
        return {
            "docker_compose": """
version: '3.8'
services:
  {service_name}:
    image: {base_image}
    deploy:
      replicas: {instances}
    ports:
      - "{port}:80"
    environment:
      - NODE_ENV=production
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge
""",
            "kubernetes_deployment": """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {service_name}
spec:
  replicas: {instances}
  selector:
    matchLabels:
      app: {service_name}
  template:
    metadata:
      labels:
        app: {service_name}
    spec:
      containers:
      - name: {service_name}
        image: {base_image}
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
"""
        }
    
    def generate_docker_compose(self, service_name: str, instances: int, 
                              base_image: str = "nginx:latest", port: int = 80) -> str:
        """Generate Docker Compose configuration"""
        try:
            config = self.templates["docker_compose"].format(
                service_name=service_name,
                instances=instances,
                base_image=base_image,
                port=port
            )
            return config.strip()
        except Exception as e:
            logger.error(f"Error generating Docker Compose config: {e}")
            return ""
    
    def generate_kubernetes_deployment(self, service_name: str, instances: int,
                                     base_image: str = "nginx:latest") -> str:
        """Generate Kubernetes deployment configuration"""
        try:
            config = self.templates["kubernetes_deployment"].format(
                service_name=service_name,
                instances=instances,
                base_image=base_image
            )
            return config.strip()
        except Exception as e:
            logger.error(f"Error generating Kubernetes config: {e}")
            return ""
    
    def save_config(self, config: str, filename: str, config_type: str = "yaml"):
        """Save configuration to file"""
        try:
            with open(filename, 'w') as f:
                f.write(config)
            logger.info(f"Configuration saved to {filename}")
            return True
        except Exception as e:
            logger.error(f"Error saving configuration: {e}")
            return False
    
    def generate_scaling_config(self, action: Dict[str, Any]) -> Dict[str, Any]:
        """Generate configuration based on scaling action"""
        service_name = action.get('service_name', 'web-service')
        instances = action.get('target_instances', 1)
        action_type = action.get('action_type', 'scale_up')
        
        config_data = {
            "action_type": action_type,
            "service_name": service_name,
            "instances": instances,
            "generated_at": datetime.now().isoformat(),
            "docker_compose": self.generate_docker_compose(service_name, instances),
            "kubernetes": self.generate_kubernetes_deployment(service_name, instances)
        }
        
        return config_data
