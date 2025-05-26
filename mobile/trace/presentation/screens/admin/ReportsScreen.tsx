import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { colors } from '../../../shared/constants/theme';

export const ReportsScreen = observer(() => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Reports</Text>
            {/* Add report content here */}
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 16,
    },
}); 