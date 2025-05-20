import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/class_provider.dart';
import '../../domain/entities/class_entity.dart';
import '../../../class_management/domain/entities/class_schedule.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';

class CreateClassScreen extends ConsumerStatefulWidget {
  const CreateClassScreen({super.key});

  @override
  ConsumerState<CreateClassScreen> createState() => _CreateClassScreenState();
}

class _CreateClassScreenState extends ConsumerState<CreateClassScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _codeController = TextEditingController();
  final _dayController = TextEditingController();
  final _startTimeController = TextEditingController();
  final _endTimeController = TextEditingController();
  bool _isRecurring = false;
  final List<String> _selectedDays = [];
  final _endDateController = TextEditingController();

  static const List<String> _weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _codeController.dispose();
    _dayController.dispose();
    _startTimeController.dispose();
    _endTimeController.dispose();
    _endDateController.dispose();
    super.dispose();
  }

  Future<void> _selectTime(
      BuildContext context, TextEditingController controller) async {
    final TimeOfDay? time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (!mounted) return;
    if (time != null) {
      controller.text = time.format(context);
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? date = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (!mounted) return;
    if (date != null) {
      _endDateController.text = date.toIso8601String().split('T')[0];
    }
  }

  Future<void> _createClass() async {
    if (_formKey.currentState?.validate() ?? false) {
      final user = ref.read(authProvider).value;
      if (user == null) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('You must be logged in to create a class')),
        );
        return;
      }

      final schedule = ClassSchedule(
        day: _isRecurring ? _selectedDays.first : _dayController.text,
        startTime: _startTimeController.text,
        endTime: _endTimeController.text,
        isRecurring: _isRecurring,
        recurringDays: _selectedDays,
        endDate: _isRecurring ? _endDateController.text : null,
      );

      if (!schedule.isValid) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Invalid schedule configuration')),
        );
        return;
      }

      // Check for schedule conflicts
      final existingClasses = await ref.read(classListProvider.future);
      for (final existingClass in existingClasses) {
        final existingSchedule = ClassSchedule.fromJson(existingClass.schedule);
        if (schedule.hasConflict(existingSchedule)) {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
                content: Text('Schedule conflicts with ${existingClass.name}')),
          );
          return;
        }
      }

      final newClass = ClassEntity(
        id: '', // Will be set by the server
        name: _nameController.text,
        code: _codeController.text,
        lecturerId: user.id,
        schedule: schedule.toJson(),
      );

      await ref.read(classActionsProvider.notifier).createClass(newClass);
      if (mounted) {
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Class'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Name'),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter a name' : null,
              ),
              TextFormField(
                controller: _codeController,
                decoration: const InputDecoration(labelText: 'Code'),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter a code' : null,
              ),
              SwitchListTile(
                title: const Text('Recurring Schedule'),
                value: _isRecurring,
                onChanged: (value) => setState(() => _isRecurring = value),
              ),
              if (!_isRecurring) ...[
                TextFormField(
                  controller: _dayController,
                  decoration: const InputDecoration(labelText: 'Day'),
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return 'Please enter a day';
                    }
                    if (!_weekDays.contains(value)) {
                      return 'Please enter a valid day of the week';
                    }
                    return null;
                  },
                ),
              ] else ...[
                const Text('Select Days:'),
                Wrap(
                  spacing: 8,
                  children: _weekDays.map((day) {
                    return FilterChip(
                      label: Text(day),
                      selected: _selectedDays.contains(day),
                      onSelected: (selected) {
                        setState(() {
                          if (selected) {
                            _selectedDays.add(day);
                          } else {
                            _selectedDays.remove(day);
                          }
                        });
                      },
                    );
                  }).toList(),
                ),
                if (_selectedDays.isEmpty)
                  const Padding(
                    padding: EdgeInsets.only(top: 8.0),
                    child: Text(
                      'Please select at least one day',
                      style: TextStyle(color: Colors.red),
                    ),
                  ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _endDateController,
                  decoration: const InputDecoration(
                    labelText: 'End Date (Optional)',
                    suffixIcon: Icon(Icons.calendar_today),
                  ),
                  readOnly: true,
                  onTap: () => _selectDate(context),
                  validator: (value) {
                    if (_isRecurring && (value?.isEmpty ?? true)) {
                      return 'Please select an end date for recurring schedule';
                    }
                    return null;
                  },
                ),
              ],
              TextFormField(
                controller: _startTimeController,
                decoration: const InputDecoration(
                  labelText: 'Start Time',
                  suffixIcon: Icon(Icons.access_time),
                ),
                readOnly: true,
                onTap: () => _selectTime(context, _startTimeController),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please select start time' : null,
              ),
              TextFormField(
                controller: _endTimeController,
                decoration: const InputDecoration(
                  labelText: 'End Time',
                  suffixIcon: Icon(Icons.access_time),
                ),
                readOnly: true,
                onTap: () => _selectTime(context, _endTimeController),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please select end time' : null,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _createClass,
                child: const Text('Create Class'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
