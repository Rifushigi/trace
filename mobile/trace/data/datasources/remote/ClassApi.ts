import { Class } from '../../../domain/entities/Class';
import { axiosInstance } from '../../../infrastructure/network/axiosInstance';

export class ClassApi {
    private readonly baseUrl = '/classes';

    async getClass(id: string): Promise<Class> {
        const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getClasses(): Promise<Class[]> {
        const response = await axiosInstance.get(this.baseUrl);
        return response.data;
    }

    async createClass(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class> {
        const response = await axiosInstance.post(this.baseUrl, data);
        return response.data;
    }

    async updateClass(id: string, data: Partial<Class>): Promise<Class> {
        const response = await axiosInstance.patch(`${this.baseUrl}/${id}`, data);
        return response.data;
    }

    async deleteClass(id: string): Promise<void> {
        await axiosInstance.delete(`${this.baseUrl}/${id}`);
    }

    async addStudent(classId: string, studentId: string): Promise<void> {
        await axiosInstance.post(`${this.baseUrl}/${classId}/students`, { studentId });
    }

    async removeStudent(classId: string, studentId: string): Promise<void> {
        await axiosInstance.delete(`${this.baseUrl}/${classId}/students/${studentId}`);
    }

    async getLecturerClasses(lecturerId: string): Promise<Class[]> {
        const response = await axiosInstance.get(`${this.baseUrl}/lecturer/${lecturerId}`);
        return response.data;
    }

    async getStudentClasses(studentId: string): Promise<Class[]> {
        const response = await axiosInstance.get(`${this.baseUrl}/student/${studentId}`);
        return response.data;
    }

    async searchClasses(query: string): Promise<Class[]> {
        const response = await axiosInstance.get(`${this.baseUrl}/search`, {
            params: { query }
        });
        return response.data;
    }
} 