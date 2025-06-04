import { User, Student, Lecturer } from '../../domain/entities/User';

const createMockStudent = (index: number): Student => ({
    id: `student-${index}`,
    firstName: `Student`,
    lastName: `${index}`,
    email: `student${index}@university.edu`,
    role: 'student',
    isVerified: Math.random() > 0.2, // 80% verified
    avatar: `https://i.pravatar.cc/150?img=${index + 10}`,
    matricNo: `STU${index.toString().padStart(3, '0')}`,
    program: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'][Math.floor(Math.random() * 4)],
    level: ['100', '200', '300', '400', '500'][Math.floor(Math.random() * 5)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    attendanceStats: {
        totalClasses: Math.floor(Math.random() * 50) + 30,
        attendedClasses: Math.floor(Math.random() * 45) + 25,
        attendanceRate: Math.floor(Math.random() * 20) + 80,
        lastAttendance: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
    }
});

const createMockLecturer = (index: number): Lecturer => ({
    id: `lecturer-${index}`,
    firstName: `Professor`,
    lastName: `${index}`,
    email: `professor${index}@university.edu`,
    role: 'lecturer',
    isVerified: Math.random() > 0.1, // 90% verified
    avatar: `https://i.pravatar.cc/150?img=${index + 20}`,
    staffId: `LEC${index.toString().padStart(3, '0')}`,
    college: ['College of Engineering', 'College of Science', 'College of Arts', 'College of Business'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000), // Up to 2 years ago
    updatedAt: new Date(),
    attendanceStats: {
        totalClasses: Math.floor(Math.random() * 100) + 50,
        attendedClasses: Math.floor(Math.random() * 90) + 45,
        attendanceRate: Math.floor(Math.random() * 10) + 90,
        lastAttendance: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000)
    }
});

// Generate mock data
export const mockUsers: User[] = [
    // Add some specific users first
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@university.edu',
        role: 'student',
        isVerified: true,
        avatar: 'https://i.pravatar.cc/150?img=1',
        matricNo: 'STU001',
        program: 'Computer Science',
        level: '400',
        createdAt: new Date('2023-09-01'),
        updatedAt: new Date(),
        attendanceStats: {
            totalClasses: 45,
            attendedClasses: 42,
            attendanceRate: 93.33,
            lastAttendance: new Date('2024-03-15T10:30:00')
        }
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@university.edu',
        role: 'lecturer',
        isVerified: true,
        avatar: 'https://i.pravatar.cc/150?img=2',
        staffId: 'LEC001',
        college: 'College of Engineering',
        createdAt: new Date('2023-08-01'),
        updatedAt: new Date(),
        attendanceStats: {
            totalClasses: 52,
            attendedClasses: 52,
            attendanceRate: 100,
            lastAttendance: new Date('2024-03-15T09:00:00')
        }
    },
    // Generate random students
    ...Array(20).fill(null).map((_, index) => createMockStudent(index + 3)),
    // Generate random lecturers
    ...Array(10).fill(null).map((_, index) => createMockLecturer(index + 3))
];

// Helper function to get mock data
export const getMockUsers = () => {
    return mockUsers;
}; 