// Use VITE_API_BASE_URL from .env if available, otherwise default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
