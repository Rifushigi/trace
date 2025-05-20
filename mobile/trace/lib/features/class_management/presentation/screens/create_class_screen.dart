import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/class_provider.dart';
import '../../domain/entities/class_entity.dart';
import '../../../class_management/domain/entities/class_schedule.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../profile/domain/entities/profile_entity.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../../../../core/constants/validation_constants.dart';

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
  String? _selectedLecturerId;
  List<ProfileEntity> _lecturers = [];

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
  void initState() {
    super.initState();
    _loadLecturers();
  }

  Future<void> _loadLecturers() async {
    try {
      final apiClient = ref.read(apiClientProvider);
      final response = await apiClient.get(Endpoints.admin.lecturers);

      if (response.data['response']['status'] == true) {
        final List<dynamic> usersJson =
            response.data['response']['data']['lecturers'];
        setState(() {
          _lecturers =
              usersJson.map((json) => ProfileEntity.fromJson(json)).toList();
        });
      }
    } catch (e) {
      // Handle error
      debugPrint('Error loading lecturers: $e');
    }
  }

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
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      _endDateController.text = picked.toString().split(' ')[0];
    }
  }

  Future<void> _createClass() async {
    if (!_formKey.currentState!.validate()) return;

    final user = ref.read(authProvider).value;
    if (user == null) return;

    final schedule = ClassSchedule(
      day: _dayController.text,
      startTime: _startTimeController.text,
      endTime: _endTimeController.text,
      isRecurring: _isRecurring,
      recurringDays: _selectedDays,
      endDate: _endDateController.text.isEmpty ? null : _endDateController.text,
    );

    final newClass = ClassEntity(
      id: '', // Will be set by the server
      name: _nameController.text,
      code: _codeController.text,
      lecturerId: _selectedLecturerId ?? user.id,
      schedule: schedule.toJson(),
    );

    await ref.read(classActionsProvider.notifier).createClass(newClass);
    if (mounted) {
      Navigator.pop(context);
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
                decoration: const InputDecoration(
                  labelText: 'Name',
                  border: OutlineInputBorder(),
                ),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please enter a name' : null,
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _codeController,
                decoration: const InputDecoration(
                  labelText: 'Code',
                  border: OutlineInputBorder(),
                  hintText: 'e.g., CSC 401',
                ),
                textCapitalization: TextCapitalization.characters,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return ValidationConstants.requiredField;
                  }
                  if (!ValidationConstants.isValidClassCode(value)) {
                    return ValidationConstants.invalidClassCode;
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(
                  labelText: 'Select Lecturer',
                  border: OutlineInputBorder(),
                ),
                value: _selectedLecturerId,
                items: _lecturers.map((lecturer) {
                  return DropdownMenuItem(
                    value: lecturer.id,
                    child: Text('${lecturer.firstName} ${lecturer.lastName}'),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedLecturerId = value;
                  });
                },
                validator: (value) =>
                    value == null ? 'Please select a lecturer' : null,
              ),
              const SizedBox(height: 24),
              SwitchListTile(
                title: const Text('Recurring Schedule'),
                value: _isRecurring,
                onChanged: (value) => setState(() => _isRecurring = value),
              ),
              if (_isRecurring) ...[
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  children: _weekDays.map((day) {
                    final isSelected = _selectedDays.contains(day);
                    return FilterChip(
                      label: Text(day),
                      selected: isSelected,
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
                const SizedBox(height: 16),
                TextFormField(
                  controller: _endDateController,
                  decoration: const InputDecoration(
                    labelText: 'End Date (Optional)',
                    border: OutlineInputBorder(),
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
              const SizedBox(height: 24),
              TextFormField(
                controller: _startTimeController,
                decoration: const InputDecoration(
                  labelText: 'Start Time',
                  border: OutlineInputBorder(),
                  suffixIcon: Icon(Icons.access_time),
                ),
                readOnly: true,
                onTap: () => _selectTime(context, _startTimeController),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please select start time' : null,
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _endTimeController,
                decoration: const InputDecoration(
                  labelText: 'End Time',
                  border: OutlineInputBorder(),
                  suffixIcon: Icon(Icons.access_time),
                ),
                readOnly: true,
                onTap: () => _selectTime(context, _endTimeController),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Please select end time' : null,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: _createClass,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text('Create Class'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
