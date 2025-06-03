import { AttendanceRecord, AttendanceSession } from '@/domain/entities/Attendance';
import { AppError } from '@/shared/errors/AppError';

export interface AttendanceRepository {
    getSession(id: string): Promise<AttendanceSession | AppError>;
    getSessions(classId: string): Promise<AttendanceSession[] | AppError>;
    createSession(data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>): Promise<AttendanceSession | AppError>;
    updateSession(id: string, data: Partial<AttendanceSession>): Promise<AttendanceSession | AppError>;
    deleteSession(id: string): Promise<void | AppError>;
    addRecord(sessionId: string, record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendanceRecord | AppError>;
    updateRecord(sessionId: string, recordId: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord | AppError>;
    deleteRecord(sessionId: string, recordId: string): Promise<void | AppError>;
    getStudentAttendance(studentId: string, classId: string): Promise<AttendanceRecord[] | AppError>;
    getClassAttendance(classId: string, date: Date): Promise<AttendanceSession | AppError>;
    searchSessions(query: string): Promise<AttendanceSession[] | AppError>;
    startAttendanceSession(classId: string): Promise<AttendanceSession | AppError>;
    endAttendanceSession(sessionId: string): Promise<AttendanceSession | AppError>;
    markAttendance(sessionId: string, studentId: string, method: AttendanceRecord['method']): Promise<AttendanceRecord | AppError>;
} 