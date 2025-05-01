import { Request, Response } from "express";
import { asyncErrorHandler } from "../middlewares";
import { TResponseDTO, AuthenticatedRequest } from "../types";
import {
    createAttendanceSession,
    endAttendanceSession,
    checkIn,
    getSessionAttendance,
    getStudentAttendance,
    handleAutomaticCheckIn
} from "../services/attendance_service.js";

export const startSession = asyncErrorHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { classId, startTime } = req.body;
    const lecturerId = req.user.id;
    const session = await createAttendanceSession({ classId, startTime, lecturerId });

    const response: TResponseDTO = {
        status: true,
        data: session,
        message: "Attendance session started successfully"
    };

    return res.status(201).json({ response });
});

export const endSession = asyncErrorHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const session = await endAttendanceSession(sessionId);

    const response: TResponseDTO = {
        status: true,
        data: session,
        message: "Attendance session ended successfully"
    };

    return res.status(200).json({ response });
});

export const studentCheckIn = asyncErrorHandler(async (req: Request, res: Response) => {
    const { sessionId, studentId, method, biometricData, deviceId, location } = req.body;
    const log = await checkIn({
        sessionId,
        studentId,
        method,
        biometricData,
        deviceId,
        location
    });

    const response: TResponseDTO = {
        status: true,
        data: log,
        message: "Check-in successful"
    };

    return res.status(201).json({ response });
});

export const getAttendance = asyncErrorHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { session, logs } = await getSessionAttendance(sessionId);

    const response: TResponseDTO = {
        status: true,
        data: { session, logs },
        message: "Attendance data retrieved successfully"
    };

    return res.status(200).json({ response });
});

export const getStudentAttendanceHistory = asyncErrorHandler(async (req: Request, res: Response) => {
    const { studentId, classId } = req.params;
    const { sessions, logs } = await getStudentAttendance(studentId, classId);

    const response: TResponseDTO = {
        status: true,
        data: { sessions, logs },
        message: "Student attendance history retrieved successfully"
    };

    return res.status(200).json({ response });
});

// Automatic check-in endpoint (used by ML Service)
export const automaticCheckIn = asyncErrorHandler(async (req: Request, res: Response) => {
        const { studentId, sessionId, location, confidence, timestamp } = req.body;

        const log = await handleAutomaticCheckIn({
            studentId,
            sessionId,
            location,
            confidence,
            timestamp: new Date(timestamp)
        });

        const response: TResponseDTO = {
            status: true,
            data: {
                log,
                message: log.isAnomaly ? "Check-in recorded with anomaly flag" : "Check-in recorded successfully"
            },
            message: "Automatic check-in processed successfully"
        };

        return res.status(201).json({ response });
}); 