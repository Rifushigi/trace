import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/constants/validation_constants.dart';
import '../providers/attendance_provider.dart';
import '../../../../common/styles/app_styles.dart';
import 'package:trace/core/services/haptic_service.dart';

class StudentCheckinScreen extends ConsumerStatefulWidget {
  final String sessionId;

  const StudentCheckinScreen({super.key, required this.sessionId});

  @override
  ConsumerState<StudentCheckinScreen> createState() => _StudentCheckinScreenState();
}

class _StudentCheckinScreenState extends ConsumerState<StudentCheckinScreen> {
  final _formKey = GlobalKey<FormState>();
  final _studentIdController = TextEditingController();
  bool _isLoading = false;

  Future<void> _checkIn() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        await HapticService.actionFeedback();
        await ref.read(attendanceActionsProvider.notifier).checkIn(
          widget.sessionId,
          _studentIdController.text,
        );
        if (mounted) {
          await HapticService.successFeedback();
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Check-in successful')),
          );
          Navigator.pop(context);
        }
      } catch (e) {
        if (mounted) {
          await HapticService.errorFeedback();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: ${e.toString()}')),
          );
        }
      } finally {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    }
  }

  @override
  void dispose() {
    _studentIdController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Check-in'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.all(AppConstants.defaultPadding),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _studentIdController,
                    decoration: const InputDecoration(
                      labelText: 'Student ID',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return ValidationConstants.requiredField;
                      }
                      if (!ValidationConstants.matricNumberRegex.hasMatch(value)) {
                        return ValidationConstants.invalidMatricNumber;
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: AppConstants.defaultSpacing),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : () async {
                        await HapticService.actionFeedback();
                        await _checkIn();
                      },
                      child: _isLoading
                          ? const CircularProgressIndicator()
                          : const Text('Check In'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
} 