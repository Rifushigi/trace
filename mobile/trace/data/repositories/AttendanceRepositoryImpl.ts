import { AttendanceRepository } from '@/domain/repositories/AttendanceRepository';
import { AttendanceRecord, AttendanceSession } from '@/domain/entities/Attendance';
import { AttendanceApi } from '@/data/datasources/remote/AttendanceApi';

export class AttendanceRepositoryImpl implements AttendanceRepository {
    constructor(private readonly attendanceApi: AttendanceApi) { }

    async getSession(id: string): Promise<AttendanceSession | null> {
        return this.attendanceApi.getSession(id);
    }

    async getSessions(classId: string): Promise<AttendanceSession[]> {
        return this.attendanceApi.getSessions(classId);
    }

    async createSession(data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>): Promise<AttendanceSession> {
        return this.attendanceApi.createSession(data);
    }

    async updateSession(id: string, data: Partial<AttendanceSession>): Promise<AttendanceSession> {
        return this.attendanceApi.updateSession(id, data);
    }

    async deleteSession(id: string): Promise<void> {
        return this.attendanceApi.deleteSession(id);
    }

    async addRecord(sessionId: string, record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendanceRecord> {
        return this.attendanceApi.addRecord(sessionId, record);
    }

    async updateRecord(sessionId: string, recordId: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
        return this.attendanceApi.updateRecord(sessionId, recordId, data);
    }

    async deleteRecord(sessionId: string, recordId: string): Promise<void> {
        return this.attendanceApi.deleteRecord(sessionId, recordId);
    }

    async getStudentAttendance(studentId: string, classId: string): Promise<AttendanceRecord[]> {
        return this.attendanceApi.getStudentAttendance(studentId, classId);
    }

    async getClassAttendance(classId: string, date: Date): Promise<AttendanceSession | null> {
        return this.attendanceApi.getClassAttendance(classId, date);
    }

    async searchSessions(query: string): Promise<AttendanceSession[]> {
        return this.attendanceApi.searchSessions(query);
    }

    async startAttendanceSession(classId: string): Promise<AttendanceSession> {
        return this.attendanceApi.startAttendanceSession(classId);
    }

    async endAttendanceSession(sessionId: string): Promise<AttendanceSession> {
        return this.attendanceApi.endAttendanceSession(sessionId);
    }

    async markAttendance(sessionId: string, studentId: string, method: AttendanceRecord['method']): Promise<AttendanceRecord> {
        return this.attendanceApi.markAttendance(sessionId, studentId, method);
    }
} 