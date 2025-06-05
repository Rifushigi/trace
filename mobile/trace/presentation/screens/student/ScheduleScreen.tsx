import React, { useEffect, useState, useMemo} from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Card } from '@/presentation/components/Card';
import { colors } from '@/shared/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getMockSchedule } from '@/presentation/mocks/scheduleMock';
import { useRefresh } from '@/presentation/hooks/useRefresh';
import { FilterType } from '@/shared/types/schedule';
import { FilterModal } from '@/presentation/components/FilterModal';

export const ScheduleScreen = observer(() => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType | null>(null);
  const [tempFilters, setTempFilters] = useState({
    date: [] as string[],
    lecturer: [] as string[],
    location: [] as string[],
  });
  const [filters, setFilters] = useState({
    date: [] as string[],
    lecturer: [] as string[],
    location: [] as string[],
  });

  const { refreshing, handleRefresh } = useRefresh({
    onRefresh: async () => {
      await fetchSchedule();
    },
  });

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const mockSchedule = getMockSchedule();
      setSchedule(mockSchedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'upcoming':
        return colors.warning;
      case 'completed':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  // Get unique values for filters
  const uniqueValues = useMemo(() => {
    const dates = new Set<string>();
    const lecturers = new Set<string>();
    const locations = new Set<string>();

    schedule.forEach(item => {
      if (item?.schedule?.day) dates.add(item.schedule.day);
      if (item?.lecturer?.firstName && item?.lecturer?.lastName) {
        lecturers.add(`${item.lecturer.firstName} ${item.lecturer.lastName}`);
      }
      if (item?.schedule?.room) locations.add(item.schedule.room);
    });

    return {
      dates: Array.from(dates),
      lecturers: Array.from(lecturers).sort(),
      locations: Array.from(locations).sort(),
    };
  }, [schedule]);

  const filteredSchedule = useMemo(() => {
    return schedule.filter(item => {
      const matchesDate = !filters.date.length || (item?.schedule?.day && filters.date.includes(item.schedule.day));
      const matchesLecturer =
        !filters.lecturer.length ||
        (item?.lecturer?.firstName &&
          item?.lecturer?.lastName &&
          filters.lecturer.includes(`${item.lecturer.firstName} ${item.lecturer.lastName}`));
      const matchesLocation = !filters.location.length || (item?.schedule?.room && filters.location.includes(item.schedule.room));
      return matchesDate && matchesLecturer && matchesLocation;
    });
  }, [schedule, filters]);

  const handleFilterSelect = (type: FilterType, value: string) => {
    setTempFilters(prev => {
      const currentValues = prev[type];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return {
        ...prev,
        [type]: updatedValues,
      };
    });
  };

  const handleDone = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      date: [],
      lecturer: [],
      location: [],
    };
    setFilters(clearedFilters);
    setTempFilters(clearedFilters);
    setShowFilters(false);
  };

  const openFilterModal = (type: FilterType) => {
    setSelectedFilter(type);
    setTempFilters(filters); // Reset temp filters to current filters
    setShowFilters(true);
  };

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
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <Text style={styles.headerSubtitle}>{filteredSchedule.length} classes scheduled</Text>
      </View>

      {/* Filter Section */}
      <Card style={styles.filterSection}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filters.date.length > 0 && styles.activeFilterButton]}
            onPress={() => openFilterModal('date')}
          >
            <MaterialIcons
              name="calendar-today"
              size={20}
              color={filters.date.length > 0 ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.filterButtonText, filters.date.length > 0 && styles.activeFilterText]}>
              {filters.date.length > 0 ? `${filters.date.length} Dates` : 'Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filters.lecturer.length > 0 && styles.activeFilterButton]}
            onPress={() => openFilterModal('lecturer')}
          >
            <MaterialIcons
              name="person"
              size={20}
              color={filters.lecturer.length > 0 ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.filterButtonText, filters.lecturer.length > 0 && styles.activeFilterText]}>
              {filters.lecturer.length > 0 ? `${filters.lecturer.length} Lecturers` : 'Lecturer'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filters.location.length > 0 && styles.activeFilterButton]}
            onPress={() => openFilterModal('location')}
          >
            <MaterialIcons
              name="room"
              size={20}
              color={filters.location.length > 0 ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.filterButtonText, filters.location.length > 0 && styles.activeFilterText]}>
              {filters.location.length > 0 ? `${filters.location.length} Locations` : 'Location'}
            </Text>
          </TouchableOpacity>
        </View>

        {(filters.date.length > 0 || filters.lecturer.length > 0 || filters.location.length > 0) && (
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <MaterialIcons name="clear" size={16} color={colors.primary} />
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* Schedule List */}
      {filteredSchedule.map((classItem, index) => (
        <Card
          key={classItem.id}
          style={{
            ...styles.classCard,
            ...(index === filteredSchedule.length - 1 ? styles.lastCard : {}),
          }}
        >
          <TouchableOpacity
            style={styles.classItem}
            onPress={() =>
              router.push({
                pathname: '/student/class-details',
                params: { classId: classItem.id },
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.classHeader}>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{classItem.course}</Text>
                <Text style={styles.classCode}>{classItem.code}</Text>
              </View>
              <View
                style={[styles.statusBadge, {
                  backgroundColor: getStatusColor(classItem.status) + '15',
                  borderColor: getStatusColor(classItem.status) + '30',
                }]}
              >
                <View
                  style={[styles.statusDot, { backgroundColor: getStatusColor(classItem.status) }]}
                />
                <Text style={[styles.statusText, { color: getStatusColor(classItem.status) }]}>
                  {classItem.status}
                </Text>
              </View>
            </View>

            <View style={styles.classDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="schedule" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {classItem.schedule?.day || 'Not scheduled'} {classItem.schedule?.startTime || ''} -{' '}
                    {classItem.schedule?.endTime || ''}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="room" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{classItem.schedule?.room || 'No room assigned'}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="person" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>
                    {classItem.lecturer?.firstName} {classItem.lecturer?.lastName}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="group" size={16} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{classItem.students?.length || 0} students</Text>
                </View>
              </View>
            </View>

            <View style={styles.attendanceStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{classItem.attendance?.present || 0}</Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{classItem.attendance?.absent || 0}</Text>
                <Text style={styles.statLabel}>Absent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{classItem.attendance?.late || 0}</Text>
                <Text style={styles.statLabel}>Late</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>
      ))}

      {filteredSchedule.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="event" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No classes scheduled</Text>
        </View>
      )}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        selectedFilter={selectedFilter}
        uniqueValues={uniqueValues}
        tempFilters={tempFilters}
        onFilterSelect={handleFilterSelect}
        onDone={handleDone}
        onClear={clearFilters}
      />
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
  filterSection: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  activeFilterButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: colors.primary,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 8,
    gap: 4,
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary,
  },
});