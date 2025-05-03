import { Server } from 'socket.io';
import {
    NotificationService,
    SessionStartNotification,
    SessionEndNotification,
    CheckInNotification,
    CheckInConfirmationNotification,
    AnomalyNotification,
    TAttendanceLog,
    TAttendanceSession
} from '../types/index.js';

// Implementation of the NotificationService interface
// Handles real-time notifications for attendance-related events
class NotificationServiceImpl implements NotificationService {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    /**
     * Sends a notification to all clients in the class when an attendance session starts.
     * 
     * @param session - The attendance session that has started.
     */
    notifySessionStart(session: TAttendanceSession): void {
        const notification: SessionStartNotification = {
            sessionId: session._id.toString(),
            startTime: session.startTime
        };
        // Emit the session start notification to the class room
        this.io.to(`class_${session.classId}`).emit('attendance:session_start', notification);
    }

    /**
     * Sends a notification to all clients in the class when an attendance session ends.
     * 
     * @param session - The attendance session that has ended.
     */
    notifySessionEnd(session: TAttendanceSession): void {
        const notification: SessionEndNotification = {
            sessionId: session._id.toString(),
            endTime: session.endTime || new Date()
        };
        // Emit the session end notification to the class room
        this.io.to(`class_${session.classId}`).emit('attendance:session_end', notification);
    }

    /**
     * Sends notifications for a student's check-in.
     * 
     * @param log - The attendance log for the student's check-in.
     */
    notifyCheckIn(log: TAttendanceLog): void {
        // Notify the class about the student's check-in
        const classNotification: CheckInNotification = {
            studentId: log.studentId.toString(),
            method: log.method,
            checkedInAt: log.checkedInAt,
            isAnomaly: log.isAnomaly
        };
        this.io.to(`class_${log.sessionId}`).emit('attendance:check_in', classNotification);

        // Notify the student about their check-in confirmation
        const studentNotification: CheckInConfirmationNotification = {
            sessionId: log.sessionId.toString(),
            method: log.method,
            checkedInAt: log.checkedInAt,
            confidenceScore: log.confidenceScore
        };
        this.io.to(`student_${log.studentId}`).emit('attendance:check_in_confirmation', studentNotification);
    }

    /**
     * Sends a notification when an anomaly is detected during a student's check-in.
     * 
     * @param log - The attendance log for the student's check-in.
     */
    notifyAnomaly(log: TAttendanceLog): void {
        const notification: AnomalyNotification = {
            studentId: log.studentId.toString(),
            method: log.method,
            checkedInAt: log.checkedInAt,
            confidenceScore: log.confidenceScore
        };
        // Emit the anomaly notification to the class room
        this.io.to(`class_${log.sessionId}`).emit('attendance:anomaly', notification);
    }

    /**
     * Handles WebSocket connections and manages room subscriptions.
     * 
     * @param socket - The connected WebSocket client.
     */
    handleConnection(socket: any): void {
        // Join a class room to receive notifications for that class
        socket.on('join:class', (classId: string) => {
            socket.join(`class_${classId}`);
        });

        // Join a student room to receive notifications specific to the student
        socket.on('join:student', (studentId: string) => {
            socket.join(`student_${studentId}`);
        });

        // Leave a class room
        socket.on('leave:class', (classId: string) => {
            socket.leave(`class_${classId}`);
        });

        // Leave a student room
        socket.on('leave:student', (studentId: string) => {
            socket.leave(`student_${studentId}`);
        });
    }
}

/**
 * Factory function to create an instance of the NotificationService.
 * 
 * @param io - The Socket.IO server instance.
 * @returns An instance of NotificationServiceImpl.
 */
export const createNotificationService = (io: Server): NotificationService => {
    return new NotificationServiceImpl(io);
};