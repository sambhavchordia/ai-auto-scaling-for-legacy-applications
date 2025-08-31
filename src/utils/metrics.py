import numpy as np
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class MetricsCalculator:
    """Utility class for calculating various metrics"""
    
    @staticmethod
    def calculate_load_average(load_1m: float, load_5m: float, load_15m: float) -> Dict[str, float]:
        """Calculate load average metrics"""
        return {
            "load_1m": load_1m,
            "load_5m": load_5m,
            "load_15m": load_15m,
            "load_trend": (load_1m - load_15m) / max(load_15m, 0.1)  # Avoid division by zero
        }
    
    @staticmethod
    def calculate_cpu_metrics(cpu_user: float, cpu_system: float, cpu_iowait: float) -> Dict[str, float]:
        """Calculate CPU-related metrics"""
        total_cpu = cpu_user + cpu_system + cpu_iowait
        return {
            "cpu_total": total_cpu,
            "cpu_user_ratio": cpu_user / max(total_cpu, 0.1),
            "cpu_system_ratio": cpu_system / max(total_cpu, 0.1),
            "cpu_iowait_ratio": cpu_iowait / max(total_cpu, 0.1)
        }
    
    @staticmethod
    def calculate_memory_metrics(available: float, total: float) -> Dict[str, float]:
        """Calculate memory-related metrics"""
        used = total - available
        usage_ratio = used / max(total, 0.1)
        return {
            "memory_used": used,
            "memory_usage_ratio": usage_ratio,
            "memory_available_ratio": available / max(total, 0.1)
        }
    
    @staticmethod
    def calculate_disk_metrics(io_time: float, io_read: float, io_write: float) -> Dict[str, float]:
        """Calculate disk I/O metrics"""
        total_io = io_read + io_write
        return {
            "disk_total_io": total_io,
            "disk_read_ratio": io_read / max(total_io, 0.1),
            "disk_write_ratio": io_write / max(total_io, 0.1),
            "disk_io_efficiency": 1 - (io_time / 100)  # Lower is better
        }
    
    @staticmethod
    def calculate_anomaly_score(metrics: Dict[str, float]) -> float:
        """Calculate anomaly score based on metrics"""
        # Simple anomaly scoring - can be enhanced with ML models
        load_score = min(metrics.get('load_1m', 0) / 10, 1.0)
        cpu_score = min(metrics.get('cpu_total', 0) / 100, 1.0)
        memory_score = metrics.get('memory_usage_ratio', 0)
        
        # Weighted average
        anomaly_score = (load_score * 0.4 + cpu_score * 0.4 + memory_score * 0.2)
        return min(anomaly_score, 1.0)
