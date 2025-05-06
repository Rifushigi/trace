 import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/class_provider.dart';
import '../../data/models/class_model.dart';

class UpdateClassScreen extends ConsumerStatefulWidget {
  final ClassModel classModel;

  const UpdateClassScreen({super.key, required this.classModel});

  @override
  ConsumerState<UpdateClassScreen> createState() => _UpdateClassScreenState();
}

class _UpdateClassScreenState extends ConsumerState<UpdateClassScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _codeController;
  late final TextEditingController _lecturerIdController;
  late final TextEditingController _dayController;
  late final TextEditingController _startTimeController;
  late final TextEditingController _endTimeController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.classModel.name);
    _codeController = TextEditingController(text: widget.classModel.code);
    _lecturerIdController = TextEditingController(text: widget.classModel.lecturerId);
    _dayController = TextEditingController(text: widget.classModel.schedule.day);
    _startTimeController = TextEditingController(text: widget.classModel.schedule.startTime);
    _endTimeController = TextEditingController(text: widget.classModel.schedule.endTime);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _codeController.dispose();
    _lecturerIdController.dispose();
    _dayController.dispose();
    _startTimeController.dispose();
    _endTimeController.dispose();
    super.dispose();
  }

  Future<void> _updateClass() async {
    if (_formKey.currentState?.validate() ?? false) {
      final schedule = ClassSchedule(
        day: _dayController.text,
        startTime: _startTimeController.text,
        endTime: _endTimeController.text,
      );

      final updatedClass = ClassModel(
        id: widget.classModel.id,
        name: _nameController.text,
        code: _codeController.text,
        lecturerId: _lecturerIdController.text,
        schedule: schedule,
      );

      await ref.read(classActionsProvider.notifier).updateClass(widget.classModel.id, updatedClass);
      if (mounted) {
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Update Class'),
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
                validator: (value) => value?.isEmpty ?? true ? 'Please enter a name' : null,
              ),
              TextFormField(
                controller: _codeController,
                decoration: const InputDecoration(labelText: 'Code'),
                validator: (value) => value?.isEmpty ?? true ? 'Please enter a code' : null,
              ),
              TextFormField(
                controller: _lecturerIdController,
                decoration: const InputDecoration(labelText: 'Lecturer ID'),
                validator: (value) => value?.isEmpty ?? true ? 'Please enter a lecturer ID' : null,
              ),
              TextFormField(
                controller: _dayController,
                decoration: const InputDecoration(labelText: 'Day'),
                validator: (value) => value?.isEmpty ?? true ? 'Please enter a day' : null,
              ),
              TextFormField(
                controller: _startTimeController,
                decoration: const InputDecoration(labelText: 'Start Time'),
                validator: (value) => value?.isEmpty ?? true ? 'Please enter a start time' : null,
              ),
              TextFormField(
                controller: _endTimeController,
                decoration: const InputDecoration(labelText: 'End Time'),
                validator: (value) => value?.isEmpty ?? true ? 'Please enter an end time' : null,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _updateClass,
                child: const Text('Update Class'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
