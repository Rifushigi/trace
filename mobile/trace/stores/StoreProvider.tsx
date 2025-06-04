import React, { ReactNode, useMemo } from 'react';
import { StoreContext } from '@/stores/index';
import { RootStore } from '@/stores/RootStore';
import { AuthService } from '@/domain/services/auth/AuthService';
import { SettingsService } from '@/domain/services/settings/SettingService';
import { ClassService } from '@/domain/services/class/ClassService';
import { AttendanceService } from '@/domain/services/attendance/AttendanceService';
import { UserService } from '@/domain/services/user/UserService';

interface StoreProviderProps {
    children: ReactNode;
    authService: AuthService;
    settingsService: SettingsService;
    classService: ClassService;
    attendanceService: AttendanceService;
    userService: UserService;
}

function StoreProvider({
    children,
    authService,
    settingsService,
    classService,
    attendanceService,
    userService,
}: StoreProviderProps) {
    const store = useMemo(
        () => new RootStore(authService, settingsService, classService, attendanceService, userService),
        [authService, settingsService, classService, attendanceService, userService]
    );

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreProvider; 