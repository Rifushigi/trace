import { FilterModalProps } from '@/shared/types/schedule';
import { observer } from 'mobx-react-lite';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/shared/constants/theme';
import React from 'react';

export const FilterModal = observer(
  ({ visible, onClose, selectedFilter, uniqueValues, tempFilters, onFilterSelect, onDone, onClear }: FilterModalProps) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Schedule</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterList} key={selectedFilter || 'filter-list'}>
            {selectedFilter === 'date' && (
              <>
                {uniqueValues.dates.map(date => (
                  <TouchableOpacity
                    key={date}
                    style={[styles.filterOption, tempFilters.date.includes(date) && styles.selectedFilter]}
                    onPress={() => onFilterSelect('date', date)}
                  >
                    <Text
                      style={[styles.filterOptionText, tempFilters.date.includes(date) && styles.selectedFilterText]}
                    >
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {selectedFilter === 'lecturer' && (
              <>
                {uniqueValues.lecturers.map(lecturer => (
                  <TouchableOpacity
                    key={lecturer}
                    style={[styles.filterOption, tempFilters.lecturer.includes(lecturer) && styles.selectedFilter]}
                    onPress={() => onFilterSelect('lecturer', lecturer)}
                  >
                    <Text
                      style={[styles.filterOptionText, tempFilters.lecturer.includes(lecturer) && styles.selectedFilterText]}
                    >
                      {lecturer}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {selectedFilter === 'location' && (
              <>
                {uniqueValues.locations.map(location => (
                  <TouchableOpacity
                    key={location}
                    style={[styles.filterOption, tempFilters.location.includes(location) && styles.selectedFilter]}
                    onPress={() => onFilterSelect('location', location)}
                  >
                    <Text
                      style={[styles.filterOptionText, tempFilters.location.includes(location) && styles.selectedFilterText]}
                    >
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={onClear}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneButton} onPress={onDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
    modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  filterList: {
    maxHeight: 300,
  },
  filterOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.background,
  },
  selectedFilter: {
    backgroundColor: colors.primary + '15',
    borderWidth: 1,
    borderColor: colors.primary,
  },  
  filterOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedFilterText: {
    color: colors.primary,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: colors.text,
  },
    doneButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
})