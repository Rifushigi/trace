import { AuthService } from '@/domain/services/auth/AuthService';
import { AuthServiceImpl } from '@/domain/services/auth/impl/AuthServiceImpl';
import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl';
import { AuthApi } from '@/data/datasources/remote/AuthApi';
import { SettingsService } from '@/domain/services/settings/SettingService';
import { SettingsServiceImpl } from '@/domain/services/settings/impl/SettingServiceImpl';
import { SettingsRepository } from '@/domain/repositories/SettingsRepository';
import { SettingsRepositoryImpl } from '@/data/repositories/SettingsRepositoryImpl';
import { SettingsApi } from '@/data/datasources/remote/SettingsApi';
import { ClassApi } from '@/data/datasources/remote/ClassApi';
import { ClassRepository } from '@/domain/repositories/ClassRepository';
import { ClassRepositoryImpl } from '@/data/repositories/ClassRepositoryImpl';
import { ClassServiceImpl } from '@/domain/services/class/impl/ClassServiceImpl';
import { ClassService } from '@/domain/services/class/ClassService';
import { AttendanceApi } from '@/data/datasources/remote/AttendanceApi';
import { AttendanceRepositoryImpl } from '@/data/repositories/AttendanceRepositoryImpl';
import { AttendanceRepository } from '@/domain/repositories/AttendanceRepository';
import { AttendanceServiceImpl } from '@/domain/services/attendance/impl/AttendanceServiceImpl';
import { AttendanceService } from '@/domain/services/attendance/AttendanceService';
import { features } from '@/config/features';
import { MockAuthApi } from '@/data/datasources/mock/MockAuthApi';
import { UserService } from '@/domain/services/user/UserService';
import { UserServiceImpl } from '@/domain/services/user/impl/UserServiceImpl';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { UserRepositoryImpl } from '@/data/repositories/UserRepositoryImpl';
import { UserApi } from '@/data/datasources/remote/UserApi';
import { MockUserApi } from '@/data/datasources/mock/MockUserApi';

export class Container {
    // Singleton instance
    private static instance: Container;

    // Auth 
    private authApi: AuthApi | MockAuthApi;
    private authRepository: AuthRepository;
    private authService: AuthService;

    // Settings
    private settingsApi: SettingsApi;
    private settingsRepository: SettingsRepository;
    private settingsService: SettingsService;

    // Class
    private classApi: ClassApi;
    private classRepository: ClassRepository;
    private classService: ClassService;

    // Attendance
    private attendanceApi: AttendanceApi;
    private attendanceRepository: AttendanceRepository;
    private attendanceService: AttendanceService;

    // User
    private userApi: UserApi | MockUserApi;
    private userRepository: UserRepository;
    private userService: UserService;

    private constructor() {
        // Initialize APIs
        this.authApi = features.useMockApi ? new MockAuthApi() : new AuthApi();
        this.settingsApi = new SettingsApi();
        this.classApi = new ClassApi();
        this.attendanceApi = new AttendanceApi();
        this.userApi = features.useMockApi ? new MockUserApi() : new UserApi();

        // Initialize Repositories
        this.authRepository = new AuthRepositoryImpl(this.authApi);
        this.settingsRepository = new SettingsRepositoryImpl(this.settingsApi);
        this.classRepository = new ClassRepositoryImpl(this.classApi);
        this.attendanceRepository = new AttendanceRepositoryImpl(this.attendanceApi);
        this.userRepository = new UserRepositoryImpl(this.userApi);

        // Initialize Use Cases
        this.authService = new AuthServiceImpl(this.authRepository);
        this.settingsService = new SettingsServiceImpl(this.settingsRepository);
        this.classService = new ClassServiceImpl(this.classRepository);
        this.attendanceService = new AttendanceServiceImpl(this.attendanceRepository);
        this.userService = new UserServiceImpl(this.userRepository);
    }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    public getAuthService(): AuthService {
        return this.authService;
    }

    public getSettingsService(): SettingsService {
        return this.settingsService;
    }

    public getClassService(): ClassService {
        return this.classService;
    }

    public getAttendanceService(): AttendanceService {
        return this.attendanceService;
    }

    public getUserService(): UserService {
        return this.userService;
    }
}