import { Stack } from 'expo-router';
import { colors } from '@/shared/constants/theme';

export default function StudentLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="(stack)"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
} 