import { AttendanceSession, AttendanceLog, User } from "../models/index.js";
import { IAttendanceSession, IAttendanceLog, ICreateSessionDTO, ICheckInDTO } from "../types/index.js";
import { notifyAnomaly, notifyCheckIn, notifyLowAttendance, notifySessionStart, notifySessionEnd } from "./email_service.js";
import { createNotificationService } from "./notification_service.js";
import { NotFoundError, ConflictError, DatabaseError, ValidationError } from "../middlewares/index.js";
import { Server } from "socket.io";
import { validateClassExists } from "./class_service.js";

let notificationService: ReturnType<typeof createNotificationService>;

export const initializeAttendanceService = (io: Server) => {
    notificationService = createNotificationService(io);
};

//TODO
// Move to env var
const LOW_ATTENDANCE_THRESHOLD = 0.7; // 70%
const MIN_CHECK_IN_INTERVAL = 60; // 60 seconds interval between check-ins
const MAX_CONFIDENCE_SCORE = 1.0;
const MIN_CONFIDENCE_SCORE = 0.0;

// Rate limiting map
const lastCheckInTimes: Map<string, Date> = new Map();

export const createAttendanceSession = async (data: ICreateSessionDTO): Promise<IAttendanceSession> => {
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

export const endAttendanceSession = async (sessionId: string): Promise<IAttendanceSession> => {
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

/** 
 * Handles the automatic check-in process for a student.
 * Validates the session, student, and rate limits before creating an attendance log.
 * Sends notifications if the check-in is anomalous-ish or successful.
 * 
 * @param data - The data required for the check-in process.
 * @param data.studentId - The ID of the student checking in.
 * @param data.sessionId - The ID of the attendance session.
 * @param data.location - The location of the student during check-in.
 * @param data.confidence - The confidence score of the check-in (e.g., for facial recognition).
 * @param data.timestamp - The timestamp of the check-in.
 * @returns The created attendance log.
 * @throws ValidationError - If required fields are missing or confidence score is invalid.
 * @throws ConflictError - If the check-in is too soon or the student has already checked in.
 * @throws NotFoundError - If the session or student is not found.
 * @throws DatabaseError - If a database operation fails. 
 * */
export const handleAutomaticCheckIn = async (data: {
    studentId: string;
    sessionId: string;
    location: string;
    confidence: number;
    timestamp: Date;
}): Promise<IAttendanceLog> => {
    try {
        // Validate input data
        if (!data.studentId || !data.sessionId || !data.location) {
            throw new ValidationError("Missing required fields");
        }

        if (data.confidence < MIN_CONFIDENCE_SCORE || data.confidence > MAX_CONFIDENCE_SCORE) {
            throw new ValidationError("Invalid confidence score");
        }

        // Check rate limiting
        const lastCheckIn = lastCheckInTimes.get(data.studentId);
        if (lastCheckIn) {
            const timeSinceLastCheckIn = (new Date().getTime() - lastCheckIn.getTime()) / 1000;
            if (timeSinceLastCheckIn < MIN_CHECK_IN_INTERVAL) {
                throw new ConflictError("Check-in too soon after last check-in");
            }
        }

        // Validate session
        const session = await AttendanceSession.findOne({
            _id: data.sessionId,
            status: "ongoing"
        });

        if (!session) {
            throw new NotFoundError("Invalid or completed attendance session");
        }

        // Check for existing check-in
        const existingLog = await AttendanceLog.findOne({
            sessionId: data.sessionId,
            studentId: data.studentId
        });

        if (existingLog) {
            throw new ConflictError("Student has already checked in");
        }

        // Validate student exists
        const student = await User.findById(data.studentId);
        if (!student) {
            throw new NotFoundError("Student not found");
        }

        // Determine if check-in is anomalous
        const isAnomaly = data.confidence < 0.8;

        // Create attendance log
        const log = await AttendanceLog.create({
            sessionId: data.sessionId,
            studentId: data.studentId,
            checkedInAt: data.timestamp,
            method: "face",
            confidenceScore: data.confidence,
            isAnomaly,
            location: data.location
        });

        // Update rate limiting
        lastCheckInTimes.set(data.studentId, new Date());

        // Handle notifications
        await handleCheckInNotifications(log, session);

        return log;
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to process automatic check-in: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Handles a manual check-in for a student.
 * Validates the session and ensures the student has not already checked in.
 * 
 * @param data - The data required for the check-in process.
 * @param data.sessionId - The ID of the attendance session.
 * @param data.studentId - The ID of the student checking in.
 * @param data.location - The location of the student during check-in.
 * @param data.method - The method used for check-in (manual, QR code).
 * @returns The created attendance log.
 * @throws NotFoundError - If the session or student is not found.
 * @throws ConflictError - If the student has already checked in.
 * @throws DatabaseError - If a database operation fails.
 */
export const checkIn = async (data: ICheckInDTO): Promise<IAttendanceLog> => {
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

        const log = await AttendanceLog.create({
            sessionId: data.sessionId,
            studentId: data.studentId,
            checkedInAt: new Date(),
            method: data.method,
            confidenceScore: 1.0,
            isAnomaly: false,
            location: data.location
        });

        await handleCheckInNotifications(log, session);
        return log;
    } catch (error) {
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to process check-in: ${error.message}`);
        }
        throw error;
    }
};

/**
 * Handles notifications related to a student's check-in.
 * Sends notifications to the student and lecturer based on the check-in status.
 * Also calculates the attendance rate and notifies the lecturer if it falls below the threshold.
 * 
 * @param log - The attendance log for the student's check-in.
 * @param session - The attendance session associated with the check-in.
 * @throws NotFoundError - If the student or lecturer is not found.
 * @throws DatabaseError - If a database operation fails.
 */
async function handleCheckInNotifications(log: IAttendanceLog, session: IAttendanceSession): Promise<void> {
    const student = await User.findById(log.studentId);
    if (!student) {
        throw new NotFoundError("Student not found");
    }

    if (student.email) {
        await notifyCheckIn(log, student.email);
    }

    notificationService.notifyCheckIn(log);

    if (log.isAnomaly) {
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
    const checkedInCount = await AttendanceLog.countDocuments({ sessionId: session._id });
    const attendanceRate = checkedInCount / totalStudents;

    if (attendanceRate < LOW_ATTENDANCE_THRESHOLD) {
        const lecturer = await User.findOne({ role: 'lecturer' });
        if (lecturer?.email) {
            await notifyLowAttendance(session, lecturer.email, attendanceRate);
        }
    }
}

export const getSessionAttendance = async (sessionId: string): Promise<{
    session: IAttendanceSession;
    logs: IAttendanceLog[];
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
    sessions: IAttendanceSession[];
    logs: IAttendanceLog[];
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