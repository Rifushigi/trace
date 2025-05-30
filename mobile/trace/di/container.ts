import { AuthUseCase } from '../domain/usecases/auth/AuthUseCase';
import { AuthUseCaseImpl } from '../domain/usecases/auth/impl/AuthUseCaseImpl';
import { AuthRepository } from '../domain/repositories/AuthRepository';
import { AuthRepositoryImpl } from '../data/repositories/AuthRepositoryImpl';
import { AuthApi } from '../data/datasources/remote/AuthApi';
import { ProfileUseCase } from '../domain/usecases/profile/ProfileUseCase';
import { ProfileUseCaseImpl } from '../domain/usecases/profile/impl/ProfileUseCaseImpl';
import { ProfileRepository } from '../domain/repositories/ProfileRepository';
import { ProfileRepositoryImpl } from '../data/repositories/ProfileRepositoryImpl';
import { ProfileApi } from '../data/datasources/remote/ProfileApi';
import { SettingsUseCase } from '../domain/usecases/settings/SettingsUseCase';
import { SettingsUseCaseImpl } from '../domain/usecases/settings/impl/SettingsUseCaseImpl';
import { SettingsRepository } from '../domain/repositories/SettingsRepository';
import { SettingsRepositoryImpl } from '../data/repositories/SettingsRepositoryImpl';
import { SettingsApi } from '../data/datasources/remote/SettingsApi';
import { ClassApi } from '../data/datasources/remote/ClassApi';
import { AttendanceApi } from '../data/datasources/remote/AttendanceApi';
import { AttendanceRepositoryImpl } from '../data/repositories/AttendanceRepositoryImpl';
import { ClassRepositoryImpl } from '../data/repositories/ClassRepositoryImpl';
import { AttendanceRepository } from '../domain/repositories/AttendanceRepository';
import { ClassRepository } from '../domain/repositories/ClassRepository';
import { ClassUseCaseImpl } from '../domain/usecases/class/impl/ClassUseCaseImpl';
import { AttendanceUseCaseImpl } from '../domain/usecases/attendance/impl/AttendanceUseCaseImpl';
import { ClassUseCase } from '../domain/usecases/class/ClassUseCase';
import { AttendanceUseCase } from '../domain/usecases/attendance/AttendanceUseCase';
import { features } from '../config/features';
import { MockAuthApi } from '../data/datasources/mock/MockAuthApi';
import { UserUseCase } from '../domain/usecases/user/UserUseCase';
import { UserUseCaseImpl } from '../domain/usecases/user/impl/UserUseCaseImpl';
import { UserRepository } from '../domain/repositories/UserRepository';
import { UserRepositoryImpl } from '../data/repositories/UserRepositoryImpl';
import { UserApi } from '../data/datasources/remote/UserApi';
import { MockUserApi } from '../data/datasources/mock/MockUserApi';

export class Container {
    private static instance: Container;

    // Auth 
    private authApi: AuthApi | MockAuthApi;
    private authRepository: AuthRepository;
    private authUseCase: AuthUseCase;

    // Profile
    private profileApi: ProfileApi;
    private profileRepository: ProfileRepository;
    private profileUseCase: ProfileUseCase;

    // Settings
    private settingsApi: SettingsApi;
    private settingsRepository: SettingsRepository;
    private settingsUseCase: SettingsUseCase;

    // Class
    private classApi: ClassApi;
    private classRepository: ClassRepository;
    private classUseCase: ClassUseCase;

    // Attendance
    private attendanceApi: AttendanceApi;
    private attendanceRepository: AttendanceRepository;
    private attendanceUseCase: AttendanceUseCase;

    // User
    private userApi: UserApi | MockUserApi;
    private userRepository: UserRepository;
    private userUseCase: UserUseCase;

    private constructor() {
        // Initialize APIs
        this.authApi = features.useMockApi ? new MockAuthApi() : new AuthApi();
        this.profileApi = new ProfileApi();
        this.settingsApi = new SettingsApi();
        this.classApi = new ClassApi();
        this.attendanceApi = new AttendanceApi();
        this.userApi = features.useMockApi ? new MockUserApi() : new UserApi();

        // Initialize Repositories
        this.authRepository = new AuthRepositoryImpl(this.authApi);
        this.profileRepository = new ProfileRepositoryImpl(this.profileApi);
        this.settingsRepository = new SettingsRepositoryImpl(this.settingsApi);
        this.classRepository = new ClassRepositoryImpl(this.classApi);
        this.attendanceRepository = new AttendanceRepositoryImpl(this.attendanceApi);
        this.userRepository = new UserRepositoryImpl(this.userApi);

        // Initialize Use Cases
        this.authUseCase = new AuthUseCaseImpl(this.authRepository);
        this.profileUseCase = new ProfileUseCaseImpl(this.profileRepository);
        this.settingsUseCase = new SettingsUseCaseImpl(this.settingsRepository);
        this.classUseCase = new ClassUseCaseImpl(this.classRepository);
        this.attendanceUseCase = new AttendanceUseCaseImpl(this.attendanceRepository);
        this.userUseCase = new UserUseCaseImpl(this.userRepository);
    }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    public getAuthUseCase(): AuthUseCase {
        return this.authUseCase;
    }

    public getProfileUseCase(): ProfileUseCase {
        return this.profileUseCase;
    }

    public getSettingsUseCase(): SettingsUseCase {
        return this.settingsUseCase;
    }

    public getClassUseCase(): ClassUseCase {
        return this.classUseCase;
    }

    public getAttendanceUseCase(): AttendanceUseCase {
        return this.attendanceUseCase;
    }

    public getUserUseCase(): UserUseCase {
        return this.userUseCase;
    }
}