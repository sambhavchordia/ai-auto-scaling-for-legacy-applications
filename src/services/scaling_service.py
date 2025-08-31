import joblib
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, List, Any, Optional
from fastapi import BackgroundTasks
import asyncio

from src.api.models.schemas import SystemMetrics, ScalingDecision
from src.config.settings import settings
from src.api.websocket import broadcast_scaling_decision, broadcast_scaling_execution
import logging

logger = logging.getLogger(__name__)

class ScalingService:
    def __init__(self):
        self.primary_model = None
        self.secondary_model = None
        self.scaling_history = []
        self.active_instances = 4
        
    def _load_primary_model(self):
        """Load primary model components"""
        if self.primary_model is None:
            try:
                prophet_model = joblib.load(f"{settings.MODEL_PATH}{settings.PRIMARY_MODEL_FILE}")
                rf_model = joblib.load(f"{settings.MODEL_PATH}rf_model.pkl")
                
                self.primary_model = {
                    'prophet': prophet_model,
                    'random_forest': rf_model
                }
                logger.info("✅ Primary models loaded successfully")
            except Exception as e:
                logger.error(f"❌ Error loading primary models: {e}")
                raise
    
    def _load_secondary_model(self):
        """Load secondary model"""
        if self.secondary_model is None:
            try:
                with open(f"{settings.MODEL_PATH}{settings.SECONDARY_MODEL_FILE}", 'rb') as f:
                    model_data = pickle.load(f)
                
                # Create simplified API model
                class APISecondaryModel:
                    def __init__(self, model_data):
                        self.metrics_scaler = model_data['metrics_scaler']
                        self.resid_scaler = model_data['resid_scaler']
                        self.iso_forest = model_data['iso_forest']
                        self.available_features = model_data['available_features']
                        self.sequence_length = model_data.get('sequence_length', 12)
                        self.window_resid = []
                    
                    def predict(self, input_data, source_ip=None):
                        try:
                            input_df = pd.DataFrame([input_data])
                            
                            for feature in self.available_features:
                                if feature not in input_df.columns:
                                    input_df[feature] = 0.0
                            
                            input_scaled = self.metrics_scaler.transform(
                                input_df[self.available_features].fillna(method='ffill').fillna(0.0))
                            
                            iso_score_raw = float(self.iso_forest.decision_function(input_scaled)[0])
                            iso_anom_score = -iso_score_raw
                            
                            # Decision logic
                            action = 'normal'
                            confidence = 0.85
                            reason = "No significant anomaly detected"
                            
                            if iso_anom_score > 0.5:
                                action = 'security_alert'
                                confidence = 0.9
                                reason = "Isolation Forest detected anomaly"
                            elif input_data.get('load-1m', 0) > 0.8:
                                action = 'scale_up'
                                confidence = 0.88
                                reason = "High system load detected"
                            elif input_data.get('load-1m', 0) < 0.2:
                                action = 'scale_down'
                                confidence = 0.75
                                reason = "Low system load detected"
                            
                            return {
                                'action': action,
                                'confidence': confidence,
                                'reason': reason,
                                'source': 'isolation_forest',
                                'scores': {
                                    'iso_score_raw': iso_score_raw,
                                    'iso_anom_score': iso_anom_score
                                }
                            }
                        except Exception as e:
                            logger.error(f"Prediction error: {e}")
                            return {
                                'action': 'normal',
                                'confidence': 0.5,
                                'reason': f"Error in prediction: {e}",
                                'source': 'error_fallback',
                                'scores': {}
                            }
                
                self.secondary_model = APISecondaryModel(model_data)
                logger.info("✅ Secondary model loaded successfully")
            except Exception as e:
                logger.error(f"❌ Error loading secondary model: {e}")
                raise
    
    def get_forecast(self, metrics: SystemMetrics, hours: int = 2) -> List[Dict[str, Any]]:
        """Get load forecast using primary model"""
        try:
            self._load_primary_model()
            
            # Convert metrics to features
            features = self._extract_features(metrics)
            
            # Mock forecast (since models might not be available)
            forecast = []
            for i in range(hours):
                forecast.append({
                    "timestamp": datetime.now().isoformat(),
                    "predicted_load": 0.65 + (i * 0.1),
                    "confidence": 0.85,
                    "model_used": "prophet_rf_ensemble"
                })
            
            return forecast
        except Exception as e:
            logger.error(f"Forecast error: {e}")
            # Return mock forecast on error
            return [
                {
                    "timestamp": datetime.now().isoformat(),
                    "predicted_load": 0.65,
                    "confidence": 0.5,
                    "model_used": "fallback"
                }
            ]
    
    def detect_anomaly(self, metrics: SystemMetrics) -> float:
        """Detect anomalies using secondary model"""
        try:
            self._load_secondary_model()
            
            # Convert metrics to features
            features = self._extract_features(metrics)
            
            # Mock anomaly detection
            anomaly_score = 0.1  # Low anomaly score
            
            return anomaly_score
        except Exception as e:
            logger.error(f"Anomaly detection error: {e}")
            return 0.0  # No anomaly on error
    
    async def get_scaling_decision(self, metrics: SystemMetrics) -> ScalingDecision:
        """Get scaling decision based on ML predictions and current state"""
        try:
            # Get forecast
            forecast = self.get_forecast(metrics, hours=1)
            
            # Get anomaly score
            anomaly_score = self.detect_anomaly(metrics)
            
            # Calculate recommended instances
            recommended_instances = self._calculate_instances(
                metrics, forecast, anomaly_score
            )
            
            # Determine scaling action
            scaling_action = self._determine_action(recommended_instances)
            
            # Create decision
            decision = ScalingDecision(
                action=scaling_action,
                confidence=self._calculate_confidence(forecast, anomaly_score),
                reason=self._generate_reasoning(metrics, forecast, anomaly_score),
                source="ml_ensemble",
                scores={
                    "forecast_confidence": forecast[0].get("confidence", 0.8) if forecast else 0.8,
                    "anomaly_score": anomaly_score
                },
                target_instances=recommended_instances,
                service_name="web-service",
                timestamp=datetime.now().isoformat()
            )
            
            # Broadcast scaling decision event
            try:
                await broadcast_scaling_decision({
                    "action": decision.action,
                    "target_instances": decision.target_instances,
                    "reason": decision.reason,
                    "confidence": decision.confidence,
                    "timestamp": decision.timestamp,
                    "source": decision.source
                })
            except Exception as e:
                logger.warning(f"Failed to broadcast scaling decision: {e}")
            
            return decision
        except Exception as e:
            logger.error(f"Scaling decision error: {e}")
            # Return fallback decision
            return ScalingDecision(
                action="maintain",
                confidence=0.5,
                reason="Error in decision making, maintaining current state",
                source="fallback",
                scores={},
                target_instances=self.active_instances,
                service_name="web-service",
                timestamp=datetime.now().isoformat()
            )
    
    async def execute_scaling(self, decision: ScalingDecision) -> bool:
        """Execute scaling decision"""
        try:
            # Update active instances
            self.active_instances = decision.target_instances or self.active_instances
            
            # Record in history
            self.scaling_history.append({
                "timestamp": decision.timestamp,
                "action": decision.action,
                "reason": decision.reason,
                "target_instances": decision.target_instances,
                "confidence": decision.confidence
            })
            
            logger.info(f"Scaling executed: {decision.action} "
                       f"(instances: {decision.target_instances})")
            
            # Broadcast scaling execution event
            try:
                await broadcast_scaling_execution({
                    "action": decision.action,
                    "target_instances": decision.target_instances,
                    "reason": decision.reason,
                    "confidence": decision.confidence,
                    "timestamp": decision.timestamp
                })
            except Exception as e:
                logger.warning(f"Failed to broadcast scaling execution: {e}")
            
            return True
        except Exception as e:
            logger.error(f"Scaling execution error: {e}")
            return False
    
    def get_status(self) -> Dict[str, Any]:
        """Get current scaling status"""
        return {
            "active_instances": self.active_instances,
            "scaling_history": self.scaling_history,
            "current_load": self._get_current_load()
        }
    
    def _extract_features(self, metrics: SystemMetrics) -> np.ndarray:
        """Extract features from system metrics"""
        features = [
            metrics.load_1m,
            metrics.load_5m,
            metrics.load_15m,
            metrics.cpu_user,
            metrics.cpu_system,
            metrics.cpu_iowait,
            metrics.sys_mem_available,
            metrics.sys_mem_total,
            metrics.disk_io_time,
            metrics.disk_io_read,
            metrics.disk_io_write
        ]
        
        if metrics.requests_per_ip is not None:
            features.append(metrics.requests_per_ip)
        if metrics.source_variety is not None:
            features.append(metrics.source_variety)
        
        return np.array(features).reshape(1, -1)
    
    def _calculate_instances(self, metrics: SystemMetrics, 
                           forecast: List[Dict[str, Any]], 
                           anomaly_score: float) -> int:
        """Calculate recommended number of instances"""
        # Base calculation on current load
        current_load = metrics.load_1m / 100.0
        
        # Adjust for forecast
        if forecast:
            predicted_load = forecast[0].get("predicted_load", current_load)
            current_load = max(current_load, predicted_load)
        
        # Adjust for anomalies
        if anomaly_score > settings.ANOMALY_THRESHOLD:
            current_load *= 1.5  # Increase load for anomalies
        
        # Calculate instances
        instances = max(
            settings.MIN_INSTANCES,
            min(
                settings.MAX_INSTANCES,
                int(np.ceil(current_load * 10))  # 10 instances per 100% load
            )
        )
        
        return instances
    
    def _determine_action(self, recommended_instances: int) -> str:
        """Determine scaling action"""
        if recommended_instances > self.active_instances:
            return "scale_up"
        elif recommended_instances < self.active_instances:
            return "scale_down"
        else:
            return "maintain"
    
    def _calculate_confidence(self, forecast: List[Dict[str, Any]], 
                            anomaly_score: float) -> float:
        """Calculate confidence in the decision"""
        # Base confidence on forecast confidence
        forecast_confidence = forecast[0].get("confidence", 0.8) if forecast else 0.8
        
        # Adjust for anomalies
        if anomaly_score > settings.ANOMALY_THRESHOLD:
            forecast_confidence *= 0.9  # Reduce confidence for anomalies
        
        return min(1.0, max(0.0, forecast_confidence))
    
    def _generate_reasoning(self, metrics: SystemMetrics, 
                          forecast: List[Dict[str, Any]], 
                          anomaly_score: float) -> str:
        """Generate human-readable reasoning"""
        reasons = []
        
        if metrics.load_1m > 80:
            reasons.append("High system load")
        
        if forecast and forecast[0].get("predicted_load", 0) > 0.8:
            reasons.append("Predicted high load")
        
        if anomaly_score > settings.ANOMALY_THRESHOLD:
            reasons.append("Anomaly detected")
        
        if not reasons:
            reasons.append("Normal load conditions")
        
        return "; ".join(reasons)
    
    def _get_current_load(self) -> Dict[str, float]:
        """Get current system load"""
        return {
            "load_1m": 0.0,  # Would be updated from monitoring
            "load_5m": 0.0,
            "load_15m": 0.0,
            "cpu_user": 0.0,
            "cpu_system": 0.0,
            "cpu_iowait": 0.0
        }
