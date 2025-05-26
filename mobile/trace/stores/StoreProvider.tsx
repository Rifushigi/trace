import React, { ReactNode } from 'react';
import { StoreContext } from './index';
import { RootStore } from './RootStore';
import { AuthUseCase } from '../domain/usecases/auth/AuthUseCase';
import { ProfileUseCase } from '../domain/usecases/profile/ProfileUseCase';
import { SettingsUseCase } from '../domain/usecases/settings/SettingsUseCase';

interface StoreProviderProps {
    children: ReactNode;
    authUseCase: AuthUseCase;
    profileUseCase: ProfileUseCase;
    settingsUseCase: SettingsUseCase;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({
    children,
    authUseCase,
    profileUseCase,
    settingsUseCase,
}) => {
    const store = new RootStore(authUseCase, profileUseCase, settingsUseCase);
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
}; 