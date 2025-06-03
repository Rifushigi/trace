import { AttendanceRepository } from '@/domain/repositories/AttendanceRepository';
import { AttendanceRecord, AttendanceSession } from '@/domain/entities/Attendance';
import { AttendanceApi } from '@/data/datasources/remote/AttendanceApi';
import { AppError, RepositoryError } from '@/shared/errors/AppError';

export class AttendanceRepositoryImpl implements AttendanceRepository {
    constructor(private readonly attendanceApi: AttendanceApi) { }

    async getSession(id: string): Promise<AttendanceSession | AppError> {
        try {
            return await this.attendanceApi.getSession(id);
        } catch (error) {
            throw new RepositoryError(
                'Error getting session',
                'AttendanceRepository',
                'getSession',
                error
            );
        }
    }

    async getSessions(classId: string): Promise<AttendanceSession[] | AppError> {
        try {
            return await this.attendanceApi.getSessions(classId);
        } catch (error) {
            throw new RepositoryError(
                'Error getting sessions',
                'AttendanceRepository',
                'getSessions',
                error
            );
        }
    }

    async createSession(data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>): Promise<AttendanceSession | AppError> {
        try {
            return await this.attendanceApi.createSession(data);
        } catch (error) {
            throw new RepositoryError(
                'Error creating session',
                'AttendanceRepository',
                'createSession',
                error
            );
        }
    }

    async updateSession(id: string, data: Partial<AttendanceSession>): Promise<AttendanceSession | AppError> {
        try {
            return await this.attendanceApi.updateSession(id, data);
        } catch (error) {
            throw new RepositoryError(
                'Error updating session',
                'AttendanceRepository',
                'updateSession',
                error
            );
        }
    }

    async deleteSession(id: string): Promise<void | AppError> {
        try {
            await this.attendanceApi.deleteSession(id);
        } catch (error) {
            throw new RepositoryError(
                'Error deleting session',
                'AttendanceRepository',
                'deleteSession',
                error
            );
        }
    }

    async addRecord(sessionId: string, record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendanceRecord | AppError> {
        try {
            return await this.attendanceApi.addRecord(sessionId, record);
        } catch (error) {
            throw new RepositoryError(
                'Error adding record',
                'AttendanceRepository',
                'addRecord',
                error
            );
        }
    }

    async updateRecord(sessionId: string, recordId: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord | AppError> {
        try {
            return await this.attendanceApi.updateRecord(sessionId, recordId, data);
        } catch (error) {
            throw new RepositoryError(
                'Error updating record',
                'AttendanceRepository',
                'updateRecord',
                error
            );
        }
    }

    async deleteRecord(sessionId: string, recordId: string): Promise<void | AppError> {
        try {
            await this.attendanceApi.deleteRecord(sessionId, recordId);
        } catch (error) {
            throw new RepositoryError(
                'Error deleting record',
                'AttendanceRepository',
                'deleteRecord',
                error
            );
        }
    }

    async getStudentAttendance(studentId: string, classId: string): Promise<AttendanceRecord[] | AppError> {
        try {
            return await this.attendanceApi.getStudentAttendance(studentId, classId);
        } catch (error) {
            throw new RepositoryError(
                'Error getting student attendance',
                'AttendanceRepository',
                'getStudentAttendance',
                error
            );
        }
    }

    async getClassAttendance(classId: string, date: Date): Promise<AttendanceSession | AppError> {
        try {
            return await this.attendanceApi.getClassAttendance(classId, date);
        } catch (error) {
            throw new RepositoryError(
                'Error getting class attendance',
                'AttendanceRepository',
                'getClassAttendance',
                error
            );
        }
    }

    async searchSessions(query: string): Promise<AttendanceSession[] | AppError> {
        try {
            return await this.attendanceApi.searchSessions(query);
        } catch (error) {
            throw new RepositoryError(
                'Error searching sessions',
                'AttendanceRepository',
                'searchSessions',
                error
            );
        }
    }

    async startAttendanceSession(classId: string): Promise<AttendanceSession | AppError> {
        try {
            return await this.attendanceApi.startAttendanceSession(classId);
        } catch (error) {
            throw new RepositoryError(
                'Error starting attendance session',
                'AttendanceRepository',
                'startAttendanceSession',
                error
            );
        }
    }

    async endAttendanceSession(sessionId: string): Promise<AttendanceSession | AppError> {
        try {
            return await this.attendanceApi.endAttendanceSession(sessionId);
        } catch (error) {
            throw new RepositoryError(
                'Error ending attendance session',
                'AttendanceRepository',
                'endAttendanceSession',
                error
            );
        }
    }

    async markAttendance(sessionId: string, studentId: string, method: AttendanceRecord['method']): Promise<AttendanceRecord | AppError> {
        try {
            return await this.attendanceApi.markAttendance(sessionId, studentId, method);
        } catch (error) {
            throw new RepositoryError(
                'Error marking attendance',
                'AttendanceRepository',
                'markAttendance',
                error
            );
        }
    }
} 