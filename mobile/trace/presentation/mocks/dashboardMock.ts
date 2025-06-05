import { Student } from '../../domain/entities/User';
import { AttendanceSession, AttendanceRecord } from '../../domain/entities/Attendance';
import { Class } from '../../domain/entities/Class';

export const mockStudent: Student = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?img=1',
    matricNo: 'STU001',
    program: 'Computer Science',
    level: '300',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockClasses: Class[] = [
    {
        id: '1',
        code: 'CSC301',
        name: 'Data Structures & Algorithms',
        schedule: {
            day: 'Monday',
            startTime: '09:00',
            endTime: '10:30',
            room: 'Room 101'
        },
        lecturer: {
            id: '1',
            firstName: 'Dr.',
            lastName: 'Smith',
            email: 'smith@example.com',
            role: 'lecturer',
            avatar: 'https://i.pravatar.cc/150?img=2',
            staffId: 'LEC001',
            college: 'College of Engineering',
            office: 'Room 301, Engineering Building',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        students: Array(30).fill(null).map((_, index) => ({
            id: `student-${index}`,
            firstName: `Student`,
            lastName: `${index}`,
            email: `student${index}@example.com`,
            role: 'student',
            avatar: `https://i.pravatar.cc/150?img=${index + 10}`,
            matricNo: `STU${index.toString().padStart(3, '0')}`,
            program: 'Computer Science',
            level: '300',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        code: 'CSC302',
        name: 'Advanced Algorithms',
        schedule: {
            day: 'Thursday',
            startTime: '11:00',
            endTime: '12:30',
            room: 'Room 202'
        },
        lecturer: {
            id: '2',
            firstName: 'Prof.',
            lastName: 'Johnson',
            email: 'johnson@example.com',
            role: 'lecturer',
            avatar: 'https://i.pravatar.cc/150?img=3',
            staffId: 'LEC002',
            college: 'College of Engineering',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        students: Array(30).fill(null).map((_, index) => ({
            id: `student-${index}`,
            firstName: `Student`,
            lastName: `${index}`,
            email: `student${index}@example.com`,
            role: 'student',
            avatar: `https://i.pravatar.cc/150?img=${index + 10}`,
            matricNo: `STU${index.toString().padStart(3, '0')}`,
            program: 'Computer Science',
            level: '300',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        code: 'CSC303',
        name: 'Database Systems',
        schedule: {
            day: 'Tuesday',
            startTime: '14:00',
            endTime: '15:30',
            room: 'Room 303'
        },
        lecturer: {
            id: '3',
            firstName: 'Dr.',
            lastName: 'Williams',
            email: 'williams@example.com',
            role: 'lecturer',
            avatar: 'https://i.pravatar.cc/150?img=4',
            staffId: 'LEC003',
            college: 'College of Engineering',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        students: Array(30).fill(null).map((_, index) => ({
            id: `student-${index}`,
            firstName: `Student`,
            lastName: `${index}`,
            email: `student${index}@example.com`,
            role: 'student',
            avatar: `https://i.pravatar.cc/150?img=${index + 10}`,
            matricNo: `STU${index.toString().padStart(3, '0')}`,
            program: 'Computer Science',
            level: '300',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

const createMockAttendanceRecord = (index: number): AttendanceRecord => ({
    id: `record-${index}`,
    student: {
        id: `student-${index}`,
        firstName: `Student`,
        lastName: `${index}`,
        email: `student${index}@example.com`,
        role: 'student',
        avatar: `https://i.pravatar.cc/150?img=${index + 10}`,
        matricNo: `STU${index.toString().padStart(3, '0')}`,
        program: 'Computer Science',
        level: '300',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    status: 'present',
    method: 'face',
    timestamp: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
});

export const mockAttendanceSessions: AttendanceSession[] = [
    {
        id: '1',
        class: mockClasses[0],
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        endTime: new Date(new Date().setHours(10, 30, 0, 0)),
        status: 'completed',
        records: Array(25).fill(null).map((_, index) => createMockAttendanceRecord(index)),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
        id: '2',
        class: mockClasses[1],
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        startTime: new Date(new Date().setHours(11, 0, 0, 0)),
        endTime: new Date(new Date().setHours(12, 30, 0, 0)),
        status: 'completed',
        records: Array(28).fill(null).map((_, index) => createMockAttendanceRecord(index)),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
        id: '3',
        class: mockClasses[2],
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        startTime: new Date(new Date().setHours(14, 0, 0, 0)),
        endTime: new Date(new Date().setHours(15, 30, 0, 0)),
        status: 'completed',
        records: Array(22).fill(null).map((_, index) => createMockAttendanceRecord(index)),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
];

// Helper function to get mock data based on current day
export const getMockDataForToday = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return {
        classes: mockClasses.filter(cls => cls.schedule?.day === today),
        sessions: mockAttendanceSessions,
        student: mockStudent
    };
}; 