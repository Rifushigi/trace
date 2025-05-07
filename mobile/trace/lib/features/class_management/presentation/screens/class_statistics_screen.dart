import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../providers/class_provider.dart';
import '../../data/models/class_statistics.dart';

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
                const SizedBox(height: 24),
                _buildStudentAttendanceList(statistics),
                const SizedBox(height: 24),
                _buildRecentSessionsList(statistics),
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
          title: 'Total Sessions',
          value: statistics.totalSessions.toString(),
          icon: Icons.event,
        ),
        _SummaryCard(
          title: 'Average Attendance',
          value: '${(statistics.averageAttendance * 100).toStringAsFixed(1)}%',
          icon: Icons.analytics,
        ),
        _SummaryCard(
          title: 'Recent Rate',
          value: statistics.recentSessions.isNotEmpty
              ? '${(statistics.recentSessions.first.attendanceRate * 100).toStringAsFixed(1)}%'
              : 'N/A',
          icon: Icons.trending_up,
        ),
      ],
    );
  }

  Widget _buildAttendanceChart(
      BuildContext context, ClassStatistics statistics) {
    if (statistics.attendanceByDay.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Text('No attendance data available'),
          ),
        ),
      );
    }

    final maxAttendance = statistics.attendanceByDay.values
        .reduce((a, b) => a > b ? a : b)
        .toDouble();
    final days = statistics.attendanceByDay.keys.toList();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Attendance by Day',
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
                  barGroups: statistics.attendanceByDay.entries.map((entry) {
                    return BarChartGroupData(
                      x: days.indexOf(entry.key),
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
                          if (index >= 0 && index < days.length) {
                            return Text(
                              days[index],
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
                  borderData: FlBorderData(show: false),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentAttendanceList(ClassStatistics statistics) {
    if (statistics.attendanceByStudent.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Text('No student attendance data available'),
          ),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Student Attendance',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: statistics.attendanceByStudent.length,
              itemBuilder: (context, index) {
                final entry =
                    statistics.attendanceByStudent.entries.elementAt(index);
                return ListTile(
                  title: Text(entry.key),
                  trailing: Text(
                    '${(entry.value * 100).toStringAsFixed(1)}%',
                    style: TextStyle(
                      color: entry.value >= 0.75
                          ? Colors.green
                          : entry.value >= 0.5
                              ? Colors.orange
                              : Colors.red,
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentSessionsList(ClassStatistics statistics) {
    if (statistics.recentSessions.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Center(
            child: Text('No recent sessions available'),
          ),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Recent Sessions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: statistics.recentSessions.length,
              itemBuilder: (context, index) {
                final session = statistics.recentSessions[index];
                return ListTile(
                  title: Text(session.date.toString().split(' ')[0]),
                  subtitle: Text(
                    'Present: ${session.presentCount} | Total: ${session.totalCount}',
                  ),
                  trailing: Text(
                    '${(session.attendanceRate * 100).toStringAsFixed(1)}%',
                    style: TextStyle(
                      color: session.attendanceRate >= 0.75
                          ? Colors.green
                          : session.attendanceRate >= 0.5
                              ? Colors.orange
                              : Colors.red,
                    ),
                  ),
                );
              },
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
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
