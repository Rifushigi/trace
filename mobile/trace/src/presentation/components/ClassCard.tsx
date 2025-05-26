import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Class } from '../../domain/entities/Class';
import { colors } from '../../shared/constants/theme';

interface ClassCardProps {
  class: Class;
  onPress?: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ class: classData, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.code}>{classData.code}</Text>
        <Text style={styles.name}>{classData.name}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.lecturer}>
          Lecturer: {classData.lecturer.firstName} {classData.lecturer.lastName}
        </Text>
        <Text style={styles.schedule}>
          {classData.schedule.day} • {classData.schedule.startTime} - {classData.schedule.endTime}
        </Text>
        <Text style={styles.room}>Room: {classData.schedule.room}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.students}>
          {classData.students.length} Students
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...colors.shadows.sm,
  },
  header: {
    marginBottom: 12,
  },
  code: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
  },
  details: {
    marginBottom: 12,
  },
  lecturer: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  schedule: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  room: {
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  students: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
}); 