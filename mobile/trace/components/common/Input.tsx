import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/shared/constants/theme';
import { InputProps } from '@/shared/types/input';

export const Input: React.FC<InputProps> = ({
    label,
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
            <View style={[styles.inputContainer && styles.inputContainerError, inputContainerStyle]}>
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