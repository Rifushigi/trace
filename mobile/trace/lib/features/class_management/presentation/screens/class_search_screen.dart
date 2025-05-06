import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/class_provider.dart';
import '../../data/models/class_model.dart';

class ClassSearchScreen extends ConsumerStatefulWidget {
  const ClassSearchScreen({super.key});

  @override
  ConsumerState<ClassSearchScreen> createState() => _ClassSearchScreenState();
}

class _ClassSearchScreenState extends ConsumerState<ClassSearchScreen> {
  final _searchController = TextEditingController();
  String _selectedDay = 'Any';
  String _selectedTimeSlot = 'Any';
  bool _showOnlyAvailable = false;

  final List<String> _days = [
    'Any',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  final List<String> _timeSlots = [
    'Any',
    'Morning (8:00 - 12:00)',
    'Afternoon (12:00 - 16:00)',
    'Evening (16:00 - 20:00)',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  bool _isTimeInSlot(String time, String slot) {
    final timeValue = int.parse(time.split(':')[0]);
    switch (slot) {
      case 'Morning (8:00 - 12:00)':
        return timeValue >= 8 && timeValue < 12;
      case 'Afternoon (12:00 - 16:00)':
        return timeValue >= 12 && timeValue < 16;
      case 'Evening (16:00 - 20:00)':
        return timeValue >= 16 && timeValue < 20;
      default:
        return true;
    }
  }

  bool _matchesFilters(ClassModel classModel) {
    if (_selectedDay != 'Any' && classModel.schedule.day != _selectedDay) {
      return false;
    }

    if (_selectedTimeSlot != 'Any') {
      if (!_isTimeInSlot(classModel.schedule.startTime, _selectedTimeSlot)) {
        return false;
      }
    }

    return true;
  }

  @override
  Widget build(BuildContext context) {
    final searchResultsAsync = ref.watch(searchClassesProvider(_searchController.text));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Classes'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    labelText: 'Search',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchController.clear();
                        setState(() {});
                      },
                    ),
                  ),
                  onChanged: (value) => setState(() {}),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedDay,
                        decoration: const InputDecoration(
                          labelText: 'Day',
                        ),
                        items: _days.map((day) {
                          return DropdownMenuItem(
                            value: day,
                            child: Text(day),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedDay = value!;
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedTimeSlot,
                        decoration: const InputDecoration(
                          labelText: 'Time Slot',
                        ),
                        items: _timeSlots.map((slot) {
                          return DropdownMenuItem(
                            value: slot,
                            child: Text(slot),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedTimeSlot = value!;
                          });
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SwitchListTile(
                  title: const Text('Show Only Available Classes'),
                  value: _showOnlyAvailable,
                  onChanged: (value) {
                    setState(() {
                      _showOnlyAvailable = value;
                    });
                  },
                ),
              ],
            ),
          ),
          Expanded(
            child: searchResultsAsync.when(
              data: (classes) {
                final filteredClasses = classes.where(_matchesFilters).toList();
                
                if (filteredClasses.isEmpty) {
                  return const Center(
                    child: Text('No classes found matching your criteria'),
                  );
                }

                return ListView.builder(
                  itemCount: filteredClasses.length,
                  itemBuilder: (context, index) {
                    final classModel = filteredClasses[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      child: ListTile(
                        title: Text(classModel.name),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Code: ${classModel.code}'),
                            Text(
                              'Schedule: ${classModel.schedule.day} ${classModel.schedule.startTime} - ${classModel.schedule.endTime}',
                            ),
                          ],
                        ),
                        trailing: ElevatedButton(
                          onPressed: () async {
                            final user = ref.read(authProvider).user;
                            if (user != null) {
                              await ref
                                  .read(classActionsProvider.notifier)
                                  .enrollStudent(classModel.id, user.id);
                              if (mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Successfully enrolled in class'),
                                  ),
                                );
                              }
                            }
                          },
                          child: const Text('Enroll'),
                        ),
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (error, stack) => Center(child: Text('Error: $error')),
            ),
          ),
        ],
      ),
    );
  }
} 