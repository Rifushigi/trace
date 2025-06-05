import { AttendanceSession, AttendanceRecord } from '../../domain/entities/Attendance';
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

const createMockClass = (index: number): Class => ({
    id: `${index + 1}`,
    code: `CSC${300 + index}`,
    name: ['Data Structures', 'Algorithms', 'Database Systems', 'Web Development', 'Mobile Development'][index % 5],
    schedule: {
        day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][index % 5],
        startTime: '09:00',
        endTime: '10:30',
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
        office: 'Room 301, Engineering Building',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    students: Array(30).fill(null).map((_, i) => createMockStudent(i)),
    createdAt: new Date(),
    updatedAt: new Date(),
});

const createMockAttendanceRecord = (student: Student, status: 'present' | 'absent' | 'late' = 'present'): AttendanceRecord => ({
    id: `record-${student.id}`,
    student,
    status,
    method: ['face', 'nfc', 'manual'][Math.floor(Math.random() * 3)] as 'face' | 'nfc' | 'manual',
    timestamp: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
});

const createMockAttendanceSession = (index: number): AttendanceSession => {
    const mockClass = createMockClass(index);
    const records = mockClass.students.map(student =>
        createMockAttendanceRecord(
            student,
            Math.random() > 0.8 ? 'absent' : Math.random() > 0.9 ? 'late' : 'present'
        )
    );

    return {
        id: `session-${index}`,
        class: mockClass,
        date: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
        startTime: new Date(new Date().setHours(9, 0, 0, 0)),
        endTime: new Date(new Date().setHours(10, 30, 0, 0)),
        status: 'completed',
        records,
        createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000)
    };
};

export const mockAttendanceSessions: AttendanceSession[] = Array(10)
    .fill(null)
    .map((_, index) => createMockAttendanceSession(index));

export const getMockAttendanceSessions = (classId?: string) => {
    if (classId) {
        return mockAttendanceSessions.filter(session => session.class.id === classId);
    }
    return mockAttendanceSessions;
};

export const getMockAttendanceSession = (sessionId: string) => {
    return mockAttendanceSessions.find(session => session.id === sessionId);
};

export const getMockClass = (classId: string) => {
    const session = mockAttendanceSessions.find(session => session.class.id === classId);
    return session?.class;
}; 