.PHONY: help install install-dev train run test test-coverage lint clean docker-build docker-run setup

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pip install -r requirements.txt

install-dev: ## Install development dependencies
	pip install -r requirements-dev.txt

train: ## Train all models
	python scripts/train_models.py

run: ## Start the API server
	python src/api/main.py

test: ## Run tests
	pytest tests/ -v

test-coverage: ## Run tests with coverage
	pytest tests/ --cov=src --cov-report=html

lint: ## Run linting
	black src/ tests/
	flake8 src/ tests/

clean: ## Clean up generated files
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf build/ dist/ *.egg-info/

docker-build: ## Build Docker image
	docker build -t ai-autoscaling .

docker-run: ## Run with Docker
	docker run -p 8000:8000 ai-autoscaling

setup: install train ## Complete setup
	@echo "✅ Setup complete! Run 'make run' to start the server."
