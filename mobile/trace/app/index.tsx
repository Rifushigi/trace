import { Redirect } from 'expo-router';
import { useStores } from '@/stores';
import { observer } from 'mobx-react-lite';
import { useAuthGuard } from '@/presentation/hooks/useAuthGuard';
import { useRoleGuard } from '@/presentation/hooks/useRoleGuard';

export default observer(function Index() {
    const { authStore } = useStores();
    const { user, isLoading } = authStore.state;
    const { isAuthenticated } = useAuthGuard();
    const { isAuthorized } = useRoleGuard({
        allowedRoles: ['admin', 'lecturer', 'student']
    });

    if (isLoading) {
        return null; // Let the root layout handle loading state
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/welcome" />;
    }

    if (!isAuthorized) {
        return <Redirect href="/(auth)/welcome" />;
    }

    // Redirect based on user role
    switch (user?.role) {
        case 'student':
            return <Redirect href="/student/(tabs)/dashboard" />;
        case 'lecturer':
            return <Redirect href="/(lecturer)/dashboard" />;
        case 'admin':
            return <Redirect href="/(admin)/dashboard" />;
        default:
            return <Redirect href="/(auth)/welcome" />;
    }
});
