import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { colors } from '../../../shared/constants/theme';

export const SessionDetailsScreen = observer(() => {
    const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Session Details</Text>
            <Text style={styles.sessionId}>Session ID: {sessionId}</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    sessionId: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 16,
    },
}); 