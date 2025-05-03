import { Request, Response } from "express";
import { asyncErrorHandler } from "../middlewares/index.js";
import { TResponseDTO } from "../types/index.js";
import {
    generateClassAttendanceReport,
    generateStudentAttendanceReport,
    exportAttendanceToCSV
} from "../services/report_service.js";

export const getClassAttendanceReport = asyncErrorHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

    const report = await generateClassAttendanceReport(
        classId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
    );

    const response: TResponseDTO = {
        status: true,
        data: report,
        message: "Class attendance report generated successfully"
    };

    return res.status(200).json({ response });
});

export const getStudentAttendanceReport = asyncErrorHandler(async (req: Request, res: Response) => {
    const { studentId, classId } = req.params;
    const report = await generateStudentAttendanceReport(studentId, classId);

    const response: TResponseDTO = {
        status: true,
        data: report,
        message: "Student attendance report generated successfully"
    };

    return res.status(200).json({ response });
});

export const exportAttendanceReport = asyncErrorHandler(async (req: Request, res: Response) => {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

    const filePath = await exportAttendanceToCSV(
        classId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
    );

    const response: TResponseDTO = {
        status: true,
        data: { filePath },
        message: "Attendance report exported successfully"
    };

    return res.status(200).json({ response });
}); 