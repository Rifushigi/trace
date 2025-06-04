import { AttendanceMetrics } from '@/shared/types/attendance';

export const mockAttendanceMetrics: AttendanceMetrics = {
    totalStudents: 450,
    totalLecturers: 32,
    averageAttendanceRate: 88.5,
    totalClasses: 128,
    attendanceByProgram: [
        { program: 'Computer Science', attendanceRate: 92.3, totalStudents: 120 },
        { program: 'Electrical Engineering', attendanceRate: 87.8, totalStudents: 95 },
        { program: 'Mechanical Engineering', attendanceRate: 85.4, totalStudents: 88 },
        { program: 'Civil Engineering', attendanceRate: 89.1, totalStudents: 78 },
        { program: 'Chemical Engineering', attendanceRate: 86.9, totalStudents: 69 },
    ],
    attendanceByLevel: [
        { level: '100', attendanceRate: 84.2, totalStudents: 150 },
        { level: '200', attendanceRate: 87.5, totalStudents: 125 },
        { level: '300', attendanceRate: 89.8, totalStudents: 100 },
        { level: '400', attendanceRate: 92.4, totalStudents: 75 },
    ],
    recentAttendanceRates: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
        rate: 80 + Math.random() * 15,
    })),
};

// Helper function to get mock data
export const getMockAttendanceMetrics = () => {
    return mockAttendanceMetrics;
}; 