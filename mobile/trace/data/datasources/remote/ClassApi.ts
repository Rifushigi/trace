import { Class } from '@/domain/entities/Class';
import { axiosInstance } from '@/infrastructure/network/axiosInstance';
import { AppError } from '@/shared/errors/AppError';
import { handleError } from '@/shared/errors/errorHandler';

export class ClassApi {
    private readonly baseUrl = '/classes';

    async getClass(id: string): Promise<Class | AppError> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async getClasses(): Promise<Class[] | AppError> {
        try {
            const response = await axiosInstance.get(this.baseUrl);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class | AppError> {
        try {
            const response = await axiosInstance.post(this.baseUrl, data);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async updateClass(id: string, data: Partial<Class>): Promise<Class | AppError> {
        try {
            const response = await axiosInstance.patch(`${this.baseUrl}/${id}`, data);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async deleteClass(id: string): Promise<void | AppError> {
        try {
            await axiosInstance.delete(`${this.baseUrl}/${id}`);
        } catch (error) {
            return handleError(error);
        }
    }

    async addStudent(classId: string, studentId: string): Promise<void | AppError> {
        try {
            await axiosInstance.post(`${this.baseUrl}/${classId}/students`, { studentId });
        } catch (error) {
            return handleError(error);
        }
    }

    async removeStudent(classId: string, studentId: string): Promise<void | AppError> {
        try {
            await axiosInstance.delete(`${this.baseUrl}/${classId}/students/${studentId}`);
        } catch (error) {
            return handleError(error);
        }
    }

    async getLecturerClasses(lecturerId: string): Promise<Class[] | AppError> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/lecturer/${lecturerId}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async getStudentClasses(studentId: string): Promise<Class[] | AppError> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/student/${studentId}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }

    async searchClasses(query: string): Promise<Class[] | AppError> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/search`, {
                params: { query }
            });
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    }
} 