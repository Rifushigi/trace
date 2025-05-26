import React, { useEffect, useState } from 'react';
import { Stack } from "expo-router";
import { useStores } from '../stores';
import { observer } from 'mobx-react-lite';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '../stores/StoreProvider';
import { Container } from '../di/container';
import { ErrorBoundary } from '../components/ErrorBoundary';

function RootLayoutContent() {
    const { authStore } = useStores();
    const { user, isLoading } = authStore.authState;

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack>
            {!user ? (
                // Auth Stack
                <>
                    <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />
                </>
            ) : (
                // Role-based Stack
                <>
                    {user.role === 'student' && (
                        <Stack.Screen name="(student)" options={{ headerShown: false }} />
                    )}
                    {user.role === 'lecturer' && (
                        <Stack.Screen name="(lecturer)" options={{ headerShown: false }} />
                    )}
                    {user.role === 'admin' && (
                        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                    )}
                    <Stack.Screen name="(profile)" options={{ headerShown: false }} />
                    <Stack.Screen name="(settings)" options={{ headerShown: false }} />
                </>
            )}
        </Stack>
    );
}

const ObservedRootLayoutContent = observer(RootLayoutContent);

export default function RootLayout() {
    const [isReady, setIsReady] = useState(false);
    const [container, setContainer] = useState<Container | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const containerInstance = Container.getInstance();
                setContainer(containerInstance);
                setIsReady(true);
            } catch (error) {
                console.error('Failed to initialize container:', error);
            }
        };

        init();
    }, []);

    if (!isReady || !container) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ErrorBoundary>
            <StoreProvider
                authUseCase={container.getAuthUseCase()}
                profileUseCase={container.getProfileUseCase()}
                settingsUseCase={container.getSettingsUseCase()}
                classUseCase={container.getClassUseCase()}
                attendanceUseCase={container.getAttendanceUseCase()}
            >
                <SafeAreaProvider>
                    <ObservedRootLayoutContent />
                </SafeAreaProvider>
            </StoreProvider>
        </ErrorBoundary>
    );
}
