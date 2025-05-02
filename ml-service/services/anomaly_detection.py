import numpy as np
from sklearn.ensemble import IsolationForest
from typing import Dict, Any
import json
import os
from datetime import datetime
from .face_recognition import FaceRecognitionService

class AnomalyDetectionService:
    def __init__(self):
        self.face_recognition = FaceRecognitionService()
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.user_models = {}
        self.load_models()

    def load_models(self):
        """Load anomaly detection models from storage"""
        try:
            if os.path.exists('data/anomaly_models.json'):
                with open('data/anomaly_models.json', 'r') as f:
                    self.user_models = json.load(f)
        except Exception as e:
            print(f"Error loading anomaly models: {e}")

    def save_models(self):
        """Save anomaly detection models to storage"""
        try:
            os.makedirs('data', exist_ok=True)
            with open('data/anomaly_models.json', 'w') as f:
                json.dump(self.user_models, f)
        except Exception as e:
            print(f"Error saving anomaly models: {e}")

    def extract_features(self, face_data: str) -> np.ndarray:
        """Extract features from face data for anomaly detection"""
        try:
            # Decode image
            image = self.face_recognition.decode_base64_image(face_data)
            
            # Get face landmarks
            landmarks = self.face_recognition.get_face_landmarks(image)
            if not landmarks:
                raise ValueError("No face landmarks detected")
            
            # Extract features from landmarks
            features = []
            for key, points in landmarks.items():
                # Calculate distances between key points
                for i in range(len(points) - 1):
                    for j in range(i + 1, len(points)):
                        dist = np.sqrt(
                            (points[i][0] - points[j][0])**2 +
                            (points[i][1] - points[j][1])**2
                        )
                        features.append(dist)
            
            return np.array(features)
        except Exception as e:
            raise Exception(f"Feature extraction failed: {e}")

    async def detect(self, face_data: str, user_id: str, session_id: str) -> Dict[str, Any]:
        """Detect anomalies in face data"""
        try:
            # Extract features
            features = self.extract_features(face_data)
            
            # Get or create user model
            if user_id not in self.user_models:
                self.user_models[user_id] = {
                    "model": self.anomaly_detector,
                    "features": []
                }
            
            # Update user model
            self.user_models[user_id]["features"].append(features)
            if len(self.user_models[user_id]["features"]) > 10:
                self.user_models[user_id]["features"] = self.user_models[user_id]["features"][-10:]
            
            # Fit model if enough samples
            if len(self.user_models[user_id]["features"]) >= 5:
                X = np.array(self.user_models[user_id]["features"])
                self.user_models[user_id]["model"].fit(X)
            
            # Predict anomaly
            is_anomaly = False
            confidence = 0.0
            reason = None
            
            if len(self.user_models[user_id]["features"]) >= 5:
                prediction = self.user_models[user_id]["model"].predict([features])[0]
                score = self.user_models[user_id]["model"].score_samples([features])[0]
                
                is_anomaly = prediction == -1
                confidence = abs(score)
                
                if is_anomaly:
                    reason = "Unusual facial features detected"
            
            # Save updated models
            self.save_models()
            
            return {
                "is_anomaly": is_anomaly,
                "confidence": float(confidence),
                "reason": reason
            }
        except Exception as e:
            raise Exception(f"Anomaly detection failed: {e}")

    def get_user_model(self, user_id: str) -> Dict[str, Any]:
        """Get anomaly detection model for a user"""
        return self.user_models.get(user_id, {
            "model": self.anomaly_detector,
            "features": []
        }) 