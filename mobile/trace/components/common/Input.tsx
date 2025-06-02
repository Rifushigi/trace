import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { colors } from '@/shared/constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string | null;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
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
    inputContainerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputContainerError, inputContainerStyle]}>
                {leftIcon}
                <TextInput
                    style={[
                        styles.input,
                        inputStyle,
                    ]}
                    placeholderTextColor={colors.textSecondary}
                    {...props}
                />
                {rightIcon}
            </View>
            {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    inputContainerError: {
        borderColor: colors.error,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        minHeight: 52,
        paddingVertical: 0,
    },
    error: {
        fontSize: 14,
        color: colors.error,
        marginTop: 4,
    },
}); 