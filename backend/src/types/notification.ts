import mongoose from "mongoose";
import { IAttendanceLog, IAttendanceSession } from "./index.js";

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
    notifySessionStart(session: IAttendanceSession): void;
    notifySessionEnd(session: IAttendanceSession): void;
    notifyCheckIn(log: IAttendanceLog): void;
    notifyAnomaly(log: IAttendanceLog): void;
    handleConnection(socket: any): void;
}


export interface INotificationPreferences {
    userId: mongoose.Types.ObjectId;
    email: {
        sessionStart: boolean;
        sessionEnd: boolean;
        checkIn: boolean;
        anomaly: boolean;
        lowAttendance: boolean;
    };
    push: {
        sessionStart: boolean;
        sessionEnd: boolean;
        checkIn: boolean;
        anomaly: boolean;
        lowAttendance: boolean;
    };
    updatedAt: Date;
}