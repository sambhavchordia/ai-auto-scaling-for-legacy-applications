# API Documentation

## Overview

The AI-Powered Auto-Scaling API provides intelligent scaling decisions based on machine learning models.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, no authentication is required. In production, implement proper authentication.

## Endpoints

### Health Check

#### GET /health

Check the health status of the API and loaded models.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "models_loaded": {
    "primary": true,
    "secondary": true
  },
  "active_instances": 4,
  "version": "1.0.0"
}
```

### Predictions

#### GET /predict/primary

Get load forecast from the primary model.

**Parameters:**
- `hours` (int, optional): Number of hours to forecast (default: 2)

**Response:**
```json
{
  "forecast_hours": 2,
  "generated_at": "2024-01-15T10:30:00",
  "forecast": [
    {
      "timestamp": "2024-01-15T11:00:00",
      "predicted_active_users": 1250,
      "yhat_lower": 1100,
      "yhat_upper": 1400
    }
  ]
}
```

#### POST /predict/secondary

Get scaling decision from the secondary model.

**Request Body:**
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "load_1m": 0.85,
  "load_5m": 0.78,
  "load_15m": 0.72,
  "cpu_user": 65.2,
  "cpu_system": 12.1,
  "cpu_iowait": 8.5,
  "sys_mem_available": 2048,
  "sys_mem_total": 4096,
  "disk_io_time": 45.2,
  "disk_io_read": 120.5,
  "disk_io_write": 85.3,
  "source_ip": "192.168.1.100"
}
```

**Response:**
```json
{
  "action": "scale_up",
  "confidence": 0.88,
  "reason": "High system load detected",
  "source": "isolation_forest",
  "scores": {
    "iso_score_raw": 0.1234,
    "iso_anom_score": 0.8766
  },
  "target_instances": 5,
  "service_name": "web-service",
  "timestamp": "2024-01-15T10:30:00"
}
```

### Scaling

#### GET /scaling/history

Get scaling action history.

**Parameters:**
- `limit` (int, optional): Number of recent actions to return (default: 10)

#### GET /scaling/status

Get current system status.

#### POST /scaling/execute

Execute a scaling action manually.

## Error Responses

All endpoints return standard HTTP status codes:

- `200`: Success
- `400`: Bad Request
- `500`: Internal Server Error
- `503`: Service Unavailable

Error responses include a detail message:

```json
{
  "detail": "Error description"
}
```
```

### **33. data/README.md**
```markdown
# Data Directory

This directory contains datasets used for training and testing the AI auto-scaling system.

## Files

- `yearly_synthetic_dataset_with_scaling.csv` - Primary dataset for time series forecasting
- `system-10_with_binned_instances.csv` - Secondary dataset for anomaly detection

## Data Sources

The datasets contain synthetic system metrics including:
- Load averages (1m, 5m, 15m)
- CPU usage (user, system, iowait)
- Memory metrics
- Disk I/O statistics
- Network metrics
- Timestamp information

## Usage

These datasets are automatically used by the training scripts:
- `scripts/train_models.py` - Uses both datasets for model training
- Primary model uses the yearly dataset for forecasting
- Secondary model uses the system dataset for anomaly detection

## Data Privacy

All data is synthetic and does not contain any real system information.
```

### **34. models/README.md**
```markdown
# Models Directory

This directory stores trained machine learning models for the AI auto-scaling system.

## Model Fil
