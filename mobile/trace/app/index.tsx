import { Redirect } from 'expo-router';
import { useStores } from '../stores';
import { observer } from 'mobx-react-lite';

export default observer(function Index() {
    const { authStore } = useStores();
    const { user, isLoading } = authStore.authState;

    if (isLoading) {
        return null; // Let the root layout handle loading state
    }

    if (!user) {
        return <Redirect href="/(auth)/welcome" />;
    }

    // Redirect based on user role
    switch (user.role) {
        case 'student':
            return <Redirect href="/(student)/dashboard" />;
        case 'lecturer':
            return <Redirect href="/(lecturer)/dashboard" />;
        case 'admin':
            return <Redirect href="/(admin)/dashboard" />;
        default:
            return <Redirect href="/(auth)/welcome" />;
    }
});
