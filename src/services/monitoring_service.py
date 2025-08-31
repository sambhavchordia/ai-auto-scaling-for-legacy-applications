import time
import psutil
import logging
from typing import Dict, Any, List
from datetime import datetime, timedelta
from src.api.models.schemas import SystemMetrics
from src.config.settings import settings

logger = logging.getLogger(__name__)

class MonitoringService:
    """Service for collecting and monitoring system metrics"""
    
    def __init__(self):
        self.metrics_history = []
        self.anomaly_threshold = settings.ANOMALY_THRESHOLD
        self.collection_interval = 30  # seconds
        self.active_instances = settings.MIN_INSTANCES
    
    async def initialize(self):
        """Initialize monitoring service"""
        logger.info("Initializing monitoring service...")
        # Initialize any async resources here
    
    def collect_metrics(self) -> SystemMetrics:
        """Collect current system metrics"""
        try:
            # Get CPU usage
            cpu_usage = psutil.cpu_percent(interval=1)
            
            # Get memory usage
            memory = psutil.virtual_memory()
            memory_usage = memory.percent
            
            # Get network I/O
            network = psutil.net_io_counters()
            network_io = network.bytes_sent + network.bytes_recv
            
            # Get disk I/O
            disk = psutil.disk_io_counters()
            disk_io = disk.read_bytes + disk.write_bytes if disk else 0
            
            # Get load averages
            load_1m, load_5m, load_15m = psutil.getloadavg()
            
            # Simulate other metrics
            requests_per_ip = self._simulate_requests_per_ip()
            source_variety = self._simulate_source_variety()
            
            metrics = SystemMetrics(
                timestamp=datetime.now().isoformat(),
                load_1m=load_1m,
                load_5m=load_5m,
                load_15m=load_15m,
                cpu_user=cpu_usage * 0.7,  # Simulate user CPU
                cpu_system=cpu_usage * 0.2,  # Simulate system CPU
                cpu_iowait=cpu_usage * 0.1,  # Simulate IO wait
                sys_mem_available=memory.available,
                sys_mem_total=memory.total,
                disk_io_time=disk_io / 1000000,  # Convert to MB
                disk_io_read=disk.read_bytes if disk else 0,
                disk_io_write=disk.write_bytes if disk else 0,
                requests_per_ip=requests_per_ip,
                source_variety=source_variety
            )
            
            # Store in history
            self.metrics_history.append(metrics)
            
            # Keep only last 1000 records
            if len(self.metrics_history) > 1000:
                self.metrics_history = self.metrics_history[-1000:]
            
            return metrics
        except Exception as e:
            logger.error(f"Error collecting metrics: {e}")
            raise
    
    def check_models_status(self) -> Dict[str, bool]:
        """Check if models are loaded and available"""
        try:
            from src.services.scaling_service import ScalingService
            service = ScalingService()
            return {
                "primary_model": service.primary_model is not None,
                "secondary_model": service.secondary_model is not None
            }
        except Exception as e:
            logger.error(f"Error checking models status: {e}")
            return {"primary_model": False, "secondary_model": False}
    
    def get_active_instances(self) -> int:
        """Get current number of active instances"""
        return self.active_instances
    
    def get_metrics_history(self, hours: int = 1) -> List[SystemMetrics]:
        """Get metrics history for the last N hours"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        return [m for m in self.metrics_history if datetime.fromisoformat(m.timestamp) > cutoff_time]
    
    def get_average_metrics(self, minutes: int = 5) -> Dict[str, float]:
        """Get average metrics for the last N minutes"""
        cutoff_time = datetime.now() - timedelta(minutes=minutes)
        recent_metrics = [m for m in self.metrics_history if datetime.fromisoformat(m.timestamp) > cutoff_time]
        
        if not recent_metrics:
            return {}
        
        return {
            "load_1m": sum(m.load_1m for m in recent_metrics) / len(recent_metrics),
            "load_5m": sum(m.load_5m for m in recent_metrics) / len(recent_metrics),
            "load_15m": sum(m.load_15m for m in recent_metrics) / len(recent_metrics),
            "cpu_user": sum(m.cpu_user for m in recent_metrics) / len(recent_metrics),
            "cpu_system": sum(m.cpu_system for m in recent_metrics) / len(recent_metrics),
            "cpu_iowait": sum(m.cpu_iowait for m in recent_metrics) / len(recent_metrics)
        }
    
    def _simulate_requests_per_ip(self) -> float:
        """Simulate requests per IP"""
        return 10.0 + (datetime.now().second % 60) * 0.5
    
    def _simulate_source_variety(self) -> float:
        """Simulate source variety"""
        return 5.0 + (datetime.now().minute % 60) * 0.1
