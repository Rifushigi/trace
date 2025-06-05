import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '@/shared/constants/theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined' | 'filled';
    style?: ViewStyle;
    onPress?: () => void;
    backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'elevated',
    style,
    onPress,
    backgroundColor,
}) => {
    const getCardStyle = () => {
        const baseStyle = styles[variant];
        if (backgroundColor && variant !== 'outlined') {
            return {
                ...baseStyle,
                backgroundColor,
                // For elevated variant, keep the shadow
                ...(variant === 'elevated' && {
                    shadowColor: colors.text,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                }),
            };
        }
        return baseStyle;
    };

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={[styles.card, getCardStyle(), style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {children}
        </Container>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    elevated: {
        backgroundColor: colors.card,
        shadowColor: colors.text,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.border,
    },
    filled: {
        backgroundColor: colors.primary + '10',
    },
});