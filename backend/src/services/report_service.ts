import { AttendanceSession, AttendanceLog, User } from "../models";
import { createObjectCsvWriter } from 'csv-writer';
import { format } from 'date-fns';
import { AttendanceStats, StudentStats, PopulatedStudent } from "../types";
import { validateClassExists } from "./class_service.js";
import { NotFoundError, DatabaseError } from "../middlewares/error_handler.js";

export const generateClassAttendanceReport = async (classId: string, startDate?: Date, endDate?: Date): Promise<AttendanceStats> => {
    try {
        // Validate class exists
        const classExists = await validateClassExists(classId);
        if (!classExists) {
            throw new NotFoundError("Class not found");
        }

        const query: any = { classId };
        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) query.startTime.$gte = startDate;
            if (endDate) query.startTime.$lte = endDate;
        }

        const sessions = await AttendanceSession.find(query);
        const sessionIds = sessions.map(s => s._id);

        const logs = await AttendanceLog.find({
            sessionId: { $in: sessionIds }
        });

        const methodBreakdown = {
            face: 0,
            nfc: 0,
            ble: 0,
            geofence: 0
        };

        logs.forEach(log => {
            methodBreakdown[log.method]++;
        });

        const anomalyCount = logs.filter(log => log.isAnomaly).length;

        return {
            totalSessions: sessions.length,
            totalStudents: await User.countDocuments({ role: 'student' }),
            averageAttendance: sessions.length > 0 ? logs.length / sessions.length : 0,
            attendanceByMethod: methodBreakdown,
            anomalies: anomalyCount
        };
    } catch (error) {
        throw new DatabaseError(`Failed to generate class attendance report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const generateStudentAttendanceReport = async (studentId: string, classId: string): Promise<StudentStats> => {
    try {
        // Validate class exists
        const classExists = await validateClassExists(classId);
        if (!classExists) {
            throw new NotFoundError("Class not found");
        }

        const sessions = await AttendanceSession.find({ classId });
        const sessionIds = sessions.map(s => s._id);

        const logs = await AttendanceLog.find({
            studentId,
            sessionId: { $in: sessionIds }
        });

        const anomalyCount = logs.filter(log => log.isAnomaly).length;

        return {
            studentId,
            totalSessions: sessions.length,
            attendedSessions: logs.length,
            attendanceRate: sessions.length > 0 ? logs.length / sessions.length : 0,
            anomalies: anomalyCount
        };
    } catch (error) {
        throw new DatabaseError(`Failed to generate student attendance report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const exportAttendanceToCSV = async (classId: string, startDate?: Date, endDate?: Date): Promise<string> => {
    try {
        // Validate class exists
        const classExists = await validateClassExists(classId);
        if (!classExists) {
            throw new NotFoundError("Class not found");
        }

        const query: any = { classId };
        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) query.startTime.$gte = startDate;
            if (endDate) query.startTime.$lte = endDate;
        }

        const sessions = await AttendanceSession.find(query);
        const sessionIds = sessions.map(s => s._id);

        const logs = await AttendanceLog.find({
            sessionId: { $in: sessionIds }
        }).populate<{ studentId: PopulatedStudent }>('studentId', 'firstName lastName email');

        const filePath = `attendance_report_${classId}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'sessionId', title: 'Session ID' },
                { id: 'studentName', title: 'Student Name' },
                { id: 'studentEmail', title: 'Student Email' },
                { id: 'checkInTime', title: 'Check-in Time' },
                { id: 'method', title: 'Check-in Method' },
                { id: 'confidenceScore', title: 'Confidence Score' },
                { id: 'isAnomaly', title: 'Anomaly Detected' }
            ]
        });

        const records = logs.map(log => ({
            sessionId: log.sessionId,
            studentName: `${log.studentId.firstName} ${log.studentId.lastName}`,
            studentEmail: log.studentId.email,
            checkInTime: format(log.checkedInAt, 'yyyy-MM-dd HH:mm:ss'),
            method: log.method,
            confidenceScore: log.confidenceScore,
            isAnomaly: log.isAnomaly ? 'Yes' : 'No'
        }));

        await csvWriter.writeRecords(records);
        return filePath;
    } catch (error) {
        throw new DatabaseError(`Failed to export attendance to CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}; 