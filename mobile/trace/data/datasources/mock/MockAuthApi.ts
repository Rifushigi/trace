import { AuthTokens, LoginCredentials, RegisterData, PasswordResetRequest, PasswordResetConfirm, IAuthApi } from '@/domain/entities/Auth';
import { User, Student, Lecturer } from '@/domain/entities/User';
import { AppError } from '@/shared/errors/AppError';
import { handleError } from '@/shared/errors/errorHandler';

export class MockAuthApi implements IAuthApi {

    readonly BASE_URL = '/auth';
    private mockUsers: (Student | Lecturer | User)[] = [
        {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'student@example.com',
            role: 'student',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            matricNo: 'STU123',
            program: 'Computer Science',
            level: '400',
            faceModelId: undefined,
            nfcUid: undefined,
            bleToken: undefined
        },
        {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'lecturer@example.com',
            role: 'lecturer',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            staffId: 'LEC456',
            college: 'Engineering'
        },
        {
            id: '3',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            role: 'admin',
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens } | AppError> {
        // const user = this.mockUsers.find(u => u.email === credentials.email);
        // if (!user || credentials.password !== 'password') {
        //     throw new Error('Invalid credentials');
        // }
        const user = this.mockUsers[0];

        return {
            user,
            tokens: {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                expiresIn: 3600
            }
        };
    }

    async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens } | AppError> {
        // Simulate email check
        if (this.mockUsers.some(u => u.email === data.email)) {
            handleError(new Error('Email already exists'));
        }

        const now = new Date();
        const baseUser = {
            id: String(this.mockUsers.length + 1),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            isVerified: false,
            createdAt: now,
            updatedAt: now,
        };

        let newUser: Student | Lecturer | User;
        if (data.role === 'student') {
            newUser = {
                ...baseUser,
                role: 'student' as const,
                matricNo: data.matricNo || '',
                program: data.program || '',
                level: data.level || '',
                faceModelId: undefined,
                nfcUid: undefined,
                bleToken: undefined
            };
        } else if (data.role === 'lecturer') {
            newUser = {
                ...baseUser,
                role: 'lecturer' as const,
                staffId: data.staffId || '',
                college: data.college || ''
            };
        } else {
            newUser = {
                ...baseUser,
                role: 'admin' as const
            };
        }

        this.mockUsers.push(newUser);

        return {
            user: newUser,
            tokens: {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                expiresIn: 3600
            }
        };
    }

    async logout(): Promise<void | AppError> {
        // Mock logout - no action needed
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens | AppError> {
        return {
            accessToken: 'new-mock-access-token',
            refreshToken: 'new-mock-refresh-token',
            expiresIn: 3600
        };
    }

    async requestPasswordReset(data: PasswordResetRequest): Promise<void | AppError> {
        // Mock password reset request - no action needed
    }

    async confirmPasswordReset(data: PasswordResetConfirm): Promise<void | AppError> {
        // Mock password reset confirmation - no action needed
    }

    async verifyEmail(token: string): Promise<void | AppError> {
        // Mock email verification - no action needed
    }

    async getCurrentUser(): Promise<User | null | AppError> {
        return this.mockUsers[0];
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<void | AppError> {
        // Mock password update - no action needed
    }

    async updateProfile(data: Partial<User>): Promise<User | AppError> {
        const user = this.mockUsers[0];
        const updatedUser = { ...user, ...data, updatedAt: new Date() };
        this.mockUsers[0] = updatedUser;
        return updatedUser;
    }
} 