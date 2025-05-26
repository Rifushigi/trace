import { Stack } from 'expo-router';

export default function AdminLayout() {
    return (
        <Stack>
            <Stack.Screen 
                name="dashboard" 
                options={{ 
                    title: 'Admin Dashboard',
                    headerShown: true 
                }} 
            />
            <Stack.Screen 
                name="user-management" 
                options={{ 
                    title: 'User Management',
                    headerShown: true 
                }} 
            />
            <Stack.Screen 
                name="system-settings" 
                options={{ 
                    title: 'System Settings',
                    headerShown: true 
                }} 
            />
            <Stack.Screen 
                name="reports" 
                options={{ 
                    title: 'Reports',
                    headerShown: true 
                }} 
            />
        </Stack>
    );
} 