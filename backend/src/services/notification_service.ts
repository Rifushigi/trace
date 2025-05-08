import { Server } from 'socket.io';
import {
    NotificationService,
    SessionStartNotification,
    SessionEndNotification,
    CheckInNotification,
    CheckInConfirmationNotification,
    AnomalyNotification,
    IAttendanceLog,
    IAttendanceSession
} from '../types/index.js';
import { fcmService } from './fcm_service.js';
import { User, AttendanceSession, Class } from '../models/index.js';
import { NotFoundError, SessionError } from "../middlewares/index.js";


// Implementation of the NotificationService interface
// Handles real-time notifications for attendance-related events
class NotificationServiceImpl implements NotificationService {
    private io: Server;
    private activeConnections: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

    constructor(io: Server) {
        this.io = io;
    }

    /**
     * Checks if a user has any active connections
     */
    private isUserActive(userId: string): boolean {
        return this.activeConnections.has(userId) && this.activeConnections.get(userId)!.size > 0;
    }

    /**
     * Sends a notification to all clients in the class when an attendance session starts.
     * 
     * @param session - The attendance session that has started.
     */
    async notifySessionStart(session: IAttendanceSession): Promise<void> {
        const notification: SessionStartNotification = {
            sessionId: session._id.toString(),
            startTime: session.startTime
        };

        // Get all students in the class
        const students = await User.find({ enrolledClasses: session.classId });
        const classData = await Class.findById(session.classId);

        if (!classData) {
            throw new NotFoundError("session data is missing");
        }

        // Send notifications to all students
        for (const student of students) {
            // Send FCM notification
            await fcmService.sendToUser(student._id.toString(), {
                title: 'Attendance Session Started',
                body: `An attendance session has started for ${classData.className}`,
                data: {
                    type: 'session_start',
                    sessionId: session._id.toString(),
                    classId: session.classId.toString(),
                }
            });

            // If student has active connection, also send Socket.IO notification
            if (this.isUserActive(student._id.toString())) {
                this.io.to(`student_${student._id}`).emit('attendance:session_start', notification);
            }
        }
    }

    /**
     * Sends a notification to all clients in the class when an attendance session ends.
     * 
     * @param session - The attendance session that has ended.
     */
    async notifySessionEnd(session: IAttendanceSession): Promise<void> {
        const notification: SessionEndNotification = {
            sessionId: session._id.toString(),
            endTime: session.endTime || new Date()
        };

        const classData = await Class.findById(session.classId);
        if (!classData) throw new NotFoundError("Class not found");

        // Send FCM notification to lecturer
        await fcmService.sendToUser(classData.lecturerId.toString(), {
            title: 'Attendance Session Ended',
            body: `The attendance session for ${classData.className} has ended`,
            data: {
                type: 'session_end',
                sessionId: session._id.toString(),
                classId: session.classId.toString(),
            }
        });

        // If lecturer has active connection, also send Socket.IO notification
        if (this.isUserActive(classData.lecturerId.toString())) {
            this.io.to(`class_${session.classId}`).emit('attendance:session_end', notification);
        }
    }

    /**
     * Sends notifications for a student's check-in.
     * 
     * @param log - The attendance log for the student's check-in.
     */
    async notifyCheckIn(log: IAttendanceLog): Promise<void> {
        const session = await AttendanceSession.findById(log.sessionId);
        if (!session) throw new SessionError("Session not found");

        const classData = await Class.findById(session.classId);
        if (!classData) throw new NotFoundError("Class not found");

        const studentId = log.studentId.toString();

        // Send FCM notification to student
        await fcmService.sendToUser(studentId, {
            title: 'Check-in Confirmed',
            body: 'Your attendance has been recorded',
            data: {
                type: 'check_in_confirmation',
                sessionId: log.sessionId.toString(),
                method: log.method,
                confidenceScore: log.confidenceScore.toString(),
            }
        });

        // Send FCM notification to lecturer
        await fcmService.sendToUser(classData.lecturerId.toString(), {
            title: 'Student Checked In',
            body: `A student has checked in for ${classData.className}`,
            data: {
                type: 'check_in',
                sessionId: log.sessionId.toString(),
                studentId: studentId,
                isAnomaly: log.isAnomaly.toString(),
            }
        });

        // If student has active connection, also send Socket.IO notification
        if (this.isUserActive(studentId)) {
            const studentNotification: CheckInConfirmationNotification = {
                sessionId: log.sessionId.toString(),
                method: log.method,
                checkedInAt: log.checkedInAt,
                confidenceScore: log.confidenceScore
            };
            this.io.to(`student_${studentId}`).emit('attendance:check_in_confirmation', studentNotification);
        }

        // If lecturer has active connection, also send Socket.IO notification
        if (this.isUserActive(classData.lecturerId.toString())) {
            const classNotification: CheckInNotification = {
                studentId: studentId,
                method: log.method,
                checkedInAt: log.checkedInAt,
                isAnomaly: log.isAnomaly
            };
            this.io.to(`class_${log.sessionId}`).emit('attendance:check_in', classNotification);
        }
    }

    /**
     * Sends a notification when an anomaly is detected during a student's check-in.
     * 
     * @param log - The attendance log for the student's check-in.
     */
    async notifyAnomaly(log: IAttendanceLog): Promise<void> {
        const session = await AttendanceSession.findById(log.sessionId);
        if (!session) throw new SessionError("Session not found");

        const classData = await Class.findById(session.classId);
        if (!classData) throw new NotFoundError("Class not found");

        // Send FCM notification to lecturer
        await fcmService.sendToUser(classData.lecturerId.toString(), {
            title: 'Anomaly Detected',
            body: 'An anomaly was detected during student check-in',
            data: {
                type: 'anomaly',
                sessionId: log.sessionId.toString(),
                studentId: log.studentId.toString(),
                confidenceScore: log.confidenceScore.toString(),
            }
        });

        // If lecturer has active connection, also send Socket.IO notification
        if (this.isUserActive(classData.lecturerId.toString())) {
            const notification: AnomalyNotification = {
                studentId: log.studentId.toString(),
                method: log.method,
                checkedInAt: log.checkedInAt,
                confidenceScore: log.confidenceScore
            };
            this.io.to(`class_${log.sessionId}`).emit('attendance:anomaly', notification);
        }
    }

    /**
     * Handles WebSocket connections and manages room subscriptions.
     * 
     * @param socket - The connected WebSocket client.
     */
    handleConnection(socket: any): void {
        let userId: string | null = null;

        // Track user's active connections
        socket.on('register:user', (id: string) => {
            userId = id;
            if (!this.activeConnections.has(id)) {
                this.activeConnections.set(id, new Set());
            }
            this.activeConnections.get(id)!.add(socket.id);
        });

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

        // Handle FCM token registration
        socket.on('register:fcm_token', async (data: { userId: string; token: string }) => {
            try {
                await fcmService.storeToken(data.userId, data.token);
            } catch (error) {
                console.error('Error registering FCM token:', error);
            }
        });

        // Handle FCM token removal
        socket.on('remove:fcm_token', async (userId: string) => {
            try {
                await fcmService.removeToken(userId);
            } catch (error) {
                console.error('Error removing FCM token:', error);
            }
        });

        // Clean up when socket disconnects
        socket.on('disconnect', () => {
            if (userId) {
                const userConnections = this.activeConnections.get(userId);
                if (userConnections) {
                    userConnections.delete(socket.id);
                    if (userConnections.size === 0) {
                        this.activeConnections.delete(userId);
                    }
                }
            }
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