import cv2
import numpy as np
import asyncio
import websockets
import json
import base64
from datetime import datetime
import os
from dotenv import load_dotenv
from services.face_recognition import FaceRecognitionService

load_dotenv()

# Initialize face recognition service
face_recognition = FaceRecognitionService()

# Test configuration
STREAM_ID = "test_stream"
LOCATION = "test_location"
SESSION_ID = "test_session"
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3000")


async def process_frame(frame):
    # Convert frame to RGB for face recognition
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Detect faces
    face_locations = face_recognition.detect_faces(rgb_frame)

    # Process each face
    for face_location in face_locations:
        # Draw rectangle around face
        top, right, bottom, left = face_location
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

        # Get face encoding
        face_encoding = face_recognition.get_face_encoding(rgb_frame, face_location)

        # Verify face
        result = face_recognition.verify_face(face_encoding)

        # Add text with verification result
        if result["match"]:
            text = f"Match: {result['user_id']} ({result['confidence']:.2f})"
            color = (0, 255, 0)  # Green for match
        else:
            text = "No Match"
            color = (0, 0, 255)  # Red for no match

        cv2.putText(
            frame, text, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2
        )

        # If face is verified, send check-in to backend
        if result["match"]:
            try:
                async with websockets.connect(f"{BACKEND_URL}/ws") as websocket:
                    await websocket.send(
                        json.dumps(
                            {
                                "type": "check_in",
                                "data": {
                                    "studentId": result["user_id"],
                                    "sessionId": SESSION_ID,
                                    "location": LOCATION,
                                    "confidence": result["confidence"],
                                    "timestamp": datetime.now().isoformat(),
                                },
                            }
                        )
                    )
            except Exception as e:
                print(f"Failed to send check-in: {e}")

    return frame


async def register_face(frame, user_id):
    # Convert frame to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Detect faces
    face_locations = face_recognition.detect_faces(rgb_frame)

    if not face_locations:
        print("No face detected in frame")
        return False

    # Get the first face
    face_location = face_locations[0]

    # Get face encoding
    face_encoding = face_recognition.get_face_encoding(rgb_frame, face_location)

    # Register face
    try:
        face_id = await face_recognition.register_face(face_encoding, user_id)
        print(f"Face registered successfully with ID: {face_id}")
        return True
    except Exception as e:
        print(f"Failed to register face: {e}")
        return False


async def main():
    # Open video capture (0 for default camera, or provide video file path)
    cap = cv2.VideoCapture(0)  # Change to your CCTV stream URL or camera index

    if not cap.isOpened():
        print("Error: Could not open video capture")
        return

    print("Press 'r' to register a new face")
    print("Press 'q' to quit")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame")
            break

        # Process frame
        processed_frame = await process_frame(frame)

        # Show the frame
        cv2.imshow("Face Recognition Test", processed_frame)

        # Handle key presses
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        elif key == ord("r"):
            user_id = input("Enter user ID for face registration: ")
            if user_id:
                await register_face(frame, user_id)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    asyncio.run(main())
