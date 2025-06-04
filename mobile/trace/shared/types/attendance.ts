export interface AttendanceMetrics {
    totalStudents: number;
    totalLecturers: number;
    averageAttendanceRate: number;
    totalClasses: number;
    attendanceByProgram: {
        program: string;
        attendanceRate: number;
        totalStudents: number;
    }[];
    attendanceByLevel: {
        level: string;
        attendanceRate: number;
        totalStudents: number;
    }[];
    recentAttendanceRates: {
        date: Date;
        rate: number;
    }[];
}