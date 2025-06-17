import { Class } from '../../domain/entities/Class';
import { Student, Lecturer } from '../../domain/entities/User';
import { getMockSchedule } from './scheduleMock';

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
        code: `CSC ${300 + index}`,
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
            office: 'Room 301, Engineering Building',
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

export interface ClassDetails {
    id: string;
    course: string;
    code: string;
    description: string;
    objectives: string[];
    prerequisites: string[];
    grading: {
        assignments: number;
        midterm: number;
        final: number;
        attendance: number;
    };
    lecturer: Lecturer & {
        office: string;
    };
    schedule: {
        day: string;
        startTime: string;
        endTime: string;
        room: string;
    };
    students: {
        id: string;
        firstName: string;
        lastName: string;
        matricNo: string;
        email: string;
        avatar?: string;
        attendance: {
            present: number;
            absent: number;
            late: number;
            rate: number;
        };
    }[];
    materials: {
        id: string;
        title: string;
        type: 'syllabus' | 'notes' | 'assignment' | 'other';
        url: string;
        uploadDate: Date;
    }[];
    announcements: {
        id: string;
        title: string;
        content: string;
        date: Date;
    }[];
}

export interface SessionDetails {
    id: string;
    classId: string;
    course: string;
    startTime: string;
    endTime?: string;
    status: 'active' | 'ended';
    attendance: {
        total: number;
        present: number;
        absent: number;
        late: number;
    };
    students: {
        id: string;
        firstName: string;
        lastName: string;
        matricNo: string;
        status: 'present' | 'absent' | 'late';
        checkInTime?: string;
        verificationMethod?: 'qr' | 'manual' | 'biometric';
    }[];
    activities: {
        id: string;
        type: 'check-in' | 'check-out' | 'manual-entry' | 'export';
        studentId?: string;
        studentName?: string;
        time: string;
        details?: string;
    }[];
}

let mockClassDetails: ClassDetails[] = [];
let mockSessions: SessionDetails[] = [];

