# TRACE — Tracking Real-time Attendance & Class Engagement

**TRACE** is a smart, multimodal attendance management system designed for modern educational institutions. It combines biometric authentication, geofencing using BLE and machine learning to provide a secure, real-time, and adaptive platform for tracking student attendance and engagement.

---

## 🔧 Features

- 🔐 **Multimodal Authentication**: Facial recognition, NFC, BLE, and geofencing for verified presence.
- ⚡ **Real-time Attendance Logging**: Instant check-ins via IoT and edge devices.
- 🧠 **ML-Driven Insights**: Anomaly detection and student engagement prediction.
- 📡 **IoT Integration**: BLE beacon tracking and device-based geolocation.
- 📊 **Admin Dashboard (Web App)**: Metrics, alerts, user role management, and reporting.
- 📱 **Cross-Platform Mobile App**: Attendance check-in, logs, and notifications.
- 🔒 **Privacy-First**: GDPR-aligned design with user-controlled biometric data.

---

## 📦 Tech Stack

| Layer        | Technologies                                         |
|-------------|------------------------------------------------------|
| Frontend     | React Native (mobile)    |
| Backend      | Express.js (REST APIs), Python (ML services), Node.js (IoT bridge) |
| ML Models    | TensorFlow, scikit-learn, OpenCV                    |
| Storage      | PostgreSQL, MongoDB                                 |
| IoT Devices  | BLE Beacons                            |

---

## 📁 Project Structure

```text
.
├── mobile/              # React Native app for students and lecturers
├── web-dashboard/       # Admin dashboard built with Vue or React
├── backend/             # Express.js backend with RESTful APIs
├── ml-service/          # Python-based ML microservice
├── iot-bridge/          # Node.js service for BLE/NFC device interaction
├── docs/                # Design docs and API specs
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository
```bash
git clone https://github.com/your-org/trace.git
```

### Setup backend
```bash
cd backend
npm install
npm run dev
```

### Setup ML microservice
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

### Run the web dashboard
```bash
cd web-dashboard
npm install
npm run dev
```

### Run the Reac Native mobile app
```bash
cd mobile
npm i
npm run start
```

---

## 🧪 Testing

- Express.js: `npm run test`
- Python ML: `pytest`
- React Native: `npm run test`

---

## 🛡️ Privacy & Ethics

TRACE is designed with privacy-by-design principles. All biometric and location data are:
- Locally processed when possible
- Encrypted in storage and transit
- Removable by request

---

## ✍️ Authors

- Rifushigi — Lead Developer

---

> TRACE: Trust meets technology in attendance.
