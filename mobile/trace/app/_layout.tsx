import React, { useEffect, useState } from 'react';
import { Stack } from "expo-router";
import { useStores } from '@/stores';
import { observer } from 'mobx-react-lite';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StoreProvider from '../stores/StoreProvider';
import { Container } from '@/di/container';
import { ErrorBoundary } from '@/presentation/components/ErrorBoundary';
import { useAuthGuard } from '@/presentation/hooks/useAuthGuard';
import { useRoleGuard } from '@/presentation/hooks/useRoleGuard';
import * as SplashScreen from 'expo-splash-screen';
import { CustomSplashScreen } from '@/presentation/components/SplashScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
    const { authStore } = useStores();
    const { user, isLoading } = authStore.state;
    const { isAuthenticated } = useAuthGuard();
    const { isAuthorized } = useRoleGuard({
        allowedRoles: ['admin', 'lecturer', 'student']
    });

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Auth Stack */}
            {!isAuthenticated && <Stack.Screen name="(auth)" />}
            {!isAuthenticated && <Stack.Screen name="index" />}
            
            {/* Role-based Stack */}
            {isAuthorized && user?.role === 'student' && <Stack.Screen name="student" />}
            {isAuthorized && user?.role === 'lecturer' && <Stack.Screen name="(lecturer)" />}
            {isAuthorized && user?.role === 'admin' && <Stack.Screen name="(admin)" />}
            {isAuthenticated && <Stack.Screen name="(profile)" />}
            {isAuthenticated && <Stack.Screen name="(settings)" />}
        </Stack>
    );
}

const ObservedRootLayoutContent = observer(RootLayoutContent);

export default function RootLayout() {
    const [container, setContainer] = useState<Container | null>(null);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const containerInstance = Container.getInstance();
        setContainer(containerInstance);
    }, []);

    const handleSplashComplete = async () => {
        setShowSplash(false);
        await SplashScreen.hideAsync();
    };

    if (!container) {
        return null;
    }

    if (showSplash) {
        return <CustomSplashScreen onAnimationComplete={handleSplashComplete} />;
    }

    return (
        <ErrorBoundary>
            <StoreProvider
                authService={container.getAuthService()}
                userService={container.getUserService()}
                settingsService={container.getSettingsService()}
                classService={container.getClassService()}
                attendanceService={container.getAttendanceService()}
            >
                <SafeAreaProvider>
                    <ObservedRootLayoutContent />
                </SafeAreaProvider>
            </StoreProvider>
        </ErrorBoundary>
    );
}
