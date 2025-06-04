import { useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from './useNavigation';
import { DeepLinkHandler } from '@/shared/types/navigation';



export const useDeepLink = (handlers: DeepLinkHandler[]) => {
    const { navigate } = useNavigation();

    const handleDeepLink = useCallback((url: string) => {
        for (const { pattern, handler } of handlers) {
            if (typeof pattern === 'string' ? url.includes(pattern) : pattern.test(url)) {
                const config = handler(url);
                if (config) {
                    navigate(config.path, config.params);
                    return true;
                }
            }
        }
        return false;
    }, [handlers, navigate]);

    useEffect(() => {
        // Handle deep links when app is already running
        const subscription = Linking.addEventListener('url', ({ url }) => {
            handleDeepLink(url);
        });

        // Handle deep links when app is opened from a deep link
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink(url);
            }
        });

        return () => {
            subscription.remove();
        };
    }, [handleDeepLink]);

    return {
        handleDeepLink,
    };
}; 