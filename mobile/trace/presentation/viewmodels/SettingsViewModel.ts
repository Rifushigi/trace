import { makeAutoObservable } from 'mobx';
import { SettingsUseCase } from '../../domain/services/settings/SettingService';
import { AppSettings, Theme, Language, NotificationSettings, PrivacySettings } from '../../domain/entities/Settings';

export class SettingsViewModel {
    private _settings: AppSettings | null = null;
    private _isLoading = false;
    private _error: string | null = null;

    constructor(private readonly settingsUseCase: SettingsUseCase) {
        makeAutoObservable(this);
    }

    get settings(): AppSettings | null {
        return this._settings;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get error(): string | null {
        return this._error;
    }

    getSettings(): AppSettings {
        return this._settings as AppSettings;
    }

    async loadSettings(): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._settings = await this.settingsUseCase.getSettings();
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to load settings';
        } finally {
            this._isLoading = false;
        }
    }

    async updateTheme(theme: Theme): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._settings = await this.settingsUseCase.updateTheme(theme);
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to update theme';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async updateLanguage(language: Language): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._settings = await this.settingsUseCase.updateLanguage(language);
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to update language';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._settings = await this.settingsUseCase.updateNotificationSettings(settings);
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to update notification settings';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._settings = await this.settingsUseCase.updatePrivacySettings(settings);
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to update privacy settings';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    async resetSettings(): Promise<void> {
        try {
            this._isLoading = true;
            this._error = null;
            this._settings = await this.settingsUseCase.resetSettings();
        } catch (error) {
            this._error = error instanceof Error ? error.message : 'Failed to reset settings';
            throw error;
        } finally {
            this._isLoading = false;
        }
    }

    clearError(): void {
        this._error = null;
    }
} 