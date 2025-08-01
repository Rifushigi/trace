import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register/role" />
            <Stack.Screen 
                name="register" 
                options={{
                    presentation: 'modal',
                }}
            />
            <Stack.Screen name="forgot-password" />
        </Stack>
    );
} 