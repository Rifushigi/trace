import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { colors } from '@/shared/constants/theme';
import { useRoleGuard } from '@/presentation/hooks/useRoleGuard';
import { useAuth } from '@/presentation/hooks/useAuth';
import { observer } from 'mobx-react-lite';

export default observer(function AdminLayout() {

    const { logout } = useAuth();
    const { isAuthorized } = useRoleGuard({
        allowedRoles: ['admin'],
        redirectTo: '/login'
    });

    const handleLogout = async () => {
        await logout();
    };

    if (!isAuthorized) {
        return null;
    }

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
}); 