import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/class_provider.dart';
import '../../data/models/class_model.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../common/shared_widgets/toast.dart';

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
    try {
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
    } catch (e) {
      // If time parsing fails, return false to exclude the class
      return false;
    }
  }

  bool _matchesFilters(ClassModel classModel) {
    final schedule = classModel.schedule;
    final day = schedule['day'] as String? ?? 'N/A';
    final startTime = schedule['startTime'] as String? ?? 'N/A';

    if (_selectedDay != 'Any' && day != _selectedDay) {
      return false;
    }

    if (_selectedTimeSlot != 'Any') {
      if (!_isTimeInSlot(startTime, _selectedTimeSlot)) {
        return false;
      }
    }

    return true;
  }

  @override
  Widget build(BuildContext context) {
    final searchResultsAsync =
        ref.watch(searchClassesProvider(_searchController.text));

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
                        if (mounted) {
                          setState(() {});
                        }
                      },
                    ),
                  ),
                  onChanged: (value) {
                    if (mounted) {
                      setState(() {});
                    }
                  },
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
                          if (mounted && value != null) {
                            setState(() {
                              _selectedDay = value;
                            });
                          }
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
                          if (mounted && value != null) {
                            setState(() {
                              _selectedTimeSlot = value;
                            });
                          }
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
                    if (mounted) {
                      setState(() {
                        _showOnlyAvailable = value;
                      });
                    }
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
                    final schedule = classModel.schedule;
                    final day = schedule['day'] as String? ?? 'N/A';
                    final startTime = schedule['startTime'] as String? ?? 'N/A';
                    final endTime = schedule['endTime'] as String? ?? 'N/A';

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
                            Text('Schedule: $day $startTime - $endTime'),
                          ],
                        ),
                        trailing: ElevatedButton(
                          onPressed: () async {
                            final user = ref.read(authProvider).value;
                            if (user != null) {
                              const LoadingOverlay(
                                isLoading: true,
                                message: 'Enrolling in class...',
                                child: SizedBox(),
                              );

                              try {
                                await ref
                                    .read(classActionsProvider.notifier)
                                    .enrollStudent(classModel.id, user.id);
                                if (mounted) {
                                  Toast.show(
                                    context,
                                    message: 'Successfully enrolled in class',
                                    type: ToastType.success,
                                  );
                                }
                              } catch (error) {
                                if (mounted) {
                                  Toast.show(
                                    context,
                                    message:
                                        'Failed to enroll: ${error.toString()}',
                                    type: ToastType.error,
                                  );
                                }
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
              error: (error, stack) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Error loading classes',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      error.toString(),
                      style: Theme.of(context)
                          .textTheme
                          .bodyMedium
                          ?.copyWith(color: Colors.red),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => ref.refresh(
                          searchClassesProvider(_searchController.text)),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
