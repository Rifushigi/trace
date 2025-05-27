import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useStores } from '../../stores';
import { colors } from '../../shared/constants/theme';

export default function AdminLayout() {
    const { authStore } = useStores();

    const handleLogout = () => {
        authStore.logout();
    };

    return (
        <Tabs>
            <Tabs.Screen
                name="dashboard" 
                options={{ 
                    title: 'Dashboard',
                    headerTitle: 'Admin Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="dashboard" size={size} color={color} />
                    ),
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    headerRight: () => (
                        <TouchableOpacity 
                            onPress={handleLogout}
                            style={{ marginRight: 16 }}
                        >
                            <MaterialIcons name="logout" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    ),
                }} 
            />
            <Tabs.Screen
                name="user-management" 
                options={{ 
                    title: 'Users',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="people" size={size} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen
                name="reports" 
                options={{ 
                    title: 'Reports',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="assessment" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="system-settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" size={size} color={color} />
                    ),
                }} 
            />
        </Tabs>
    );
} 