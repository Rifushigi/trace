import { axiosInstance } from '@/infrastructure/network/axiosInstance';
import { AttendanceRecord, AttendanceSession } from '@/domain/entities/Attendance';
import { handleError } from '@/shared/errors/errorHandler';
import { AppError } from '@/shared/errors/AppError';

export class AttendanceApi {
    readonly BASE_URL = '/attendance';
    async getSession(id: string): Promise<AttendanceSession | AppError> {
        try {
            const response = await axiosInstance.get(`${this.BASE_URL}/sessions/${id}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async getSessions(classId: string): Promise<AttendanceSession[] | AppError> {
        try {
            const response = await axiosInstance.get(`${this.BASE_URL}/sessions`, {
                params: { classId }
            });
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async createSession(data: Omit<AttendanceSession, 'id' | 'records' | 'createdAt' | 'updatedAt'>): Promise<AttendanceSession | AppError> {
        try {
            const response = await axiosInstance.post(`${this.BASE_URL}/sessions`, data);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async updateSession(id: string, data: Partial<AttendanceSession>): Promise<AttendanceSession | AppError> {
        try {
            const response = await axiosInstance.put(`${this.BASE_URL}/sessions/${id}`, data);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async deleteSession(id: string): Promise<void> {
        await axiosInstance.delete(`${this.BASE_URL}/sessions/${id}`);
    }

    async addRecord(sessionId: string, record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendanceRecord | AppError> {
        try {
            const response = await axiosInstance.post(`${this.BASE_URL}/sessions/${sessionId}/records`, record);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async updateRecord(sessionId: string, recordId: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord | AppError> {
        try {
            const response = await axiosInstance.put(`${this.BASE_URL}/sessions/${sessionId}/records/${recordId}`, data);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async deleteRecord(sessionId: string, recordId: string): Promise<void | AppError> {
        try {
            await axiosInstance.delete(`${this.BASE_URL}/sessions/${sessionId}/records/${recordId}`);
        } catch (error) {
            return handleError(error);
        }
    }

    async getStudentAttendance(studentId: string, classId: string): Promise<AttendanceRecord[] | AppError> {
        try {
            const response = await axiosInstance.get(`${this.BASE_URL}/students/${studentId}/classes/${classId}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async getClassAttendance(classId: string, date: Date): Promise<AttendanceSession | AppError> {
        try {
            const response = await axiosInstance.get(`${this.BASE_URL}/classes/${classId}`, {
                params: { date: date.toISOString() }
            });
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async searchSessions(query: string): Promise<AttendanceSession[] | AppError> {
        try {
            const response = await axiosInstance.get(`${this.BASE_URL}/sessions/search`, {
                params: { query }
            });
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async startAttendanceSession(classId: string): Promise<AttendanceSession | AppError> {
        try {
            const response = await axiosInstance.post(`${this.BASE_URL}/sessions/start`, { classId });
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async endAttendanceSession(sessionId: string): Promise<AttendanceSession | AppError> {
        try {
            const response = await axiosInstance.post(`${this.BASE_URL}/sessions/${sessionId}/end`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async markAttendance(sessionId: string, studentId: string, method: AttendanceRecord['method']): Promise<AttendanceRecord | AppError> {
        try {
            const response = await axiosInstance.post(`${this.BASE_URL}/sessions/${sessionId}/mark`, {
                studentId,
                method
            });
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }
} 