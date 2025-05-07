import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../providers/attendance_provider.dart';
import '../../data/models/attendance_model.dart';
import '../../../../common/styles/app_styles.dart';

class AttendanceSessionScreen extends ConsumerStatefulWidget {
  final String classId;

  const AttendanceSessionScreen({super.key, required this.classId});

  @override
  ConsumerState<AttendanceSessionScreen> createState() =>
      _AttendanceSessionScreenState();
}

class _AttendanceSessionScreenState
    extends ConsumerState<AttendanceSessionScreen> {
  String? _sessionId;
  List<AttendanceModel> _attendanceList = [];
  bool _isLoading = false;

  Future<void> _startSession() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final startTime = DateTime.now();
      final endTime =
          startTime.add(const Duration(hours: 2)); // Example: 2-hour session
      await ref
          .read(attendanceActionsProvider.notifier)
          .startSession(widget.classId);
      // TODO: Store sessionId from response
      setState(() {
        _sessionId =
            'dummy_session_id'; // Replace with actual sessionId from API
      });
    } catch (e) {
      if (mounted) {
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

  Future<void> _endSession() async {
    if (_sessionId != null) {
      setState(() {
        _isLoading = true;
      });

      try {
        await ref
            .read(attendanceActionsProvider.notifier)
            .endSession(_sessionId!);
        setState(() {
          _sessionId = null;
          _attendanceList = [];
        });
      } catch (e) {
        if (mounted) {
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

  Future<void> _loadSessionAttendance() async {
    if (_sessionId != null) {
      setState(() {
        _isLoading = true;
      });

      try {
        final attendance = await ref
            .read(attendanceActionsProvider.notifier)
            .getAttendanceHistory(widget.classId);
        setState(() {
          _attendanceList = attendance;
        });
      } catch (e) {
        if (mounted) {
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
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance Session'),
      ),
      body: Padding(
        padding: EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          children: [
            if (_sessionId == null)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _startSession,
                  child: _isLoading
                      ? const CircularProgressIndicator()
                      : const Text('Start Session'),
                ),
              )
            else
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _endSession,
                  child: _isLoading
                      ? const CircularProgressIndicator()
                      : const Text('End Session'),
                ),
              ),
            SizedBox(height: AppConstants.defaultSpacing),
            if (_sessionId != null)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _loadSessionAttendance,
                  child: _isLoading
                      ? const CircularProgressIndicator()
                      : const Text('Load Attendance'),
                ),
              ),
            SizedBox(height: AppConstants.defaultSpacing),
            Expanded(
              child: ListView.builder(
                itemCount: _attendanceList.length,
                itemBuilder: (context, index) {
                  final attendance = _attendanceList[index];
                  return Card(
                    margin: EdgeInsets.symmetric(
                        vertical: AppConstants.defaultSpacing / 2),
                    child: ListTile(
                      title: Text(
                        'Student ID: ${attendance.studentId}',
                        style: AppStyles.titleMedium,
                      ),
                      subtitle: Text(
                        'Status: ${attendance.status}',
                        style: AppStyles.bodyMedium,
                      ),
                      trailing: Text(
                        attendance.timestamp.toString(),
                        style: AppStyles.bodySmall,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
