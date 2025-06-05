import { Class } from '../../domain/entities/Class';
import { Student } from '../../domain/entities/User';

const createMockStudent = (index: number): Student => ({
    id: `student-${index}`,
    firstName: `Student`,
    lastName: `${index}`,
    email: `student${index}@university.edu`,
    role: 'student',
    isVerified: Math.random() > 0.2,
    avatar: `https://i.pravatar.cc/150?img=${index + 10}`,
    matricNo: `STU${index.toString().padStart(3, '0')}`,
    program: 'Computer Science',
    level: '300',
    createdAt: new Date(),
    updatedAt: new Date(),
});

const createMockClass = (index: number): Class => {
    const courseNames = [
        'Data Structures & Algorithms',
        'Database Systems',
        'Web Development',
        'Mobile Development',
        'Software Engineering',
        'Computer Networks',
        'Operating Systems',
        'Artificial Intelligence',
        'Machine Learning',
        'Cloud Computing'
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
        { start: '08:00', end: '09:30' },
        { start: '10:00', end: '11:30' },
        { start: '12:00', end: '13:30' },
        { start: '14:00', end: '15:30' },
        { start: '16:00', end: '17:30' }
    ];

    const timeSlot = timeSlots[index % timeSlots.length];
    const day = days[index % days.length];

    return {
        id: `class-${index}`,
        code: `CSC${300 + index}`,
        name: courseNames[index % courseNames.length],
        schedule: {
            day,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            room: `Room ${100 + index}`
        },
        lecturer: {
            id: '1',
            firstName: 'Dr.',
            lastName: 'Smith',
            email: 'smith@university.edu',
            role: 'lecturer',
            avatar: 'https://i.pravatar.cc/150?img=2',
            staffId: 'LEC001',
            college: 'College of Engineering',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        students: Array(30).fill(null).map((_, i) => createMockStudent(i)),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

export const mockClasses: Class[] = Array(10)
    .fill(null)
    .map((_, index) => createMockClass(index));

export const getMockClasses = () => {
    return mockClasses;
};

export const getMockClass = (classId: string) => {
    return mockClasses.find(cls => cls.id === classId);
};

export const getMockClassStatistics = (classId: string) => {
    const mockClass = getMockClass(classId);
    if (!mockClass) return null;

    return {
        totalStudents: mockClass.students.length,
        totalSessions: Math.floor(Math.random() * 20) + 10,
        averageAttendance: Math.floor(Math.random() * 20) + 80,
        attendanceTrend: Array(7).fill(null).map((_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
            attendance: Math.floor(Math.random() * 20) + 80
        }))
    };
};