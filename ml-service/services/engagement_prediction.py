import numpy as np
import tensorflow as tf
from typing import Dict, Any
import json
import os
from datetime import datetime
from .face_recognition import FaceRecognitionService

class EngagementPredictionService:
    def __init__(self):
        self.face_recognition = FaceRecognitionService()
        self.model = self.load_model()
        self.user_history = {}
        self.load_history()

    def load_model(self) -> tf.keras.Model:
        """Load or create engagement prediction model"""
        try:
            if os.path.exists('data/engagement_model'):
                return tf.keras.models.load_model('data/engagement_model')
            else:
                return self.create_model()
        except Exception as e:
            print(f"Error loading model: {e}")
            return self.create_model()

    def create_model(self) -> tf.keras.Model:
        """Create a new engagement prediction model"""
        model = tf.keras.Sequential([
            tf.keras.layers.Dense(128, activation='relu', input_shape=(68,)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(32, activation='relu'),
            tf.keras.layers.Dense(2, activation='sigmoid')  # [engagement, attention]
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        return model

    def load_history(self):
        """Load user engagement history"""
        try:
            if os.path.exists('data/engagement_history.json'):
                with open('data/engagement_history.json', 'r') as f:
                    self.user_history = json.load(f)
        except Exception as e:
            print(f"Error loading engagement history: {e}")

    def save_history(self):
        """Save user engagement history"""
        try:
            os.makedirs('data', exist_ok=True)
            with open('data/engagement_history.json', 'w') as f:
                json.dump(self.user_history, f)
        except Exception as e:
            print(f"Error saving engagement history: {e}")

    def extract_features(self, face_data: str) -> np.ndarray:
        """Extract features from face data for engagement prediction"""
        try:
            # Decode image
            image = self.face_recognition.decode_base64_image(face_data)
            
            # Get face landmarks
            landmarks = self.face_recognition.get_face_landmarks(image)
            if not landmarks:
                raise ValueError("No face landmarks detected")
            
            # Flatten landmarks into feature vector
            features = []
            for key, points in landmarks.items():
                for point in points:
                    features.extend(point)
            
            return np.array(features)
        except Exception as e:
            raise Exception(f"Feature extraction failed: {e}")

    async def predict(self, face_data: str, user_id: str, session_id: str) -> Dict[str, Any]:
        """Predict student engagement"""
        try:
            # Extract features
            features = self.extract_features(face_data)
            
            # Make prediction
            prediction = self.model.predict(np.array([features]))[0]
            engagement, attention = prediction
            
            # Update user history
            if user_id not in self.user_history:
                self.user_history[user_id] = {}
            
            if session_id not in self.user_history[user_id]:
                self.user_history[user_id][session_id] = []
            
            self.user_history[user_id][session_id].append({
                "timestamp": datetime.now().isoformat(),
                "engagement": float(engagement),
                "attention": float(attention)
            })
            
            # Save updated history
            self.save_history()
            
            return {
                "engagement": float(engagement),
                "attention": float(attention),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            raise Exception(f"Engagement prediction failed: {e}")

    def get_user_engagement_history(self, user_id: str, session_id: str) -> Dict[str, Any]:
        """Get engagement history for a user in a session"""
        return self.user_history.get(user_id, {}).get(session_id, [])

    def train_model(self, user_id: str, session_id: str, feedback: Dict[str, float]):
        """Update model with user feedback"""
        try:
            history = self.get_user_engagement_history(user_id, session_id)
            if not history:
                return
            
            # Prepare training data
            X = np.array([self.extract_features(entry["face_data"]) for entry in history])
            y = np.array([[feedback["engagement"], feedback["attention"]] for _ in history])
            
            # Train model
            self.model.fit(X, y, epochs=1, verbose=0)
            
            # Save model
            self.model.save('data/engagement_model')
        except Exception as e:
            print(f"Model training failed: {e}") 