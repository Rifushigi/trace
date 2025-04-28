import { TAttendanceLog, TAttendanceSession } from "./index.js";

export interface SessionStartNotification {
    sessionId: string;
    startTime: Date;
}

export interface SessionEndNotification {
    sessionId: string;
    endTime: Date;
}

export interface CheckInNotification {
    studentId: string;
    method: string;
    checkedInAt: Date;
    isAnomaly: boolean;
}

export interface CheckInConfirmationNotification {
    sessionId: string;
    method: string;
    checkedInAt: Date;
    confidenceScore: number;
}

export interface AnomalyNotification {
    studentId: string;
    method: string;
    checkedInAt: Date;
    confidenceScore: number;
}

export interface NotificationService {
    notifySessionStart(session: TAttendanceSession): void;
    notifySessionEnd(session: TAttendanceSession): void;
    notifyCheckIn(log: TAttendanceLog): void;
    notifyAnomaly(log: TAttendanceLog): void;
    handleConnection(socket: any): void;
} 