import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/class_provider.dart';
import '../../domain/entities/class_statistics.dart';

class ClassStatisticsScreen extends ConsumerWidget {
  final String classId;

  const ClassStatisticsScreen({super.key, required this.classId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final statisticsAsync = ref.watch(classStatisticsProvider(classId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Class Statistics'),
      ),
      body: statisticsAsync.when(
        data: (statistics) {
          if (statistics == null) {
            return const Center(
              child: Text('No statistics available for this class'),
            );
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSummaryCards(statistics),
                const SizedBox(height: 24),
                _buildAttendanceChart(context, statistics),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.error_outline,
                  size: 48,
                  color: Theme.of(context).colorScheme.error,
                ),
                const SizedBox(height: 16),
                Text(
                  error.toString().contains('Unauthorized')
                      ? 'You do not have permission to view class statistics'
                      : 'Error loading statistics',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                if (error.toString().contains('Unauthorized')) ...[
                  const SizedBox(height: 8),
                  Text(
                    'Only lecturers and administrators can view class statistics',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Theme.of(context).colorScheme.error,
                        ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryCards(ClassStatistics statistics) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      children: [
        _SummaryCard(
          title: 'Total Students',
          value: statistics.totalStudents.toString(),
          icon: Icons.people,
        ),
        _SummaryCard(
          title: 'Present',
          value: statistics.presentCount.toString(),
          icon: Icons.check_circle,
        ),
        _SummaryCard(
          title: 'Absent',
          value: statistics.absentCount.toString(),
          icon: Icons.cancel,
        ),
        _SummaryCard(
          title: 'Late',
          value: statistics.lateCount.toString(),
          icon: Icons.timer,
        ),
      ],
    );
  }

  Widget _buildAttendanceChart(
      BuildContext context, ClassStatistics statistics) {
    if (statistics.attendanceByDate.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Text('No attendance data available'),
          ),
        ),
      );
    }

    final maxAttendance = statistics.attendanceByDate.values
        .reduce((a, b) => a > b ? a : b)
        .toDouble();
    final dates = statistics.attendanceByDate.keys.toList();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Attendance by Date',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  maxY: maxAttendance,
                  barGroups: statistics.attendanceByDate.entries.map((entry) {
                    return BarChartGroupData(
                      x: dates.indexOf(entry.key),
                      barRods: [
                        BarChartRodData(
                          toY: entry.value.toDouble(),
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ],
                    );
                  }).toList(),
                  titlesData: FlTitlesData(
                    show: true,
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          final index = value.toInt();
                          if (index >= 0 && index < dates.length) {
                            return Text(
                              dates[index],
                              style: const TextStyle(fontSize: 10),
                            );
                          }
                          return const SizedBox.shrink();
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 40,
                        getTitlesWidget: (value, meta) {
                          return Text(
                            value.toInt().toString(),
                            style: const TextStyle(fontSize: 10),
                          );
                        },
                      ),
                    ),
                    topTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    rightTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                  ),
                  gridData: const FlGridData(show: false),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;

  const _SummaryCard({
    required this.title,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32),
            const SizedBox(height: 8),
            Text(
              title,
              style: Theme.of(context).textTheme.titleSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
