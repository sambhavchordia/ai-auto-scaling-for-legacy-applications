# Documentation

Welcome to the AI-Powered Auto-Scaling System documentation.

## 📚 Documentation Structure

- **[API Documentation](API.md)** - Complete API reference and examples
- **[Architecture Guide](ARCHITECTURE.md)** - System architecture and design
- **[Deployment Guide](DEPLOYMENT.md)** - Deployment instructions
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

## �� Quick Start

1. **Installation**: Follow the main README.md for installation instructions
2. **Training**: Run `python scripts/train_models.py` to train the models
3. **API**: Start the server with `python src/api/main.py`
4. **Testing**: Run tests with `pytest tests/`

## 📊 System Overview

The AI Auto-Scaling System consists of:

- **Primary Model**: Time series forecasting using Prophet and Random Forest
- **Secondary Model**: Anomaly detection using Isolation Forest and LSTM
- **API Server**: FastAPI-based REST API for real-time decisions
- **Config Generator**: AI-powered infrastructure configuration

## �� Configuration

The system can be configured through environment variables:

- `API_HOST`: Server host (default: 0.0.0.0)
- `API_PORT`: Server port (default: 8000)
- `DEBUG`: Debug mode (default: false)
- `LOG_LEVEL`: Logging level (default: INFO)
- `MODEL_PATH`: Path to model files (default: models/)

## 📈 Monitoring

The system provides several monitoring endpoints:

- `/health` - System health check
- `/scaling/status` - Current system status
- `/scaling/history` - Scaling action history

## 🛠️ Development

For development setup:

1. Install dev dependencies: `pip install -r requirements-dev.txt`
2. Setup pre-commit hooks: `pre-commit install`
3. Run tests: `pytest tests/`
4. Format code: `black src/ tests/`
5. Lint code: `flake8 src/ tests/`