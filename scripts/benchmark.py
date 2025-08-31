#!/usr/bin/env python3
"""
Performance Benchmarking Script

Benchmarks the performance of the AI auto-scaling system.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import time
import json
import statistics
from datetime import datetime
from src.services.scaling_service import ScalingService
from src.api.models.schemas import SystemMetrics
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BenchmarkRunner:
    """Benchmark runner for performance testing"""
    
    def __init__(self):
        self.scaling_service = ScalingService()
        self.results = []
    
    def generate_test_data(self, num_samples: int = 100) -> list:
        """Generate test data for benchmarking"""
        import numpy as np
        
        test_data = []
        for i in range(num_samples):
            # Generate realistic system metrics
            load_1m = np.random.uniform(0.1, 2.0)
            load_5m = load_1m * np.random.uniform(0.8, 1.2)
            load_15m = load_5m * np.random.uniform(0.8, 1.2)
            
            metrics = {
                "timestamp": datetime.now().isoformat(),
                "load_1m": load_1m,
                "load_5m": load_5m,
                "load_15m": load_15m,
                "cpu_user": np.random.uniform(10, 90),
                "cpu_system": np.random.uniform(5, 20),
                "cpu_iowait": np.random.uniform(0, 15),
                "sys_mem_available": np.random.uniform(1024, 4096),
                "sys_mem_total": 4096,
                "disk_io_time": np.random.uniform(5, 50),
                "disk_io_read": np.random.uniform(50, 200),
                "disk_io_write": np.random.uniform(30, 150),
                "source_ip": f"192.168.1.{np.random.randint(1, 255)}"
            }
            test_data.append(metrics)
        
        return test_data
    
    def benchmark_secondary_prediction(self, test_data: list) -> dict:
        """Benchmark secondary model predictions"""
        logger.info("🔄 Benchmarking secondary model predictions...")
        
        times = []
        predictions = []
        
        for metrics in test_data:
            try:
                start_time = time.time()
                decision = self.scaling_service.get_secondary_decision(SystemMetrics(**metrics))
                end_time = time.time()
                
                times.append(end_time - start_time)
                predictions.append(decision.action)
                
            except Exception as e:
                logger.warning(f"Prediction failed: {e}")
        
        if times:
            return {
                "test_type": "secondary_prediction",
                "total_predictions": len(times),
                "successful_predictions": len(times),
                "failed_predictions": len(test_data) - len(times),
                "avg_time_ms": statistics.mean(times) * 1000,
                "min_time_ms": min(times) * 1000,
                "max_time_ms": max(times) * 1000,
                "std_time_ms": statistics.stdev(times) * 1000 if len(times) > 1 else 0,
                "predictions_per_second": 1 / statistics.mean(times) if times else 0,
                "action_distribution": {action: predictions.count(action) for action in set(predictions)}
            }
        else:
            return {"test_type": "secondary_prediction", "error": "No successful predictions"}
    
    def benchmark_primary_forecast(self, num_runs: int = 10) -> dict:
        """Benchmark primary model forecasting"""
        logger.info("🔄 Benchmarking primary model forecasting...")
        
        times = []
        
        for i in range(num_runs):
            try:
                start_time = time.time()
                forecast = self.scaling_service.get_primary_forecast(hours=2)
                end_time = time.time()
                
                times.append(end_time - start_time)
                
            except Exception as e:
                logger.warning(f"Forecast failed: {e}")
        
        if times:
            return {
                "test_type": "primary_forecast",
                "total_runs": num_runs,
                "successful_runs": len(times),
                "failed_runs": num_runs - len(times),
                "avg_time_ms": statistics.mean(times) * 1000,
                "min_time_ms": min(times) * 1000,
                "max_time_ms": max(times) * 1000,
                "std_time_ms": statistics.stdev(times) * 1000 if len(times) > 1 else 0,
                "forecasts_per_second": 1 / statistics.mean(times) if times else 0
            }
        else:
            return {"test_type": "primary_forecast", "error": "No successful forecasts"}
    
    def run_all_benchmarks(self) -> dict:
        """Run all benchmarks"""
        logger.info("🚀 Starting performance benchmarks...")
        
        # Generate test data
        test_data = self.generate_test_data(100)
        
        # Run benchmarks
        secondary_results = self.benchmark_secondary_prediction(test_data)
        primary_results = self.benchmark_primary_forecast(10)
        
        # Compile results
        benchmark_results = {
            "timestamp": datetime.now().isoformat(),
            "benchmark_version": "1.0.0",
            "results": [secondary_results, primary_results]
        }
        
        return benchmark_results
    
    def save_results(self, results: dict, filename: str = None):
        """Save benchmark results"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"benchmark_results_{timestamp}.json"
        
        try:
            with open(filename, 'w') as f:
                json.dump(results, f, indent=2)
            logger.info(f"✅ Benchmark results saved to {filename}")
            return filename
        except Exception as e:
            logger.error(f"❌ Error saving results: {e}")
            return None

def main():
    """Main benchmark function"""
    runner = BenchmarkRunner()
    
    try:
        results = runner.run_all_benchmarks()
        filename = runner.save_results(results)
        
        # Print summary
        logger.info("\n📊 Benchmark Summary:")
        for result in results['results']:
            if 'error' not in result:
                logger.info(f"  {result['test_type']}:")
                logger.info(f"    Avg time: {result['avg_time_ms']:.2f}ms")
                logger.info(f"    Throughput: {result.get('predictions_per_second', result.get('forecasts_per_second', 0)):.2f}/sec")
                if 'action_distribution' in result:
                    logger.info(f"    Actions: {result['action_distribution']}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Benchmark failed: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
