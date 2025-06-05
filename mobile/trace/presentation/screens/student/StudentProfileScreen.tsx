import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';
import { router } from 'expo-router';
import { Student } from '../../../domain/entities/User';
import { useUser } from '../../hooks/useUser';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useRefresh } from '../../hooks/useRefresh';

export const StudentProfileScreen = observer(() => {
    const { authStore } = useStores();
    const user = authStore.state.user as Student;

    const {
        isFetchingProfile,
        getProfile,
    } = useUser();

    const { handleError, error, isHandlingError } = useErrorHandler({
        showErrorAlert: true,
        onNetworkError: (error: Error) => {
            Alert.alert('Network Error', 'Please check your internet connection');
        },
    });

    const { isConnected } = useNetworkStatus();

    const { refreshing, handleRefresh } = useRefresh({
        onRefresh: async () => {
            await handleError(async () => {
                await getProfile();
            }, 'Failed to refresh profile');
        }
    });

    useEffect(() => {
        handleError(async () => {
            await getProfile();
        }, 'Failed to load profile');
    }, []);

    if (!user) {
        return null;
    }

    if (isFetchingProfile || isHandlingError) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!isConnected) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No internet connection available</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            {/* Academic Information */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Academic Information</Text>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Matric Number</Text>
                    <Text style={styles.infoValue}>{user.matricNo}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Program</Text>
                    <Text style={styles.infoValue}>{user.program}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Level</Text>
                    <Text style={styles.infoValue}>{user.level}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Academic Status</Text>
                    <Text style={styles.infoValue}>Active</Text>
                </View>
            </Card>

            {/* Device Registration Status */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Device Registration</Text>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Face ID Status</Text>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, user.faceModelId ? styles.statusActive : styles.statusInactive]} />
                        <Text style={styles.infoValue}>
                            {user.faceModelId ? 'Registered' : 'Not Registered'}
                        </Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>NFC Status</Text>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, user.nfcUid ? styles.statusActive : styles.statusInactive]} />
                        <Text style={styles.infoValue}>
                            {user.nfcUid ? 'Registered' : 'Not Registered'}
                        </Text>
                    </View>
                </View>
            </Card>

            {/* Quick Actions */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push('/student/device-setup')}
                >
                    <Text style={styles.actionButtonText}>Setup Device</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push({
                        pathname: '/(settings)'
                    })}
                >
                    <Text style={styles.actionButtonText}>Settings</Text>
                </TouchableOpacity>
            </Card>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    section: {
        margin: 16,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    infoItem: {
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusActive: {
        backgroundColor: colors.success,
    },
    statusInactive: {
        backgroundColor: colors.error,
    },
    actions: {
        padding: 16,
    },
    actionButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    secondaryButton: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
    },
    secondaryButtonText: {
        color: colors.text,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        color: colors.error,
        textAlign: 'center',
    },
}); 