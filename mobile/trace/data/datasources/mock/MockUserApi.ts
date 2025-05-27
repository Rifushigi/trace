import { User, Student, Lecturer, AttendanceStats } from '../../../domain/entities/User';
import { IUserApi } from '../../../domain/repositories/UserRepository';

export class MockUserApi implements IUserApi {
    private readonly BASE_URL = '/api/users';
    private mockUsers: (Student | Lecturer)[] = [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@university.edu',
            role: 'student',
            isVerified: true,
            avatar: undefined,
            matricNo: 'STU001',
            program: 'Computer Science',
            level: '400',
            faceModelId: undefined,
            nfcUid: undefined,
            bleToken: undefined,
            createdAt: new Date('2023-09-01'),
            updatedAt: new Date('2023-09-01'),
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
            role: 'student',
            isVerified: false,
            avatar: undefined,
            matricNo: 'STU002',
            program: 'Electrical Engineering',
            level: '300',
            faceModelId: undefined,
            nfcUid: undefined,
            bleToken: undefined,
            createdAt: new Date('2023-09-15'),
            updatedAt: new Date('2023-09-15'),
            attendanceStats: {
                totalClasses: 38,
                attendedClasses: 35,
                attendanceRate: 92.11,
                lastAttendance: new Date('2024-03-14T14:15:00')
            }
        },
        {
            id: '3',
            firstName: 'Robert',
            lastName: 'Johnson',
            email: 'robert.johnson@university.edu',
            role: 'lecturer',
            isVerified: true,
            avatar: undefined,
            staffId: 'LEC001',
            college: 'Engineering',
            createdAt: new Date('2023-08-01'),
            updatedAt: new Date('2023-08-01'),
            attendanceStats: {
                totalClasses: 52,
                attendedClasses: 52,
                attendanceRate: 100,
                lastAttendance: new Date('2024-03-15T09:00:00')
            }
        },
        {
            id: '4',
            firstName: 'Sarah',
            lastName: 'Williams',
            email: 'sarah.williams@university.edu',
            role: 'lecturer',
            isVerified: true,
            avatar: undefined,
            staffId: 'LEC002',
            college: 'Computer Science',
            createdAt: new Date('2023-08-15'),
            updatedAt: new Date('2023-08-15'),
            attendanceStats: {
                totalClasses: 48,
                attendedClasses: 46,
                attendanceRate: 95.83,
                lastAttendance: new Date('2024-03-15T11:45:00')
            }
        },
        {
            id: '5',
            firstName: 'Michael',
            lastName: 'Brown',
            email: 'michael.brown@university.edu',
            role: 'student',
            isVerified: true,
            avatar: undefined,
            matricNo: 'STU003',
            program: 'Mechanical Engineering',
            level: '200',
            faceModelId: undefined,
            nfcUid: undefined,
            bleToken: undefined,
            createdAt: new Date('2023-10-01'),
            updatedAt: new Date('2023-10-01'),
            attendanceStats: {
                totalClasses: 41,
                attendedClasses: 37,
                attendanceRate: 90.24,
                lastAttendance: new Date('2024-03-14T16:30:00')
            }
        }
    ];

    async getAllUsers(): Promise<User[]> {
        return this.mockUsers;
    }

    async deleteUser(userId: string): Promise<void> {
        const index = this.mockUsers.findIndex(user => user.id === userId);
        if (index !== -1) {
            this.mockUsers.splice(index, 1);
        }
    }

    async verifyUser(userId: string): Promise<void> {
        const user = this.mockUsers.find(user => user.id === userId);
        if (user) {
            user.isVerified = true;
            user.updatedAt = new Date();
        }
    }
} 