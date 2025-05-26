import { AuthUseCase } from '../domain/usecases/auth/AuthUseCase';
import { ProfileUseCase } from '../domain/usecases/profile/ProfileUseCase';
import { SettingsUseCase } from '../domain/usecases/settings/SettingsUseCase';
import { AuthStore } from './AuthStore';
import { SettingsStore } from './SettingsStore';

export class RootStore {
    public readonly authStore: AuthStore;
    public readonly settingsStore: SettingsStore;
    public readonly authUseCase: AuthUseCase;
    public readonly profileUseCase: ProfileUseCase;
    public readonly settingsUseCase: SettingsUseCase;

    constructor(
        authUseCase: AuthUseCase,
        profileUseCase: ProfileUseCase,
        settingsUseCase: SettingsUseCase
    ) {
        this.authUseCase = authUseCase;
        this.profileUseCase = profileUseCase;
        this.settingsUseCase = settingsUseCase;
        this.authStore = new AuthStore(authUseCase, profileUseCase);
        this.settingsStore = new SettingsStore(settingsUseCase);
    }
} 