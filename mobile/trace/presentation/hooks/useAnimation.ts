import { UseAnimationOptions } from '@/shared/types/animation';
import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

export const useAnimation = ({
    initialValue = 1,
    duration = 1000,
    useNativeDriver = true,
}: UseAnimationOptions = {}) => {
    const scaleAnim = useRef(new Animated.Value(initialValue)).current;
    const pulseAnim = useRef(new Animated.Value(initialValue)).current;

    const startPulseAnimation = useCallback((maxClicks = 10) => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration,
                    useNativeDriver,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration,
                    useNativeDriver,
                })
            ])
        ).start();
    }, [pulseAnim, duration, useNativeDriver]);

    const handlePressIn = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver,
        }).start();
    }, [scaleAnim, useNativeDriver]);

    const handlePressOut = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver,
        }).start();
    }, [scaleAnim, useNativeDriver]);

    const stopPulseAnimation = useCallback(() => {
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
    }, [pulseAnim]);

    return {
        scaleAnim,
        pulseAnim,
        startPulseAnimation,
        handlePressIn,
        handlePressOut,
        stopPulseAnimation,
    };
}; 