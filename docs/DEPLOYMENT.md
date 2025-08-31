# Deployment Guide

## �� Deployment Options

The AI Auto-Scaling System can be deployed in multiple environments, from local development to production Kubernetes clusters.

## �� Prerequisites

### System Requirements
- **Python**: 3.8 or higher
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: 1GB for models, 5GB for data
- **CPU**: 2 cores minimum (4 cores recommended)

### Dependencies
- **Docker**: For containerized deployment
- **Kubernetes**: For orchestrated deployment (optional)
- **Git**: For version control

## 🏠 Local Development

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-autoscaling-system.git
cd ai-autoscaling-system

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### 2. Data Preparation
```bash
# Copy your data files to the data directory
cp /path/to/your/yearly_synthetic_dataset_with_scaling.csv data/
cp /path/to/your/system-10_with_binned_instances.csv data/
```

### 3. Model Training
```bash
# Train all models
python scripts/train_models.py
```

### 4. Start Development Server
```bash
# Start the API server
python src/api/main.py

# Or use the Makefile
make run
```

### 5. Verify Deployment
```bash
# Test health endpoint
curl http://localhost:8000/health

# Open API documentation
open http://localhost:8000/docs
```

## 🐳 Docker Deployment

### 1. Build Docker Image
```bash
# Build the image
docker build -t ai-autoscaling .

# Or use the Makefile
make docker-build
```

### 2. Run Container
```bash
# Run with Docker Compose
docker-compose up -d

# Or run directly
docker run -p 8000:8000 -v $(pwd)/models:/app/models ai-autoscaling
```

### 3. Production Docker Compose
```bash
# Use production configuration
docker-compose -f docker/docker-compose.prod.yml up -d
```

## ☸️ Kubernetes Deployment

### 1. Prerequisites
```bash
# Install kubectl
# Install a Kubernetes cluster (minikube, kind, or cloud provider)
# Install Helm (optional)
```

### 2. Deploy to Kubernetes
```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Or deploy individual components
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/ingress.yml
```

### 3. Verify Deployment
```bash
# Check deployment status
kubectl get pods
kubectl get services
kubectl get ingress

# Port forward for local access
kubectl port-forward service/ai-autoscaling-service 8000:80
```

### 4. Scale Deployment
```bash
# Scale to 3 replicas
kubectl scale deployment ai-autoscaling --replicas=3

# Check scaling status
kubectl get pods -l app=ai-autoscaling
```

## ☁️ Cloud Deployment

### AWS EKS
```bash
# Create EKS cluster
eksctl create cluster --name ai-autoscaling --region us-west-2

# Deploy application
kubectl apply -f k8s/

# Create load balancer
kubectl apply -f k8s/ingress.yml
```

### Google GKE
```bash
# Create GKE cluster
gcloud container clusters create ai-autoscaling --zone us-central1-a

# Deploy application
kubectl apply -f k8s/
```

### Azure AKS
```bash
# Create AKS cluster
az aks create --resource-group myResourceGroup --name ai-autoscaling --node-count 3

# Deploy application
kubectl apply -f k8s/
```

## �� Configuration

### Environment Variables
```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=false
LOG_LEVEL=INFO

# Model Configuration
MODEL_PATH=/app/models/
PRIMARY_MODEL_FILE=prophet_model.pkl
SECONDARY_MODEL_FILE=enhanced_secondary_model.pkl

# Security
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=["*"]
```

### Configuration Files
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
# Basic health check
curl http://localhost:8000/health

# System status
curl http://localhost:8000/scaling/status

# Scaling history
curl http://localhost:8000/scaling/history
```

### Logs
```bash
# Docker logs
docker logs ai-autoscaling

# Kubernetes logs
kubectl logs deployment/ai-autoscaling

# Follow logs
kubectl logs -f deployment/ai-autoscaling
```

### Metrics
```bash
# Check resource usage
kubectl top pods
kubectl top nodes

# Monitor scaling decisions
curl http://localhost:8000/scaling/history | jq
```

## 🔒 Security Considerations

### 1. Network Security
- Use HTTPS in production
- Configure firewall rules
- Implement rate limiting

### 2. Authentication & Authorization
- Add API key authentication
- Implement OAuth2/JWT
- Use Kubernetes RBAC

### 3. Data Security
- Encrypt data at rest
- Use secrets for sensitive data
- Implement data backup

### 4. Model Security
- Validate input data
- Monitor for adversarial attacks
- Regular model updates

## 🚨 Troubleshooting

### Common Issues

#### 1. Models Not Loading
```bash
# Check model files exist
ls -la models/

# Check file permissions
chmod 644 models/*.pkl

# Verify model paths in configuration
grep MODEL_PATH .env
```

#### 2. API Not Starting
```bash
# Check port availability
netstat -tulpn | grep 8000

# Check dependencies
pip list | grep fastapi

# Check logs
tail -f logs/app.log
```

#### 3. Docker Issues
```bash
# Check Docker daemon
docker info

# Clean up containers
docker system prune

# Rebuild image
docker build --no-cache -t ai-autoscaling .
```

#### 4. Kubernetes Issues
```bash
# Check cluster status
kubectl cluster-info

# Check pod status
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Performance Tuning

#### 1. Resource Limits
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

#### 2. Scaling Configuration
```yaml
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-autoscaling-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-autoscaling
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 📈 Production Checklist

- [ ] Environment variables configured
- [ ] Models trained and saved
- [ ] Health checks passing
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Security measures implemented
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Rollback plan prepared

## 🔄 Updates & Maintenance

### Rolling Updates
```bash
# Update deployment
kubectl set image deployment/ai-autoscaling ai-autoscaling=ai-autoscaling:v2.0.0

# Monitor rollout
kubectl rollout status deployment/ai-autoscaling

# Rollback if needed
kubectl rollout undo deployment/ai-autoscaling
```

### Model Updates
```bash
# Retrain models
python scripts/train_models.py

# Update model files
kubectl cp models/ deployment/ai-autoscaling:/app/models/

# Restart deployment
kubectl rollout restart deployment/ai-autoscaling
```

This deployment guide covers all major deployment scenarios and provides troubleshooting steps for common issues.