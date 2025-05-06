import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/constants/role_constants.dart';
import '../../../authentication/providers/auth_provider.dart';
import '../providers/attendance_provider.dart';
import '../../../../utils/logger.dart';
import '../../../../common/appbar/role_app_bar.dart';
import '../../../../common/shared_widgets/app_card.dart';
import '../../../../common/shared_widgets/empty_state.dart';
import '../../../../common/styles/app_styles.dart';

enum StudentAttendanceFilter {
  all,
  present,
  absent,
}

class StudentAttendanceScreen extends ConsumerStatefulWidget {
  final String classId;
  final String className;

  const StudentAttendanceScreen({
    super.key,
    required this.classId,
    required this.className,
  });

  @override
  ConsumerState<StudentAttendanceScreen> createState() => _StudentAttendanceScreenState();
}

class _StudentAttendanceScreenState extends ConsumerState<StudentAttendanceScreen> {
  final TextEditingController _searchController = TextEditingController();
  StudentAttendanceFilter _currentFilter = StudentAttendanceFilter.all;
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<AttendanceRecord> _filterAndSearchHistory(List<AttendanceRecord> history) {
    return history.where((record) {
      // Apply status filter
      if (_currentFilter == StudentAttendanceFilter.present && !record.isPresent) return false;
      if (_currentFilter == StudentAttendanceFilter.absent && record.isPresent) return false;

      // Apply search query
      if (_searchQuery.isEmpty) return true;
      final query = _searchQuery.toLowerCase();
      return _formatDate(record.date).toLowerCase().contains(query) ||
          _formatTime(record.date).toLowerCase().contains(query);
    }).toList();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user!;

    // Ensure only students can access
    if (user.role != RoleConstants.studentRole) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Access Denied'),
        ),
        body: const Center(
          child: Text('Only students can access this screen.'),
        ),
      );
    }

    final activeSessionAsync = ref.watch(activeSessionProvider(widget.classId));
    final studentAttendanceAsync = ref.watch(studentAttendanceProvider(widget.classId));

    return Scaffold(
      appBar: StudentAppBar(
        title: 'Attendance',
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.invalidate(activeSessionProvider(widget.classId));
              ref.invalidate(studentAttendanceProvider(widget.classId));
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(activeSessionProvider(widget.classId));
          ref.invalidate(studentAttendanceProvider(widget.classId));
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: EdgeInsets.all(AppConstants.defaultPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Class Info Card
              AppCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.className,
                      style: AppStyles.titleLarge,
                    ),
                    SizedBox(height: AppConstants.defaultSpacing),
                    Text(
                      'Class ID: ${widget.classId}',
                      style: AppStyles.bodyMedium,
                    ),
                  ],
                ),
              ),
              SizedBox(height: AppConstants.defaultPadding * 1.5),

              // Active Session Section
              activeSessionAsync.when(
                data: (session) {
                  if (session == null) {
                    return EmptyState(
                      message: 'No active attendance session',
                      icon: Icons.event_busy,
                    );
                  }

                  return AppCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Active Session',
                              style: AppStyles.titleLarge,
                            ),
                            Text(
                              'Started: ${_formatTime(session.startTime)}',
                              style: AppStyles.bodyMedium,
                            ),
                          ],
                        ),
                        SizedBox(height: AppConstants.defaultPadding),
                        Row(
                          children: [
                            Expanded(
                              child: _StatItem(
                                label: 'Present',
                                value: session.presentCount.toString(),
                                icon: Icons.check_circle,
                                color: Colors.green,
                              ),
                            ),
                            Expanded(
                              child: _StatItem(
                                label: 'Absent',
                                value: session.absentCount.toString(),
                                icon: Icons.cancel,
                                color: Colors.red,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, stackTrace) {
                  Logger.error('Failed to load active session', error, stackTrace);
                  return EmptyState(
                    message: 'Failed to load active session',
                    icon: Icons.error_outline,
                    onRetry: () {
                      ref.invalidate(activeSessionProvider(widget.classId));
                    },
                  );
                },
              ),

              SizedBox(height: AppConstants.defaultPadding * 1.5),

              // Attendance History Section
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'My Attendance History',
                        style: AppStyles.titleLarge,
                      ),
                      PopupMenuButton<StudentAttendanceSortOption>(
                        icon: const Icon(Icons.sort),
                        tooltip: 'Sort by',
                        onSelected: (option) {
                          // Sort the list based on the selected option
                          ref.read(studentAttendanceProvider(widget.classId).notifier).sortHistory(option);
                        },
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: StudentAttendanceSortOption.dateDesc,
                            child: Row(
                              children: [
                                Icon(Icons.arrow_downward),
                                SizedBox(width: 8),
                                Text('Newest First'),
                              ],
                            ),
                          ),
                          const PopupMenuItem(
                            value: StudentAttendanceSortOption.dateAsc,
                            child: Row(
                              children: [
                                Icon(Icons.arrow_upward),
                                SizedBox(width: 8),
                                Text('Oldest First'),
                              ],
                            ),
                          ),
                          const PopupMenuItem(
                            value: StudentAttendanceSortOption.statusPresent,
                            child: Row(
                              children: [
                                Icon(Icons.check_circle),
                                SizedBox(width: 8),
                                Text('Present First'),
                              ],
                            ),
                          ),
                          const PopupMenuItem(
                            value: StudentAttendanceSortOption.statusAbsent,
                            child: Row(
                              children: [
                                Icon(Icons.cancel),
                                SizedBox(width: 8),
                                Text('Absent First'),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: AppConstants.defaultSpacing),

                  // Search and Filter Bar
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          decoration: InputDecoration(
                            hintText: 'Search by date or time',
                            prefixIcon: const Icon(Icons.search),
                            suffixIcon: _searchQuery.isNotEmpty
                                ? IconButton(
                                    icon: const Icon(Icons.clear),
                                    onPressed: () {
                                      setState(() {
                                        _searchController.clear();
                                        _searchQuery = '';
                                      });
                                    },
                                  )
                                : null,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(
                                AppConstants.defaultRadius,
                              ),
                            ),
                          ),
                          onChanged: (value) {
                            setState(() {
                              _searchQuery = value;
                            });
                          },
                        ),
                      ),
                      SizedBox(width: AppConstants.defaultSpacing),
                      PopupMenuButton<StudentAttendanceFilter>(
                        icon: const Icon(Icons.filter_list),
                        tooltip: 'Filter by status',
                        initialValue: _currentFilter,
                        onSelected: (filter) {
                          setState(() {
                            _currentFilter = filter;
                          });
                        },
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: StudentAttendanceFilter.all,
                            child: Row(
                              children: [
                                Icon(Icons.history),
                                SizedBox(width: 8),
                                Text('All Records'),
                              ],
                            ),
                          ),
                          const PopupMenuItem(
                            value: StudentAttendanceFilter.present,
                            child: Row(
                              children: [
                                Icon(Icons.check_circle, color: Colors.green),
                                SizedBox(width: 8),
                                Text('Present Only'),
                              ],
                            ),
                          ),
                          const PopupMenuItem(
                            value: StudentAttendanceFilter.absent,
                            child: Row(
                              children: [
                                Icon(Icons.cancel, color: Colors.red),
                                SizedBox(width: 8),
                                Text('Absent Only'),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: AppConstants.defaultSpacing),

                  // Filter indicator
                  if (_currentFilter != StudentAttendanceFilter.all || _searchQuery.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Wrap(
                        spacing: 8,
                        children: [
                          if (_currentFilter != StudentAttendanceFilter.all)
                            Chip(
                              label: Text(
                                _currentFilter == StudentAttendanceFilter.present
                                    ? 'Present Only'
                                    : 'Absent Only',
                              ),
                              deleteIcon: const Icon(Icons.close, size: 16),
                              onDeleted: () {
                                setState(() {
                                  _currentFilter = StudentAttendanceFilter.all;
                                });
                              },
                            ),
                          if (_searchQuery.isNotEmpty)
                            Chip(
                              label: Text('Search: $_searchQuery'),
                              deleteIcon: const Icon(Icons.close, size: 16),
                              onDeleted: () {
                                setState(() {
                                  _searchController.clear();
                                  _searchQuery = '';
                                });
                              },
                            ),
                        ],
                      ),
                    ),

                  studentAttendanceAsync.when(
                    data: (attendance) {
                      if (attendance.isEmpty) {
                        return EmptyState(
                          message: 'No attendance history available',
                          icon: Icons.history,
                        );
                      }

                      final filteredAttendance = _filterAndSearchHistory(attendance);
                      if (filteredAttendance.isEmpty) {
                        return EmptyState(
                          message: 'No records match your search criteria',
                          icon: Icons.search_off,
                        );
                      }

                      return ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: filteredAttendance.length,
                        itemBuilder: (context, index) {
                          final record = filteredAttendance[index];
                          return AppCard(
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: record.isPresent
                                    ? Colors.green
                                    : Colors.red,
                                child: Icon(
                                  record.isPresent
                                      ? Icons.check
                                      : Icons.close,
                                  color: Colors.white,
                                ),
                              ),
                              title: Text(
                                'Session ${index + 1}',
                                style: AppStyles.titleMedium,
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Date: ${_formatDate(record.date)}',
                                    style: AppStyles.bodyMedium,
                                  ),
                                  Text(
                                    'Time: ${_formatTime(record.date)}',
                                    style: AppStyles.bodyMedium,
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    },
                    loading: () => const Center(child: CircularProgressIndicator()),
                    error: (error, stackTrace) {
                      Logger.error('Failed to load attendance history', error, stackTrace);
                      return EmptyState(
                        message: 'Failed to load attendance history',
                        icon: Icons.error_outline,
                        onRetry: () {
                          ref.invalidate(studentAttendanceProvider(widget.classId));
                        },
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  String _formatDate(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
  }
} 