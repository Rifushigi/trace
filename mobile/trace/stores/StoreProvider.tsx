import React, { ReactNode, useMemo } from 'react';
import { StoreContext } from '@/stores/index';
import { RootStore } from '@/stores/RootStore';
import { AuthUseCase } from '@/domain/services/auth/AuthService';
import { ProfileUseCase } from '@/domain/services/profile/ProfileService';
import { SettingsUseCase } from '@/domain/services/settings/SettingService';
import { ClassUseCase } from '@/domain/services/class/ClassService';
import { AttendanceUseCase } from '@/domain/services/attendance/AttendanceService';
import { UserUseCase } from '@/domain/services/user/UserService';

interface StoreProviderProps {
    children: ReactNode;
    authUseCase: AuthUseCase;
    profileUseCase: ProfileUseCase;
    settingsUseCase: SettingsUseCase;
    classUseCase: ClassUseCase;
    attendanceUseCase: AttendanceUseCase;
    userUseCase: UserUseCase;
}

function StoreProvider({
    children,
    authUseCase,
    profileUseCase,
    settingsUseCase,
    classUseCase,
    attendanceUseCase,
    userUseCase,
}: StoreProviderProps) {
    const store = useMemo(
        () => new RootStore(authUseCase, profileUseCase, settingsUseCase, classUseCase, attendanceUseCase, userUseCase),
        [authUseCase, profileUseCase, settingsUseCase, classUseCase, attendanceUseCase, userUseCase]
    );

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreProvider; 