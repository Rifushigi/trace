import face_recognition
import numpy as np
import base64
import cv2
import os
from typing import Dict, Any
import json
from datetime import datetime

class FaceRecognitionService:
    def __init__(self):
        self.face_encodings = {}
        self.face_locations = {}
        self.known_face_encodings = []
        self.known_face_ids = []
        self.load_known_faces()

    def load_known_faces(self):
        """Load known face encodings from storage"""
        try:
            if os.path.exists('data/face_encodings.json'):
                with open('data/face_encodings.json', 'r') as f:
                    data = json.load(f)
                    self.face_encodings = data.get('encodings', {})
                    self.known_face_encodings = list(self.face_encodings.values())
                    self.known_face_ids = list(self.face_encodings.keys())
        except Exception as e:
            print(f"Error loading face encodings: {e}")

    def save_known_faces(self):
        """Save known face encodings to storage"""
        try:
            os.makedirs('data', exist_ok=True)
            with open('data/face_encodings.json', 'w') as f:
                json.dump({'encodings': self.face_encodings}, f)
        except Exception as e:
            print(f"Error saving face encodings: {e}")

    def decode_base64_image(self, base64_string: str) -> np.ndarray:
        """Decode base64 image to numpy array"""
        try:
            # Remove data URL prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            # Decode base64 string
            image_data = base64.b64decode(base64_string)
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        except Exception as e:
            raise ValueError(f"Invalid image data: {e}")

    async def register_face(self, face_data: str, user_id: str) -> str:
        """Register a new face"""
        try:
            # Decode image
            image = self.decode_base64_image(face_data)
            
            # Detect face
            face_locations = face_recognition.face_locations(image)
            if not face_locations:
                raise ValueError("No face detected in image")
            
            # Get face encoding
            face_encoding = face_recognition.face_encodings(image, face_locations)[0]
            
            # Store face encoding
            self.face_encodings[user_id] = face_encoding.tolist()
            self.known_face_encodings.append(face_encoding)
            self.known_face_ids.append(user_id)
            
            # Save to storage
            self.save_known_faces()
            
            return user_id
        except Exception as e:
            raise Exception(f"Face registration failed: {e}")

    def get_face_encoding(self, image: np.ndarray, face_location: tuple) -> np.ndarray:
        """Get face encoding for a specific face location in an image"""
        try:
            # Use face_recognition to get face encodings
            face_encodings = face_recognition.face_encodings(image, [face_location])
            if not face_encodings:
                raise ValueError("No face encoding found for the given face location")
            return face_encodings[0]
        except Exception as e:
            raise Exception(f"Failed to get face encoding: {e}")

    def detect_faces(self, image: np.ndarray) -> list:
        """Detect face locations in an image"""
        try:
            # Use face_recognition to detect face locations
            face_locations = face_recognition.face_locations(image)
            return face_locations
        except Exception as e:
            raise Exception(f"Failed to detect faces: {e}")

    async def verify_face(self, face_data: str, user_id: str) -> Dict[str, Any]:
        """Verify a face against registered faces"""
        try:
            # Decode image
            image = self.decode_base64_image(face_data)
            
            # Detect face
            face_locations = face_recognition.face_locations(image)
            if not face_locations:
                raise ValueError("No face detected in image")
            
            # Get face encoding
            face_encoding = face_recognition.face_encodings(image, face_locations)[0]
            
            # Compare with known faces
            if not self.known_face_encodings:
                return {
                    "match": False,
                    "confidence": 0.0,
                    "face_id": None
                }
            
            # Calculate face distances
            face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            best_match_distance = face_distances[best_match_index]
            
            # Convert distance to confidence (0-1)
            confidence = 1 - best_match_distance
            
            # Check if it's a match
            is_match = best_match_distance < 0.6 and self.known_face_ids[best_match_index] == user_id
            
            return {
                "match": is_match,
                "confidence": float(confidence),
                "face_id": self.known_face_ids[best_match_index] if is_match else None
            }
        except Exception as e:
            raise Exception(f"Face verification failed: {e}")

    def get_face_landmarks(self, image: np.ndarray) -> Dict[str, Any]:
        """Get facial landmarks"""
        try:
            face_landmarks_list = face_recognition.face_landmarks(image)
            if not face_landmarks_list:
                return {}
            return face_landmarks_list[0]
        except Exception as e:
            raise Exception(f"Failed to get face landmarks: {e}") 