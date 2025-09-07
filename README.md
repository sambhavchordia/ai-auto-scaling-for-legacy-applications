# AI-Powered Auto-Scaling System

An intelligent, real-time auto-scaling platform that uses machine learning to predict load patterns and automatically scale infrastructure.

## 🚀 Features

- **ML-powered forecasting**: Prophet + tree-based models to predict load up to 24h ahead
- **Real-time anomaly detection**: Isolation Forest flags unusual traffic and risk
- **Live dashboard**: React + TypeScript with WebSocket updates
- **Intelligent scaling**: Automated scale up/down decisions based on ML signals
- **K8s-ready**: Docker images and manifests for easy deploys

## 🧭 Folder structure

```text
ai-auto-scaling-for-legacy-applications/
├─ data/                      # Sample datasets
├─ docker/                    # Dockerfiles and compose
├─ docs/                      # Architecture, API, deployment, contributing
├─ frontend/                  # React + TypeScript dashboard
│  ├─ server/                 # Dev server (proxy / SSR helpers if needed)
│  └─ src/                    # UI components, features, hooks, services
├─ k8s/                       # Kubernetes manifests
├─ models/                    # Model artifacts (generated/loaded at runtime)
├─ scripts/                   # Training, setup, benchmarking utilities
├─ src/                       # Python backend (FastAPI)
│  ├─ api/                    # Routes, middleware, WebSocket
│  ├─ config/                 # Settings and logging
│  ├─ services/               # Scaling + monitoring services
│  └─ utils/                  # Data loading, metrics, validators
├─ tests/                     # Unit + integration tests
├─ main.py                    # Backend entrypoint
├─ Makefile                   # Common dev tasks
├─ requirements*.txt          # Python dependencies
└─ README.md
```

## 🛠️ Tech stack

- **Backend**: FastAPI (Python 3.10+), Pydantic Settings, WebSockets
- **Frontend**: React, TypeScript, Vite, Tailwind, shadcn/ui, Recharts
- **ML**: Prophet, scikit-learn (Isolation Forest)
- **Ops**: Docker, Docker Compose, Kubernetes manifests

## ⚙️ Configuration

Backend settings are managed via environment variables (see `src/config/settings.py`). Key vars:

- `HOST` (default `0.0.0.0`)
- `PORT` (default `8000`)
- `DEBUG` (default `true`)
- `MODEL_PATH` (default `models/`)
- `SECRET_KEY`
- `CORS_ORIGINS` (default `[*]`)

You can place overrides in a local `.env` file at the repo root.

## 📦 Backend: run locally

```bash
# 1) Create a virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate

# 2) Install dependencies
pip install -r requirements.txt

# 3) (Optional) Train or prepare models
python scripts/train_models.py

# 4) Start the API
python main.py
# API will listen on http://localhost:8000

# Health check
curl http://localhost:8000/health
```

Common Make targets:

```bash
make install         # pip install -r requirements.txt
make run             # python src/api/main.py
make test            # run tests
make train           # train models
```

## 🖥️ Frontend: run locally

```bash
cd frontend
npm install  # or pnpm i / bun i
npm run dev
# App runs on http://localhost:5173 (Vite default)
```

The frontend expects the backend at `http://localhost:8000` by default. Adjust proxy/base URLs in `frontend/src/config.ts` if needed.

## 🐳 Docker & Docker Compose

Build and run the backend in Docker:

```bash
docker build -t ai-autoscaling .
docker run -p 8000:8000 ai-autoscaling
```

Or use Compose (includes volumes and healthcheck):

```bash
docker compose -f docker/docker-compose.yml up --build
# API available at http://localhost:8000
```

## ☁️ Deploy (Kubernetes)

K8s manifests are provided in `k8s/` for a simple deployment/service/ingress setup. Update image names and apply:

```bash
kubectl apply -f k8s/
```

## 🧪 Testing

```bash
pip install -r requirements-dev.txt
pytest tests/ -v
```

## 📚 Documentation

- Architecture: see `docs/ARCHITECTURE.md`
- API reference: see `docs/API.md`
- Deployment guide: see `docs/DEPLOYMENT.md`
- Contributing: see `docs/CONTRIBUTING.md`

## 📝 Notes

- Sample data is provided in `data/`. You can plug in your own metrics/time-series.
- Model artifacts are read from `models/` (create if missing). Training scripts will populate it.

## 📄 License

MIT License — see `LICENSE` for details.
