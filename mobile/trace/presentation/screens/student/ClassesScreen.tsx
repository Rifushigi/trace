import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getMockClasses } from '../../mocks/classMock';
import { useRefresh } from '../../hooks/useRefresh';

export const ClassesScreen = observer(() => {
    const [classes, setClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { refreshing, handleRefresh } = useRefresh({
        onRefresh: async () => {
            await fetchClasses();
        }
    });

    const fetchClasses = async () => {
        try {
            setIsLoading(true);
            // In a real app, this would be an API call to get the student's enrolled classes
            const mockClasses = getMockClasses();
            setClasses(mockClasses);
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);


    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.primary]}
                />
            }
        >
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Classes</Text>
                <Text style={styles.headerSubtitle}>
                    {classes.length} classes enrolled
                </Text>
            </View>

            {/* Classes List */}
            {classes.map((classItem, index) => (
                <Card
                    key={classItem.id}
                    style={{
                        ...styles.classCard,
                        ...(index === classes.length - 1 ? styles.lastCard : {})
                    }}
                >
                    <TouchableOpacity
                        style={styles.classItem}
                        onPress={() => router.push({
                            pathname: '/student/class-details',
                            params: { classId: classItem.id }
                        })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.classHeader}>
                            <View style={styles.classInfo}>
                                <Text style={styles.className}>{classItem.course}</Text>
                                <Text style={styles.classCode}>{classItem.code}</Text>
                            </View>
                        </View>

                        <View style={styles.classDetails}>
                            <View style={styles.detailRow}>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.detailItem}>
                                    <MaterialIcons name="person" size={16} color={colors.textSecondary} />
                                    <Text style={styles.detailText}>
                                        {classItem.lecturer.firstName} {classItem.lecturer.lastName}
                                    </Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <MaterialIcons name="group" size={16} color={colors.textSecondary} />
                                    <Text style={styles.detailText}>{classItem.students.length} students</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.attendanceStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{classItem.attendance.present}</Text>
                                <Text style={styles.statLabel}>Present</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{classItem.attendance.absent}</Text>
                                <Text style={styles.statLabel}>Absent</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{classItem.attendance.late}</Text>
                                <Text style={styles.statLabel}>Late</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Card>
            ))}

            {classes.length === 0 && (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="school" size={48} color={colors.textSecondary} />
                    <Text style={styles.emptyText}>No classes enrolled</Text>
                </View>
            )}
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    header: {
        padding: 16,
        backgroundColor: colors.background,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    classCard: {
        margin: 16,
        marginTop: 0,
    },
    lastCard: {
        marginBottom: 16,
    },
    classItem: {
        padding: 16,
    },
    classHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    classInfo: {
        flex: 1,
        marginRight: 12,
    },
    className: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    classCode: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    classDetails: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 4,
    },
    attendanceStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 8,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 16,
    },
}); 