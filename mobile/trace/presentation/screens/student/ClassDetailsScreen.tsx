import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '../../components/Card';
import { colors } from '../../../shared/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import { ClassDetails, getMockClasses } from '../../mocks/classMock';

export const ClassDetailsScreen = observer(() => {
    const { classId } = useLocalSearchParams<{ classId: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                const mockClasses = getMockClasses();
                const details = mockClasses.find(c => c.id === classId);
                if (details) {
                    setClassDetails(details);
                }
            } catch (error) {
                console.error('Error fetching class details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClassDetails();
    }, [classId]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading class details...</Text>
            </View>
        );
    }

    if (!classDetails) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Class not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Course Information */}
            <Card style={styles.section}>
                <Text style={styles.courseName}>{classDetails.course}</Text>
                <Text style={styles.courseCode}>{classDetails.code}</Text>
                <Text style={styles.description}>{classDetails.description}</Text>
            </Card>

            {/* Course Objectives */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Course Objectives</Text>
                {classDetails.objectives.map((objective, index) => (
                    <View key={index} style={styles.objectiveItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.objectiveText}>{objective}</Text>
                    </View>
                ))}
            </Card>

            {/* Prerequisites */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Prerequisites</Text>
                {classDetails.prerequisites.map((prerequisite, index) => (
                    <View key={index} style={styles.prerequisiteItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.prerequisiteText}>{prerequisite}</Text>
                    </View>
                ))}
            </Card>

            {/* Grading System */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Grading System</Text>
                <View style={styles.gradingGrid}>
                    <View style={styles.gradingItem}>
                        <Text style={styles.gradingLabel}>Assignments</Text>
                        <Text style={styles.gradingValue}>{classDetails.grading.assignments}%</Text>
                    </View>
                    <View style={styles.gradingItem}>
                        <Text style={styles.gradingLabel}>Midterm</Text>
                        <Text style={styles.gradingValue}>{classDetails.grading.midterm}%</Text>
                    </View>
                    <View style={styles.gradingItem}>
                        <Text style={styles.gradingLabel}>Final</Text>
                        <Text style={styles.gradingValue}>{classDetails.grading.final}%</Text>
                    </View>
                    <View style={styles.gradingItem}>
                        <Text style={styles.gradingLabel}>Participation</Text>
                        <Text style={styles.gradingValue}>{classDetails.grading.participation}%</Text>
                    </View>
                </View>
            </Card>

            {/* Lecturer Details */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Lecturer Information</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{`${classDetails.lecturer.firstName} ${classDetails.lecturer.lastName}`}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{classDetails.lecturer.email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Office:</Text>
                    <Text style={styles.value}>{classDetails.lecturer.office}</Text>
                </View>
            </Card>

            {/* Announcements */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Announcements</Text>
                {classDetails.announcements.map((announcement) => (
                    <View key={announcement.id} style={styles.announcementItem}>
                        <Text style={styles.announcementTitle}>{announcement.title}</Text>
                        <Text style={styles.announcementDate}>{announcement.date}</Text>
                        <Text style={styles.announcementContent}>{announcement.content}</Text>
                    </View>
                ))}
            </Card>

            {/* Course Materials */}
            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Course Materials</Text>
                {classDetails.materials.map((material) => (
                    <TouchableOpacity
                        key={material.id}
                        style={styles.materialItem}
                        onPress={() => {
                            // TODO: Implement material download/view
                        }}
                    >
                        <View style={styles.materialInfo}>
                            <Text style={styles.materialTitle}>{material.title}</Text>
                            <Text style={styles.materialMeta}>
                                {material.type} • {material.uploadDate.toLocaleDateString()}
                            </Text>
                        </View>
                        <Text style={styles.downloadText}>Download</Text>
                    </TouchableOpacity>
                ))}
            </Card>
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
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.textSecondary,
    },
    section: {
        margin: 16,
        padding: 16,
    },
    courseName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    courseCode: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    objectiveItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    bulletPoint: {
        fontSize: 16,
        color: colors.primary,
        marginRight: 8,
    },
    objectiveText: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    prerequisiteItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    prerequisiteText: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    gradingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    gradingItem: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 8,
    },
    gradingLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    gradingValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 80,
        fontSize: 16,
        color: colors.textSecondary,
    },
    value: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    announcementItem: {
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    announcementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    announcementDate: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    announcementContent: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    materialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    materialInfo: {
        flex: 1,
    },
    materialTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    materialMeta: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    downloadText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
    },
}); 