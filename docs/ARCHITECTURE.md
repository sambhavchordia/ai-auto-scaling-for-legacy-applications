# Architecture Guide

## 🏗️ System Architecture

The AI-Powered Auto-Scaling System follows a modular, microservices-inspired architecture designed for scalability, maintainability, and reliability.

## 📊 High-Level Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Prophet   │    │   Random    │    │  Ensemble   │
│   Model     │───▶│   Forest    │───▶│  Predictor  │
└─────────────┘    └─────────────┘    └─────────────┘
```

**Components**:
- **Prophet**: Facebook's time series forecasting library
- **Random Forest**: Scikit-learn ensemble method
- **Ensemble**: Weighted combination of both models

**Features**:
- Temporal features (hour, day, month)
- Business features (payday, month-end, fiscal year-end)
- Cyclical features (sin/cos transformations)

#### Secondary Model (Anomaly Detection)
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Isolation   │    │    LSTM     │    │   Threat    │
│ Forest      │───▶│   Model     │───▶│ Intelligence│
└─────────────┘    └─────────────┘    └─────────────┘
```

**Components**:
- **Isolation Forest**: Unsupervised anomaly detection
- **LSTM**: Residual error prediction
- **Threat Intelligence**: IP reputation checking

**Features**:
- System metrics (CPU, memory, disk, network)
- Security features (requests per IP, source variety)
- Temporal patterns (sequence modeling)

### 3. API Layer

#### FastAPI Application Structure
```
src/api/
├── main.py              # Application entry point
├── routes/              # API endpoints
│   ├── health.py        # Health checks
│   ├── predictions.py   # Model predictions
│   └── scaling.py       # Scaling operations
├── models/              # Data models
│   ├── schemas.py       # Pydantic schemas
│   └── responses.py     # Response models
└── middleware/          # Middleware components
    ├── cors.py          # CORS handling
    └── logging.py       # Request logging
```

#### Service Layer
```
src/services/
├── scaling_service.py   # Core scaling logic
├── monitoring_service.py # Health monitoring
└── config_generator.py  # Infrastructure configs
```

### 4. Infrastructure Layer

#### Docker Containerization
- **Multi-stage builds** for optimized images
- **Health checks** for container monitoring
- **Volume mounts** for persistent data
- **Environment configuration** via env vars

#### Kubernetes Deployment
- **Deployment**: Application scaling and updates
- **Service**: Load balancing and networking
- **ConfigMap/Secret**: Configuration management
- **Ingress**: External access and SSL termination

## 🔄 Data Flow

### 1. Training Pipeline
```
Data Loading → Preprocessing → Model Training → Model Saving
     ↓              ↓              ↓              ↓
CSV Files → Feature Engineering → ML Algorithms → Pickle Files
```

### 2. Prediction Pipeline
```
API Request → Data Validation → Model Loading → Prediction → Response
     ↓              ↓              ↓              ↓           ↓
HTTP POST → Pydantic Models → Cached Models → ML Inference → JSON Response
```

### 3. Scaling Pipeline
```
Metrics → Anomaly Detection → Decision Making → Action Execution → Monitoring
   ↓            ↓                ↓                ↓              ↓
System Data → Isolation Forest → Business Logic → Infrastructure → Background Tasks
```

## 🛡️ Security Architecture

### 1. Input Validation
- **Pydantic schemas** for request validation
- **Range checking** for numeric values
- **IP address validation** for security features

### 2. Model Security
- **Isolation Forest** for anomaly detection
- **Threat intelligence** integration
- **Predictive maintenance** for system health

### 3. Infrastructure Security
- **Environment variables** for secrets
- **Kubernetes secrets** for production
- **CORS configuration** for web access

## 📈 Scalability Design

### 1. Horizontal Scaling
- **Stateless API design** for easy scaling
- **Kubernetes deployments** with multiple replicas
- **Load balancing** via Kubernetes services

### 2. Performance Optimization
- **Model caching** to avoid repeated loading
- **Background tasks** for non-blocking operations
- **Async/await** patterns for I/O operations

### 3. Resource Management
- **Resource limits** in Kubernetes
- **Health checks** for automatic recovery
- **Graceful shutdown** handling

## 🔍 Monitoring & Observability

### 1. Health Monitoring
- **Health check endpoints** for system status
- **Model loading status** tracking
- **Active instances** monitoring

### 2. Logging
- **Structured logging** with timestamps
- **Request/response logging** for debugging
- **Error tracking** with context

### 3. Metrics
- **Prediction latency** tracking
- **Scaling decision** history
- **Model performance** metrics

## 🚀 Deployment Architecture

### Development Environment
```
Local Machine → Python Virtual Environment → FastAPI Development Server
```

### Production Environment
```
Docker Container → Kubernetes Cluster → Load Balancer → External Access
```

### CI/CD Pipeline
```
Code Push → Automated Testing → Docker Build → Kubernetes Deployment
```

This architecture ensures the system is:
- **Scalable**: Can handle increased load through horizontal scaling
- **Maintainable**: Modular design with clear separation of concerns
- **Reliable**: Health checks, monitoring, and error handling
- **Secure**: Input validation, threat detection, and secure configurations
```