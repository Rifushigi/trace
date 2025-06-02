import { AuthUseCase } from '@/domain/usecases/auth/AuthUseCase';
import { ProfileUseCase } from '@/domain/usecases/profile/ProfileUseCase';
import { SettingsUseCase } from '@/domain/usecases/settings/SettingsUseCase';
import { ClassUseCase } from '@/domain/usecases/class/ClassUseCase';
import { AttendanceUseCase } from '@/domain/usecases/attendance/AttendanceUseCase';
import { UserUseCase } from '@/domain/usecases/user/UserUseCase';
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