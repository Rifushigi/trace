import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../providers/attendance_provider.dart';
import '../../data/models/attendance_model.dart';
import '../../../../common/styles/app_styles.dart';

class AttendanceHistoryScreen extends ConsumerStatefulWidget {
  final String classId;

  const AttendanceHistoryScreen({super.key, required this.classId});

  @override
  ConsumerState<AttendanceHistoryScreen> createState() => _AttendanceHistoryScreenState();
}

class _AttendanceHistoryScreenState extends ConsumerState<AttendanceHistoryScreen> {
  List<AttendanceModel> _attendanceList = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadAttendanceHistory();
  }

  Future<void> _loadAttendanceHistory() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final attendance = await ref.read(attendanceActionsProvider.notifier).getClassAttendance(widget.classId);
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance History'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadAttendanceHistory,
              child: Padding(
                padding: EdgeInsets.all(AppConstants.defaultPadding),
                child: ListView.builder(
                  itemCount: _attendanceList.length,
                  itemBuilder: (context, index) {
                    final attendance = _attendanceList[index];
                    return Card(
                      margin: EdgeInsets.symmetric(vertical: AppConstants.defaultSpacing / 2),
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
            ),
    );
  }
} 