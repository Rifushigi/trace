import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';

interface SplashScreenProps {
    onAnimationComplete: () => void;
}

export const CustomSplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
    const scale = useSharedValue(0.5);
    const opacity = useSharedValue(0);
    const rotation = useSharedValue(0);
    const letterSpacing = useSharedValue(0);

    useEffect(() => {
        scale.value = withSequence(
            withTiming(1.2, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
            withTiming(1, { duration: 500 })
        );
        
        opacity.value = withTiming(1, { duration: 1000 });
        
        rotation.value = withSequence(
            withTiming(360, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
            withDelay(500, withTiming(0, { duration: 0 }))
        );

        letterSpacing.value = withSequence(
            withTiming(10, { duration: 1000 }),
            withTiming(2, { duration: 500 })
        );

        const timer = setTimeout(onAnimationComplete, 2000);
        return () => clearTimeout(timer);
    }, [scale, opacity, rotation, letterSpacing, onAnimationComplete]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` }
        ],
        opacity: opacity.value,
        letterSpacing: letterSpacing.value,
    }));

    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.logo, animatedStyle]}>
                TRACE
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        fontSize: 48,
        fontWeight: '800',
        color: '#2563eb',
        fontFamily: 'System',
        textTransform: 'uppercase',
        letterSpacing: 2,
        textShadowColor: 'rgba(37, 99, 235, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
}); 