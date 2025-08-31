# Contributing Guide

Thank you for your interest in contributing to the AI-Powered Auto-Scaling System! This guide will help you get started with contributing to the project.

## 🤝 How to Contribute

### 1. Fork the Repository
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/yourusername/ai-autoscaling-system.git
cd ai-autoscaling-system

# Add upstream remote
git remote add upstream https://github.com/original-owner/ai-autoscaling-system.git
```

### 2. Set Up Development Environment
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Install pre-commit hooks
pre-commit install
```

### 3. Create a Feature Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-description
```

## 📋 Development Workflow

### 1. Code Style
We use the following tools to maintain code quality:

- **Black**: Code formatting
- **Flake8**: Linting
- **Pre-commit**: Git hooks for quality checks

```bash
# Format code
black src/ tests/

# Check linting
flake8 src/ tests/

# Run all checks
pre-commit run --all-files
```

### 2. Testing
```bash
# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run specific test file
pytest tests/unit/test_api.py

# Run integration tests
pytest tests/integration/
```

### 3. Type Checking
```bash
# Run type checking (if mypy is configured)
mypy src/
```

## ��️ Project Structure

### Adding New Features

#### 1. API Endpoints
```python
# Add new route in src/api/routes/
from fastapi import APIRouter

router = APIRouter(prefix="/your-feature", tags=["Your Feature"])

@router.get("/")
async def your_endpoint():
    return {"message": "Your feature"}
```

#### 2. Models
```python
# Add new model in src/models/
class YourModel:
    def __init__(self):
        pass
    
    def train(self):
        pass
    
    def predict(self):
        pass
```

#### 3. Services
```python
# Add new service in src/services/
class YourService:
    def __init__(self):
        pass
    
    def your_method(self):
        pass
```

#### 4. Tests
```python
# Add tests in tests/unit/ or tests/integration/
def test_your_feature():
    # Your test code
    pass
```

### Code Organization

#### File Naming
- Use snake_case for Python files
- Use descriptive names
- Group related functionality

#### Import Organization
```python
# Standard library imports
import os
import sys
from typing import Dict, List

# Third-party imports
import pandas as pd
import numpy as np

# Local imports
from src.models import YourModel
from src.services import YourService
```

#### Documentation
```python
def your_function(param1: str, param2: int) -> Dict[str, Any]:
    """
    Brief description of what the function does.
    
    Args:
        param1: Description of param1
        param2: Description of param2
        
    Returns:
        Description of return value
        
    Raises:
        ValueError: When something goes wrong
    """
    pass
```

## �� Testing Guidelines

### 1. Test Structure
```python
class TestYourFeature:
    def setup_method(self):
        """Setup for each test method"""
        pass
    
    def test_success_case(self):
        """Test successful operation"""
        pass
    
    def test_error_case(self):
        """Test error handling"""
        pass
    
    def test_edge_case(self):
        """Test edge cases"""
        pass
```

### 2. Test Data
```python
@pytest.fixture
def sample_data():
    return {
        "field1": "value1",
        "field2": "value2"
    }

def test_with_fixture(sample_data):
    # Use the fixture
    pass
```

### 3. Mocking
```python
from unittest.mock import patch, MagicMock

def test_with_mock():
    with patch('module.function') as mock_func:
        mock_func.return_value = "mocked_result"
        # Your test code
        pass
```

## �� Documentation

### 1. Code Documentation
- Use docstrings for all public functions and classes
- Follow Google or NumPy docstring format
- Include type hints

### 2. API Documentation
- Update API.md for new endpoints
- Include request/response examples
- Document error codes

### 3. Architecture Documentation
- Update ARCHITECTURE.md for significant changes
- Include diagrams when helpful
- Document design decisions

## 🔄 Pull Request Process

### 1. Before Submitting
```bash
# Ensure all tests pass
pytest tests/

# Check code quality
pre-commit run --all-files

# Update documentation
# Add/update tests for new features
```

### 2. Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### 3. Review Process
- All PRs require at least one review
- Address review comments promptly
- Maintainers will merge after approval

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Ubuntu 20.04]
- Python: [e.g., 3.9.7]
- Version: [e.g., 1.0.0]

## Additional Information
Screenshots, logs, etc.
```

## �� Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How you think it should work

## Alternatives Considered
Other approaches you considered

## Additional Information
Any other relevant information
```

## ��️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Requests**: For code contributions

### Code of Conduct
- Be respectful and inclusive
- Help others learn
- Focus on the code, not the person
- Be patient with newcomers

## 🎯 Hackathon Contributions

### Quick Start for Hackathon Participants
```bash
# 1. Fork and clone
git clone https://github.com/yourusername/ai-autoscaling-system.git

# 2. Quick setup
make setup

# 3. Start development
make run

# 4. Make changes and test
pytest tests/

# 5. Submit PR
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

### Hackathon-Friendly Features
- **Quick setup**: One-command installation
- **Clear documentation**: Step-by-step guides
- **Modular design**: Easy to extend
- **Comprehensive tests**: Confidence in changes

### Common Hackathon Contributions
- **New ML models**: Add different algorithms
- **API endpoints**: New functionality
- **UI improvements**: Better user experience
- **Performance optimizations**: Speed improvements
- **Documentation**: Better guides and examples

## 🏆 Recognition

Contributors will be recognized in:
- **README.md**: List of contributors