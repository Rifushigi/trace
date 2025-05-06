# Trace Mobile App API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Attendance](#attendance)
3. [Classes](#classes)
4. [Users](#users)
5. [Reports](#reports)

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "rememberMe": boolean
}
```

**Response**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string",
    "name": "string"
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer {token}
```

## Attendance

### Start Session
```http
POST /api/attendance/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "classId": "string",
  "startTime": "string",
  "endTime": "string",
  "location": {
    "latitude": number,
    "longitude": number,
    "radius": number
  }
}
```

### End Session
```http
PUT /api/attendance/sessions/{sessionId}/end
Authorization: Bearer {token}
```

### Check In
```http
POST /api/attendance/check-in
Authorization: Bearer {token}
Content-Type: application/json

{
  "sessionId": "string",
  "studentId": "string",
  "location": {
    "latitude": number,
    "longitude": number
  }
}
```

### Manual Check In
```http
POST /api/attendance/manual-check-in
Authorization: Bearer {token}
Content-Type: application/json

{
  "sessionId": "string",
  "studentId": "string",
  "reason": "string"
}
```

## Classes

### Get Classes
```http
GET /api/classes
Authorization: Bearer {token}
```

**Query Parameters**
- `semester`: string
- `status`: string (active/archived)

### Get Class Details
```http
GET /api/classes/{classId}
Authorization: Bearer {token}
```

### Get Class Schedule
```http
GET /api/classes/{classId}/schedule
Authorization: Bearer {token}
```

## Users

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "avatar": "string"
}
```

### Get Students
```http
GET /api/users/students
Authorization: Bearer {token}
```

**Query Parameters**
- `classId`: string
- `search`: string
- `page`: number
- `limit`: number

## Reports

### Get Attendance Report
```http
GET /api/reports/attendance
Authorization: Bearer {token}
```

**Query Parameters**
- `classId`: string
- `startDate`: string
- `endDate`: string
- `format`: string (pdf/excel)

### Get Student Report
```http
GET /api/reports/student/{studentId}
Authorization: Bearer {token}
```

**Query Parameters**
- `startDate`: string
- `endDate`: string
- `format`: string (pdf/excel)

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": object
  }
}
```

### Common Error Codes
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `ATT_001`: Session not found
- `ATT_002`: Invalid check-in location
- `ATT_003`: Session already ended
- `CLS_001`: Class not found
- `USR_001`: User not found
- `REP_001`: Invalid date range

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## WebSocket Events

### Session Events
```json
{
  "type": "SESSION_STARTED",
  "data": {
    "sessionId": "string",
    "classId": "string",
    "startTime": "string"
  }
}
```

### Check-in Events
```json
{
  "type": "CHECK_IN",
  "data": {
    "sessionId": "string",
    "studentId": "string",
    "timestamp": "string"
  }
}
```

## Data Models

### Session
```typescript
interface Session {
  id: string;
  classId: string;
  startTime: string;
  endTime: string | null;
  status: 'ACTIVE' | 'ENDED';
  location: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  attendance: {
    present: number;
    absent: number;
    total: number;
  };
}
```

### CheckIn
```typescript
interface CheckIn {
  id: string;
  sessionId: string;
  studentId: string;
  timestamp: string;
  type: 'AUTOMATIC' | 'MANUAL';
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'PRESENT' | 'ABSENT';
}
```

### Class
```typescript
interface Class {
  id: string;
  name: string;
  code: string;
  semester: string;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }[];
  students: {
    id: string;
    name: string;
    email: string;
  }[];
  lecturer: {
    id: string;
    name: string;
    email: string;
  };
}
``` 