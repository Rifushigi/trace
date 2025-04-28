import { AttendanceSession, AttendanceLog, User } from "../models/index.js";
import { TAttendanceSession, TAttendanceLog } from "../types/index.js";
import { CreateSessionDTO, CheckInDTO } from "../types/attendance.js";
import { notifyAnomaly,notifyCheckIn,notifyLowAttendance, notifySessionStart,notifySessionEnd } from "./email_service.js";
import { createNotificationService } from "./notification_service.js";
import { NotFoundError, ConflictError, DatabaseError } from "../middlewares/error_handler.js";
import { Server } from "socket.io";
import { mlService } from "./ml_service.js";
import { validateClassExists } from "./class_service.js";

let notificationService: ReturnType<typeof createNotificationService>;

export const initializeAttendanceService = (io: Server) => {
    notificationService = createNotificationService(io);
};

const LOW_ATTENDANCE_THRESHOLD = 0.7; // 70%

export const createAttendanceSession = async (data: CreateSessionDTO): Promise<TAttendanceSession> => {
    try {
        // Validate class exists
        const classExists = await validateClassExists(data.classId);
        if (!classExists) {
            throw new NotFoundError("Class not found");
        }

        const session = await AttendanceSession.create({
            classId: data.classId,
            startTime: data.startTime || new Date(),
            status: "ongoing"
        });

        // Get lecturer email
        const lecturer = await User.findById(data.lecturerId);
        if (!lecturer) {
            throw new NotFoundError("Lecturer not found");
        }

        if (lecturer.email) {
            await notifySessionStart(session, lecturer.email);
        }

        notificationService.notifySessionStart(session);
        return session;
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to create attendance session: ${error.message}`);
        }
        throw error;
    }
};

export const endAttendanceSession = async (sessionId: string): Promise<TAttendanceSession> => {
    try {
        const session = await AttendanceSession.findByIdAndUpdate(
            sessionId,
            {
                endTime: new Date(),
                status: "completed"
            },
            { new: true }
        );

        if (!session) {
            throw new NotFoundError("Attendance session not found");
        }

        const lecturer = await User.findOne({ role: 'lecturer' });
        if (!lecturer) {
            throw new NotFoundError("Lecturer not found");
        }

        if (lecturer.email) {
            await notifySessionEnd(session, lecturer.email);
        }

        notificationService.notifySessionEnd(session);
        return session;
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to end attendance session: ${error.message}`);
        }
        throw error;
    }
};

export const checkIn = async (data: CheckInDTO): Promise<TAttendanceLog> => {
    try {
        const session = await AttendanceSession.findOne({
            _id: data.sessionId,
            status: "ongoing"
        });

        if (!session) {
            throw new NotFoundError("Invalid or completed attendance session");
        }

        const existingLog = await AttendanceLog.findOne({
            sessionId: data.sessionId,
            studentId: data.studentId
        });

        if (existingLog) {
            throw new ConflictError("Student has already checked in");
        }

        let confidenceScore = 1.0;
        let isAnomaly = false;

        if (data.method === "face" && data.biometricData) {
            const verificationResult = await mlService.verifyFace(data.biometricData, data.studentId);
            confidenceScore = verificationResult.confidence;
            isAnomaly = confidenceScore < 0.8;
        }

        const log = await AttendanceLog.create({
            sessionId: data.sessionId,
            studentId: data.studentId,
            checkedInAt: new Date(),
            method: data.method,
            confidenceScore,
            isAnomaly
        });

        const student = await User.findById(data.studentId);
        if (!student) {
            throw new NotFoundError("Student not found");
        }

        if (student.email) {
            await notifyCheckIn(log, student.email);
        }

        notificationService.notifyCheckIn(log);

        if (isAnomaly) {
            const lecturer = await User.findOne({ role: 'lecturer' });
            if (!lecturer) {
                throw new NotFoundError("Lecturer not found");
            }

            if (lecturer.email) {
                await notifyAnomaly(log, lecturer.email);
            }
            notificationService.notifyAnomaly(log);
        }

        const totalStudents = await User.countDocuments({ role: 'student' });
        const checkedInCount = await AttendanceLog.countDocuments({ sessionId: data.sessionId });
        const attendanceRate = checkedInCount / totalStudents;

        if (attendanceRate < LOW_ATTENDANCE_THRESHOLD) {
            const lecturer = await User.findOne({ role: 'lecturer' });
            if (lecturer?.email) {
                await notifyLowAttendance(session, lecturer.email, attendanceRate);
            }
        }

        return log;
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to process check-in: ${error.message}`);
        }
        throw error;
    }
};

export const getSessionAttendance = async (sessionId: string): Promise<{
    session: TAttendanceSession;
    logs: TAttendanceLog[];
}> => {
    try {
        const session = await AttendanceSession.findById(sessionId);
        if (!session) {
            throw new NotFoundError("Attendance session not found");
        }

        const logs = await AttendanceLog.find({ sessionId })
            .populate("studentId", "firstName lastName email");

        return { session, logs };
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to get session attendance: ${error.message}`);
        }
        throw error;
    }
};

export const getStudentAttendance = async (studentId: string, classId: string): Promise<{
    sessions: TAttendanceSession[];
    logs: TAttendanceLog[];
}> => {
    try {
        const sessions = await AttendanceSession.find({ classId });
        const sessionIds = sessions.map(s => s._id);

        const logs = await AttendanceLog.find({
            studentId,
            sessionId: { $in: sessionIds }
        });

        return { sessions, logs };
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to get student attendance: ${error.message}`);
        }
        throw error;
    }
}; 