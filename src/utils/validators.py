from typing import Dict, Any, List, Optional
import re
import logging

logger = logging.getLogger(__name__)

class DataValidator:
    """Data validation utilities"""
    
    @staticmethod
    def validate_ip_address(ip: str) -> bool:
        """Validate IP address format"""
        if not ip:
            return False
        
        # Simple IP validation
        ip_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
        if not re.match(ip_pattern, ip):
            return False
        
        # Check each octet
        octets = ip.split('.')
        for octet in octets:
            if not (0 <= int(octet) <= 255):
                return False
        
        return True
    
    @staticmethod
    def validate_metrics(metrics: Dict[str, Any]) -> Dict[str, List[str]]:
        """Validate system metrics"""
        errors = []
        warnings = []
        
        # Required fields
        required_fields = [
            'load_1m', 'load_5m', 'load_15m',
            'cpu_user', 'cpu_system', 'cpu_iowait',
            'sys_mem_available', 'sys_mem_total',
            'disk_io_time', 'disk_io_read', 'disk_io_write'
        ]
        
        for field in required_fields:
            if field not in metrics:
                errors.append(f"Missing required field: {field}")
            elif not isinstance(metrics[field], (int, float)):
                errors.append(f"Field {field} must be numeric")
        
        # Range validation
        if 'load_1m' in metrics:
            if not (0 <= metrics['load_1m'] <= 100):
                warnings.append("load_1m should be between 0 and 100")
        
        if 'cpu_user' in metrics:
            if not (0 <= metrics['cpu_user'] <= 100):
                warnings.append("cpu_user should be between 0 and 100")
        
        # Memory validation
        if 'sys_mem_available' in metrics and 'sys_mem_total' in metrics:
            if metrics['sys_mem_available'] > metrics['sys_mem_total']:
                errors.append("Available memory cannot exceed total memory")
        
        return {"errors": errors, "warnings": warnings}
    
    @staticmethod
    def validate_timestamp(timestamp: str) -> bool:
        """Validate timestamp format"""
        try:
            from datetime import datetime
            datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            return True
        except ValueError:
            return False
    
    @staticmethod
    def sanitize_input(data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize input data"""
        sanitized = {}
        
        for key, value in data.items():
            if isinstance(value, str):
                # Remove potential dangerous characters
                sanitized[key] = value.strip()
            elif isinstance(value, (int, float)):
                sanitized[key] = value
            else:
                sanitized[key] = str(value)
        
        return sanitized
