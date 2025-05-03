import { AttendanceSession, AttendanceLog, User } from "../models/index.js";
import { createObjectCsvWriter } from 'csv-writer';
import { format } from 'date-fns';
import { AttendanceStats, StudentStats, PopulatedStudent } from "../types/index.js";
import { validateClassExists } from "./class_service.js";
import { NotFoundError, DatabaseError } from "../middlewares/index.js";

/**
 * Generates a statistical attendance report for a specific class.
 * 
 * @param classId - The ID of the class.
 * @param startDate - (Optional) The start date for filtering attendance sessions.
 * @param endDate - (Optional) The end date for filtering attendance sessions.
 * @returns An object containing attendance statistics for the class.
 * @throws NotFoundError - If the class does not exist.
 * @throws DatabaseError - If a database operation fails.
 */
export const generateClassAttendanceReport = async (classId: string, startDate?: Date, endDate?: Date): Promise<AttendanceStats> => {
    try {
        // Validate that the class exists
        const classExists = await validateClassExists(classId);
        if (!classExists) {
            throw new NotFoundError("Class not found");
        }

        // Build the query for attendance sessions
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

        // Return attendance statistics
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

/**
 * Generates a statistical attendance report for a specific student in a class.
 * 
 * @param studentId - The ID of the student.
 * @param classId - The ID of the class.
 * @returns An object containing attendance statistics for the student.
 * @throws NotFoundError - If the class does not exist.
 * @throws DatabaseError - If a database operation fails.
 */
export const generateStudentAttendanceReport = async (studentId: string, classId: string): Promise<StudentStats> => {
    try {
        // Validate that the class exists
        const classExists = await validateClassExists(classId);
        if (!classExists) {
            throw new NotFoundError("Class not found");
        }

        // Fetch attendance sessions and logs for the student
        const sessions = await AttendanceSession.find({ classId });
        const sessionIds = sessions.map(s => s._id);

        const logs = await AttendanceLog.find({
            studentId,
            sessionId: { $in: sessionIds }
        });

        // Count anomalies
        const anomalyCount = logs.filter(log => log.isAnomaly).length;

        // Return attendance statistics for the student
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

/**
 * Exports attendance logs for a class to a CSV file.
 * 
 * @param classId - The ID of the class.
 * @param startDate - (Optional) The start date for filtering attendance sessions.
 * @param endDate - (Optional) The end date for filtering attendance sessions.
 * @returns The file path of the generated CSV file.
 * @throws NotFoundError - If the class does not exist.
 * @throws DatabaseError - If a database operation fails.
 */
export const exportAttendanceToCSV = async (classId: string, startDate?: Date, endDate?: Date): Promise<string> => {
    try {
        // Validate that the class exists
        const classExists = await validateClassExists(classId);
        if (!classExists) {
            throw new NotFoundError("Class not found");
        }

        // Build the query for attendance sessions
        const query: any = { classId };
        if (startDate || endDate) {
            query.startTime = {};
            if (startDate) query.startTime.$gte = startDate;
            if (endDate) query.startTime.$lte = endDate;
        }

        // Fetch attendance sessions and logs
        const sessions = await AttendanceSession.find(query);
        const sessionIds = sessions.map(s => s._id);

        const logs = await AttendanceLog.find({
            sessionId: { $in: sessionIds }
        }).populate<{ studentId: PopulatedStudent }>('studentId', 'firstName lastName email');

        // Define the file path for the CSV
        const filePath = `attendance_report_${classId}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

        // Create a CSV writer
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

        // Map logs to CSV records
        const records = logs.map(log => ({
            sessionId: log.sessionId,
            studentName: `${log.studentId.firstName} ${log.studentId.lastName}`,
            studentEmail: log.studentId.email,
            checkInTime: format(log.checkedInAt, 'yyyy-MM-dd HH:mm:ss'),
            method: log.method,
            confidenceScore: log.confidenceScore,
            isAnomaly: log.isAnomaly ? 'Yes' : 'No'
        }));

        // Write records to the CSV file
        await csvWriter.writeRecords(records);
        return filePath;
    } catch (error) {
        throw new DatabaseError(`Failed to export attendance to CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};