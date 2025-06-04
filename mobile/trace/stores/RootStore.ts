import { AuthService } from '@/domain/services/auth/AuthService';
import { UserService } from '@/domain/services/user/UserService';
import { SettingsService } from '@/domain/services/settings/SettingService';
import { ClassService } from '@/domain/services/class/ClassService';
import { AttendanceService } from '@/domain/services/attendance/AttendanceService';
import { AuthStore } from '@/stores/AuthStore';
import { SettingsStore } from '@/stores/SettingsStore';
import { ClassStore } from '@/stores/ClassStore';
import { AttendanceStore } from '@/stores/AttendanceStore';

export class RootStore {
    public readonly authStore: AuthStore;
    public readonly settingsStore: SettingsStore;
    public readonly classStore: ClassStore;
    public readonly attendanceStore: AttendanceStore;
    public readonly authService: AuthService;
    public readonly userService: UserService;
    public readonly settingsService: SettingsService;
    public readonly classService: ClassService;
    public readonly attendanceService: AttendanceService;

    constructor(
        authService: AuthService,
        userService: UserService,
        settingsService: SettingsService,
        classService: ClassService,
        attendanceService: AttendanceService
    ) {
        this.authService = authService;
        this.userService = userService;
        this.settingsService = settingsService;
        this.classService = classService;
        this.attendanceService = attendanceService;
        this.authStore = new AuthStore(authService, userService);
        this.settingsStore = new SettingsStore(settingsService);
        this.classStore = new ClassStore(classService);
        this.attendanceStore = new AttendanceStore(attendanceService);
    }
} 