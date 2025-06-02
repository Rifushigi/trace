import { AttendanceRecord, AttendanceSession } from '@/domain/entities/Attendance';

export interface AttendanceRepository {
    getSession(id: string): Promise<AttendanceSession | null>;
    getSessions(classId: string): Promise<AttendanceSession[]>;
    createSession(data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>): Promise<AttendanceSession>;
    updateSession(id: string, data: Partial<AttendanceSession>): Promise<AttendanceSession>;
    deleteSession(id: string): Promise<void>;
    addRecord(sessionId: string, record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendanceRecord>;
    updateRecord(sessionId: string, recordId: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord>;
    deleteRecord(sessionId: string, recordId: string): Promise<void>;
    getStudentAttendance(studentId: string, classId: string): Promise<AttendanceRecord[]>;
    getClassAttendance(classId: string, date: Date): Promise<AttendanceSession | null>;
    searchSessions(query: string): Promise<AttendanceSession[]>;
    startAttendanceSession(classId: string): Promise<AttendanceSession>;
    endAttendanceSession(sessionId: string): Promise<AttendanceSession>;
    markAttendance(sessionId: string, studentId: string, method: AttendanceRecord['method']): Promise<AttendanceRecord>;
} 