import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../providers/attendance_provider.dart';
import '../../domain/entities/attendance_entity.dart';
import '../../../../common/styles/app_styles.dart';

class AttendanceReportScreen extends ConsumerStatefulWidget {
  final String classId;

  const AttendanceReportScreen({super.key, required this.classId});

  @override
  ConsumerState<AttendanceReportScreen> createState() =>
      _AttendanceReportScreenState();
}

class _AttendanceReportScreenState
    extends ConsumerState<AttendanceReportScreen> {
  List<AttendanceEntity> _attendanceList = [];
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
      final attendanceHistory =
          await ref.read(attendanceHistoryProvider(widget.classId).future);
      setState(() {
        _attendanceList = attendanceHistory;
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
      _attendanceStats[attendance.status] =
          (_attendanceStats[attendance.status] ?? 0) + 1;
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
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Attendance Statistics',
                      style: AppStyles.titleLarge,
                    ),
                    const SizedBox(height: AppConstants.defaultSpacing),
                    Card(
                      child: Padding(
                        padding:
                            const EdgeInsets.all(AppConstants.defaultPadding),
                        child: Column(
                          children: [
                            _buildStatRow(
                                'Present', _attendanceStats['present'] ?? 0),
                            const Divider(),
                            _buildStatRow(
                                'Absent', _attendanceStats['absent'] ?? 0),
                            const Divider(),
                            _buildStatRow(
                                'Late', _attendanceStats['late'] ?? 0),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: AppConstants.defaultPadding * 1.5),
                    const Text(
                      'Recent Attendance',
                      style: AppStyles.titleLarge,
                    ),
                    const SizedBox(height: AppConstants.defaultSpacing),
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
      padding:
          const EdgeInsets.symmetric(vertical: AppConstants.defaultSpacing),
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
