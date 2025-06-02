import { Stack, router } from 'expo-router';
import { TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useStores } from '@/stores';
import { colors } from '@/shared/constants/theme';
import { observer } from 'mobx-react-lite';

const LecturerLayout = observer(() => {
    const { authStore } = useStores();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authStore.logout();
                            router.replace('/welcome');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <Stack>
            <Stack.Screen 
                name="dashboard" 
                
                options={{ 
                    title: 'Dashboard',
                    headerShown: true,
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
            <Stack.Screen 
                name="class-management" 
                options={{ 
                    headerTitle: 'Class Management',
                }} 
            />
            <Stack.Screen 
                name="class-details" 
                options={{ 
                    title: 'Class Details',
                    headerShown: false 
                }} 
            />
            <Stack.Screen 
                name="session-control" 
                options={{ 
                    headerTitle: 'Session Control',
                }} 
            />
            <Stack.Screen 
                name="attendance-management" 
                options={{ 
                    title: 'Attendance Management',
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
            <Stack.Screen 
                name="session-details" 
                options={{ 
                    title: 'Session Details',
                    headerShown: true 
                }} 
            />
        </Stack>
    );
});

export default LecturerLayout; 