export const getMockClassDetails = (): ClassDetails[] => {
    if (mockClassDetails.length === 0) {
        const schedule = getMockSchedule();
        mockClassDetails = schedule.map(cls => ({
            id: cls.id,
            course: cls.course,
            code: cls.code,
            description: `This course provides an introduction to ${cls.course}. Students will learn fundamental concepts and practical applications.`,
            objectives: [
                'Understand core concepts and principles',
                'Develop practical skills through hands-on exercises',
                'Apply knowledge to solve real-world problems',
                'Collaborate effectively in team projects'
            ],
            prerequisites: [
                'Basic programming knowledge',
                'Understanding of fundamental mathematics',
                'Familiarity with computer systems'
            ],
            grading: {
                assignments: 30,
                midterm: 20,
                final: 40,
                attendance: 10
            },
            lecturer: {
                id: 'L001',
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@university.edu',
                office: 'Room 301, Computer Science Building',
                avatar: 'https://i.pravatar.cc/150?img=1',
                role: 'lecturer',
                staffId: 'L001',
                college: 'Computer Science',
                isVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            schedule: cls.schedule,
            students: Array.from({ length: Math.floor(Math.random() * 20) + 30 }, (_, i) => ({
                id: `S${(i + 1).toString().padStart(3, '0')}`,
                firstName: ['James', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia'][Math.floor(Math.random() * 6)],
                lastName: ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia'][Math.floor(Math.random() * 6)],
                matricNo: `2023${(i + 1).toString().padStart(4, '0')}`,
                email: `student${i + 1}@university.edu`,
                avatar: `https://i.pravatar.cc/150?img=${i + 2}`,
                attendance: {
                    present: Math.floor(Math.random() * 10) + 5,
                    absent: Math.floor(Math.random() * 3),
                    late: Math.floor(Math.random() * 2),
                    rate: Math.floor(Math.random() * 20) + 80
                }
            })),
            materials: [
                {
                    id: 'M001',
                    title: 'Course Syllabus',
                    type: 'syllabus',
                    url: 'https://example.com/syllabus.pdf',
                    uploadDate: new Date(2024, 0, 1)
                },
                {
                    id: 'M002',
                    title: 'Week 1 Lecture Notes',
                    type: 'notes',
                    url: 'https://example.com/notes1.pdf',
                    uploadDate: new Date(2024, 0, 8)
                },
                {
                    id: 'M003',
                    title: 'Assignment 1',
                    type: 'assignment',
                    url: 'https://example.com/assignment1.pdf',
                    uploadDate: new Date(2024, 0, 15)
                }
            ],
            announcements: [
                {
                    id: 'A001',
                    title: 'Welcome to the Course',
                    content: 'Welcome to the new semester! Please review the course syllabus and join our online discussion forum.',
                    date: new Date(2024, 0, 1)
                },
                {
                    id: 'A002',
                    title: 'Assignment 1 Deadline Extended',
                    content: 'The deadline for Assignment 1 has been extended to next Friday. Please submit your work through the online portal.',
                    date: new Date(2024, 0, 20)
                }
            ]
        }));
    }
    return mockClassDetails;
};

export const getMockSessions = (): SessionDetails[] => {
    if (mockSessions.length === 0) {
        const classes = getMockClassDetails();
        mockSessions = classes.map(cls => ({
            id: `SESS${cls.id}`,
            classId: cls.id,
            course: cls.course,
            startTime: new Date().toISOString(),
            status: 'active',
            attendance: {
                total: cls.students.length,
                present: Math.floor(cls.students.length * 0.8),
                absent: Math.floor(cls.students.length * 0.1),
                late: Math.floor(cls.students.length * 0.1)
            },
            students: cls.students.map(student => ({
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                matricNo: student.matricNo,
                status: Math.random() > 0.2 ? 'present' : (Math.random() > 0.5 ? 'late' : 'absent'),
                checkInTime: Math.random() > 0.2 ? new Date().toISOString() : undefined,
                verificationMethod: Math.random() > 0.5 ? 'qr' : 'manual'
            })),
            activities: cls.students
                .filter(student => Math.random() > 0.2)
                .map(student => ({
                    id: `ACT${student.id}`,
                    type: 'check-in',
                    studentId: student.id,
                    studentName: `${student.firstName} ${student.lastName}`,
                    time: new Date().toISOString(),
                    details: 'Checked in via QR code'
                }))
        }));
    }
    return mockSessions;
};

export const getClassDetails = (classId: string): ClassDetails | undefined => {
    return getMockClassDetails().find(cls => cls.id === classId);
};

export const getSessionDetails = (sessionId: string): SessionDetails | undefined => {
    return getMockSessions().find(session => session.id === sessionId);
};

export const updateSessionStatus = (sessionId: string, status: 'active' | 'ended'): boolean => {
    const sessionIndex = mockSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
        mockSessions[sessionIndex] = {
            ...mockSessions[sessionIndex],
            status,
            endTime: status === 'ended' ? new Date().toISOString() : undefined
        };
        return true;
    }
    return false;
};

export const updateStudentAttendance = (
    sessionId: string,
    studentId: string,
    status: 'present' | 'absent' | 'late',
    verificationMethod: 'qr' | 'manual' | 'biometric'
): boolean => {
    const sessionIndex = mockSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
        const studentIndex = mockSessions[sessionIndex].students.findIndex(s => s.id === studentId);
        if (studentIndex !== -1) {
            mockSessions[sessionIndex].students[studentIndex] = {
                ...mockSessions[sessionIndex].students[studentIndex],
                status,
                checkInTime: new Date().toISOString(),
                verificationMethod
            };

            // Update attendance counts
            const attendance = mockSessions[sessionIndex].attendance;
            const oldStatus = mockSessions[sessionIndex].students[studentIndex].status;
            if (oldStatus === 'present') attendance.present--;
            else if (oldStatus === 'absent') attendance.absent--;
            else if (oldStatus === 'late') attendance.late--;

            if (status === 'present') attendance.present++;
            else if (status === 'absent') attendance.absent++;
            else if (status === 'late') attendance.late++;

            // Add activity
            mockSessions[sessionIndex].activities.push({
                id: `ACT${Date.now()}`,
                type: 'manual-entry',
                studentId,
                studentName: `${mockSessions[sessionIndex].students[studentIndex].firstName} ${mockSessions[sessionIndex].students[studentIndex].lastName}`,
                time: new Date().toISOString(),
                details: `Marked as ${status} via ${verificationMethod}`
            });

            return true;
        }
    }
    return false;
};