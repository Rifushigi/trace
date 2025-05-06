import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../providers/attendance_provider.dart';
import '../../data/models/attendance_model.dart';
import '../../../../common/styles/app_styles.dart';

class AttendanceReportScreen extends ConsumerStatefulWidget {
  final String classId;

  const AttendanceReportScreen({super.key, required this.classId});

  @override
  ConsumerState<AttendanceReportScreen> createState() => _AttendanceReportScreenState();
}

class _AttendanceReportScreenState extends ConsumerState<AttendanceReportScreen> {
  List<AttendanceModel> _attendanceList = [];
  bool _isLoading = false;
  Map<String, int> _attendanceStats = {};

  @override
  void initState() {
    super.initState();
    _loadAttendanceData();
  }

  Future<void> _loadAttendanceData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final attendance = await ref.read(attendanceActionsProvider.notifier).getClassAttendance(widget.classId);
      setState(() {
        _attendanceList = attendance;
        _calculateStats();
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

  void _calculateStats() {
    _attendanceStats = {
      'present': 0,
      'absent': 0,
      'late': 0,
    };

    for (final attendance in _attendanceList) {
      _attendanceStats[attendance.status] = (_attendanceStats[attendance.status] ?? 0) + 1;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance Report'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadAttendanceData,
              child: SingleChildScrollView(
                padding: EdgeInsets.all(AppConstants.defaultPadding),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Attendance Statistics',
                      style: AppStyles.titleLarge,
                    ),
                    SizedBox(height: AppConstants.defaultSpacing),
                    Card(
                      child: Padding(
                        padding: EdgeInsets.all(AppConstants.defaultPadding),
                        child: Column(
                          children: [
                            _buildStatRow('Present', _attendanceStats['present'] ?? 0),
                            const Divider(),
                            _buildStatRow('Absent', _attendanceStats['absent'] ?? 0),
                            const Divider(),
                            _buildStatRow('Late', _attendanceStats['late'] ?? 0),
                          ],
                        ),
                      ),
                    ),
                    SizedBox(height: AppConstants.defaultPadding * 1.5),
                    Text(
                      'Recent Attendance',
                      style: AppStyles.titleLarge,
                    ),
                    SizedBox(height: AppConstants.defaultSpacing),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _attendanceList.length,
                      itemBuilder: (context, index) {
                        final attendance = _attendanceList[index];
                        return ListTile(
                          title: Text('Student ID: ${attendance.studentId}'),
                          subtitle: Text('Status: ${attendance.status}'),
                          trailing: Text(attendance.timestamp.toString()),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildStatRow(String label, int count) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: AppConstants.defaultSpacing),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: AppStyles.titleMedium,
          ),
          Text(
            count.toString(),
            style: AppStyles.titleMedium.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
} 