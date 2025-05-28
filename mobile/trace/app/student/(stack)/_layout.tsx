import { Stack } from 'expo-router';
import { colors } from '../../../shared/constants/theme';

export default function StudentStackLayout() {
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
                name="class-details"
                options={{
                    title: 'Class Details',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="device-setup"
                options={{
                    title: 'Device Setup',
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
} 