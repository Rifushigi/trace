import { AuthUseCase } from '@/domain/services/auth/AuthService';
import { ProfileUseCase } from '@/domain/services/profile/ProfileService';
import { SettingsUseCase } from '@/domain/services/settings/SettingService';
import { ClassUseCase } from '@/domain/services/class/ClassService';
import { AttendanceUseCase } from '@/domain/services/attendance/AttendanceService';
import { UserUseCase } from '@/domain/services/user/UserService';
import { AuthStore } from '@/stores/AuthStore';
import { SettingsStore } from '@/stores/SettingsStore';
import { ClassStore } from '@/stores/ClassStore';
import { AttendanceStore } from '@/stores/AttendanceStore';

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
    public readonly userUseCase: UserUseCase;

    constructor(
        authUseCase: AuthUseCase,
        profileUseCase: ProfileUseCase,
        settingsUseCase: SettingsUseCase,
        classUseCase: ClassUseCase,
        attendanceUseCase: AttendanceUseCase,
        userUseCase: UserUseCase
    ) {
        this.authUseCase = authUseCase;
        this.profileUseCase = profileUseCase;
        this.settingsUseCase = settingsUseCase;
        this.classUseCase = classUseCase;
        this.attendanceUseCase = attendanceUseCase;
        this.userUseCase = userUseCase;
        this.authStore = new AuthStore(authUseCase, profileUseCase, userUseCase);
        this.settingsStore = new SettingsStore(settingsUseCase);
        this.classStore = new ClassStore(classUseCase);
        this.attendanceStore = new AttendanceStore(attendanceUseCase);
    }
} 