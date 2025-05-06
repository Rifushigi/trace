export interface ICreateSessionDTO {
    classId: string;
    startTime?: Date;
    lecturerId: string;
}

export interface ICheckInDTO {
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

export interface IAttendanceStats {
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

export interface IStudentStats {
    studentId: string;
    totalSessions: number;
    attendedSessions: number;
    attendanceRate: number;
    anomalies: number;
    lastCheckIn?: Date;
}

export interface IPopulatedStudent {
    firstName: string;
    lastName: string;
    email: string;
}