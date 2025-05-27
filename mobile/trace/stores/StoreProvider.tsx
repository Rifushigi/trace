import React, { ReactNode, useMemo } from 'react';
import { StoreContext } from './index';
import { RootStore } from './RootStore';
import { AuthUseCase } from '../domain/usecases/auth/AuthUseCase';
import { ProfileUseCase } from '../domain/usecases/profile/ProfileUseCase';
import { SettingsUseCase } from '../domain/usecases/settings/SettingsUseCase';
import { ClassUseCase } from '../domain/usecases/class/ClassUseCase';
import { AttendanceUseCase } from '../domain/usecases/attendance/AttendanceUseCase';
import { UserUseCase } from '../domain/usecases/user/UserUseCase';

interface StoreProviderProps {
    children: ReactNode;
    authUseCase: AuthUseCase;
    profileUseCase: ProfileUseCase;
    settingsUseCase: SettingsUseCase;
    classUseCase: ClassUseCase;
    attendanceUseCase: AttendanceUseCase;
    userUseCase: UserUseCase;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({
    children,
    authUseCase,
    profileUseCase,
    settingsUseCase,
    classUseCase,
    attendanceUseCase,
    userUseCase,
}) => {
    const store = useMemo(
        () => new RootStore(authUseCase, profileUseCase, settingsUseCase, classUseCase, attendanceUseCase, userUseCase),
        [authUseCase, profileUseCase, settingsUseCase, classUseCase, attendanceUseCase, userUseCase]
    );

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
}; 