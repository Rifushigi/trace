export interface CreateSessionDTO {
    classId: string;
    startTime?: Date;
    lecturerId: string;
}

export interface CheckInDTO {
    sessionId: string;
    studentId: string;
    method: "face" | "nfc" | "ble" | "geofence";
    biometricData?: string;
    deviceId?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

export interface AttendanceStats {
    totalSessions: number;
    totalStudents: number;
    averageAttendance: number;
    attendanceByMethod: {
        face: number;
        nfc: number;
        ble: number;
        geofence: number;
    };
    anomalies: number;
}

export interface StudentStats {
    studentId: string;
    totalSessions: number;
    attendedSessions: number;
    attendanceRate: number;
    anomalies: number;
    lastCheckIn?: Date;
} 

export interface PopulatedStudent {
    firstName: string;
    lastName: string;
    email: string;
}