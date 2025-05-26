import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { colors } from '../../shared/constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string | null;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
    errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    containerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputContainerError]}>
                {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        leftIcon ? styles.inputWithLeftIcon : null,
                        rightIcon ? styles.inputWithRightIcon : null,
                        inputStyle,
                    ]}
                    placeholderTextColor="#999999"
                    {...props}
                />
                {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
            </View>
            {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    inputContainerError: {
        borderColor: '#FF3B30',
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000000',
    },
    inputWithLeftIcon: {
        paddingLeft: 8,
    },
    inputWithRightIcon: {
        paddingRight: 8,
    },
    iconContainer: {
        paddingHorizontal: 12,
    },
    error: {
        fontSize: 14,
        color: '#FF3B30',
        marginTop: 4,
    },
}); 