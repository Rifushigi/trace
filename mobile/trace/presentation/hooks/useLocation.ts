import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { withErrorHandling } from '@/shared/errors/errorHandler';
import { AppError } from '@/shared/errors/AppError';
import { LocationState } from '@/shared/types/location';

export const useLocation = (options: Location.LocationOptions = {}) => {
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        altitude: null,
        speed: null,
        heading: null,
        timestamp: null,
    });

    const [error, setError] = useState<AppError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

    const requestPermission = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await withErrorHandling(
                async () => {
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    setPermissionStatus(status);
                    return status === 'granted';
                },
                'Failed to request location permission'
            );
            return result;
        } catch (err) {
            setError(err as AppError);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getCurrentLocation = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const hasPermission = await requestPermission();
            if (!hasPermission) {
                throw new AppError('PERMISSION_DENIED', 'Location permission not granted');
            }

            const result = await withErrorHandling(
                async () => {
                    const location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                        ...options,
                    });

                    setLocation({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        accuracy: location.coords.accuracy,
                        altitude: location.coords.altitude,
                        speed: location.coords.speed,
                        heading: location.coords.heading,
                        timestamp: location.timestamp,
                    });

                    return location;
                },
                'Failed to get current location'
            );
            return result;
        } catch (err) {
            setError(err as AppError);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [requestPermission, options]);

    const watchLocation = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const hasPermission = await requestPermission();
            if (!hasPermission) {
                throw new AppError('PERMISSION_DENIED', 'Location permission not granted');
            }

            const result = await withErrorHandling(
                async () => {
                    return await Location.watchPositionAsync(
                        {
                            accuracy: Location.Accuracy.Balanced,
                            timeInterval: 1000,
                            distanceInterval: 10,
                            ...options,
                        },
                        (location) => {
                            setLocation({
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                accuracy: location.coords.accuracy,
                                altitude: location.coords.altitude,
                                speed: location.coords.speed,
                                heading: location.coords.heading,
                                timestamp: location.timestamp,
                            });
                        }
                    );
                },
                'Failed to watch location'
            );
            return result;
        } catch (err) {
            setError(err as AppError);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [requestPermission, options]);

    const getLastKnownLocation = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const hasPermission = await requestPermission();
            if (!hasPermission) {
                throw new AppError('PERMISSION_DENIED', 'Location permission not granted');
            }

            const result = await withErrorHandling(
                async () => {
                    const location = await Location.getLastKnownPositionAsync({
                        maxAge: 1000 * 60 * 5, // 5 minutes
                    });

                    if (location) {
                        setLocation({
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            accuracy: location.coords.accuracy,
                            altitude: location.coords.altitude,
                            speed: location.coords.speed,
                            heading: location.coords.heading,
                            timestamp: location.timestamp,
                        });
                    }

                    return location;
                },
                'Failed to get last known location'
            );
            return result;
        } catch (err) {
            setError(err as AppError);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [requestPermission]);

    // Check initial permission status
    useEffect(() => {
        const checkPermission = async () => {
            try {
                const { status } = await Location.getForegroundPermissionsAsync();
                setPermissionStatus(status);
            } catch (err) {
                setError(new AppError('PERMISSION_CHECK_ERROR', 'Failed to check location permission status', 403, err));
            }
        };
        checkPermission();
    }, []);

    return {
        // State
        location,
        error,
        isLoading,
        permissionStatus,

        // Operations
        requestPermission,
        getCurrentLocation,
        watchLocation,
        getLastKnownLocation,
    };
}; 