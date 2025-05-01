import { Server } from 'socket.io';
import { TAttendanceLog, TAttendanceSession } from '../types';
import {
    NotificationService,
    SessionStartNotification,
    SessionEndNotification,
    CheckInNotification,
    CheckInConfirmationNotification,
    AnomalyNotification
} from '../types';

class NotificationServiceImpl implements NotificationService {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    notifySessionStart(session: TAttendanceSession): void {
        const notification: SessionStartNotification = {
            sessionId: session._id.toString(),
            startTime: session.startTime
        };
        this.io.to(`class_${session.classId}`).emit('attendance:session_start', notification);
    }

    notifySessionEnd(session: TAttendanceSession): void {
        const notification: SessionEndNotification = {
            sessionId: session._id.toString(),
            endTime: session.endTime || new Date()
        };
        this.io.to(`class_${session.classId}`).emit('attendance:session_end', notification);
    }

    notifyCheckIn(log: TAttendanceLog): void {
        // Notify the class
        const classNotification: CheckInNotification = {
            studentId: log.studentId.toString(),
            method: log.method,
            checkedInAt: log.checkedInAt,
            isAnomaly: log.isAnomaly
        };
        this.io.to(`class_${log.sessionId}`).emit('attendance:check_in', classNotification);

        // Notify the student
        const studentNotification: CheckInConfirmationNotification = {
            sessionId: log.sessionId.toString(),
            method: log.method,
            checkedInAt: log.checkedInAt,
            confidenceScore: log.confidenceScore
        };
        this.io.to(`student_${log.studentId}`).emit('attendance:check_in_confirmation', studentNotification);
    }

    notifyAnomaly(log: TAttendanceLog): void {
        const notification: AnomalyNotification = {
            studentId: log.studentId.toString(),
            method: log.method,
            checkedInAt: log.checkedInAt,
            confidenceScore: log.confidenceScore
        };
        this.io.to(`class_${log.sessionId}`).emit('attendance:anomaly', notification);
    }

    handleConnection(socket: any): void {
        // Join class room
        socket.on('join:class', (classId: string) => {
            socket.join(`class_${classId}`);
        });

        // Join student room
        socket.on('join:student', (studentId: string) => {
            socket.join(`student_${studentId}`);
        });

        // Leave class room
        socket.on('leave:class', (classId: string) => {
            socket.leave(`class_${classId}`);
        });

        // Leave student room
        socket.on('leave:student', (studentId: string) => {
            socket.leave(`student_${studentId}`);
        });
    }
}

export const createNotificationService = (io: Server): NotificationService => {
    return new NotificationServiceImpl(io);
}; 