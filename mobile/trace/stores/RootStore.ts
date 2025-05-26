import { AuthUseCase } from '../domain/usecases/auth/AuthUseCase';
import { ProfileUseCase } from '../domain/usecases/profile/ProfileUseCase';
import { SettingsUseCase } from '../domain/usecases/settings/SettingsUseCase';
import { ClassUseCase } from '../domain/usecases/class/ClassUseCase';
import { AttendanceUseCase } from '../domain/usecases/attendance/AttendanceUseCase';
import { AuthStore } from './AuthStore';
import { SettingsStore } from './SettingsStore';
import { ClassStore } from './ClassStore';
import { AttendanceStore } from './AttendanceStore';

export class RootStore {
    public readonly authStore: AuthStore;
    public readonly settingsStore: SettingsStore;
    public readonly classStore: ClassStore;
    public readonly attendanceStore: AttendanceStore;
    public readonly authUseCase: AuthUseCase;
    public readonly profileUseCase: ProfileUseCase;
    public readonly settingsUseCase: SettingsUseCase;
    public readonly classUseCase: ClassUseCase;
    public readonly attendanceUseCase: AttendanceUseCase;

    constructor(
        authUseCase: AuthUseCase,
        profileUseCase: ProfileUseCase,
        settingsUseCase: SettingsUseCase,
        classUseCase: ClassUseCase,
        attendanceUseCase: AttendanceUseCase
    ) {
        this.authUseCase = authUseCase;
        this.profileUseCase = profileUseCase;
        this.settingsUseCase = settingsUseCase;
        this.classUseCase = classUseCase;
        this.attendanceUseCase = attendanceUseCase;
        this.authStore = new AuthStore(authUseCase, profileUseCase);
        this.settingsStore = new SettingsStore(settingsUseCase);
        this.classStore = new ClassStore(classUseCase);
        this.attendanceStore = new AttendanceStore(attendanceUseCase);
    }
} 