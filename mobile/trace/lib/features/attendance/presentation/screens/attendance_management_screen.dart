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
import '../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/skeleton_loading.dart';
import '../../../../common/shared_widgets/refresh_wrapper.dart';
import '../../../../common/providers/connectivity_service_provider.dart';

enum AttendanceHistorySortOption {
  dateDesc,
  dateAsc,
  presentCountDesc,
  presentCountAsc,
}

enum AttendanceHistoryFilter {
  all,
  active,
  ended,
}

class AttendanceManagementScreen extends ConsumerStatefulWidget {
  final String classId;
  final String className;

  const AttendanceManagementScreen({
    super.key,
    required this.classId,
    required this.className,
  });

  @override
  ConsumerState<AttendanceManagementScreen> createState() => _AttendanceManagementScreenState();
}

class _AttendanceManagementScreenState extends ConsumerState<AttendanceManagementScreen> {
  final TextEditingController _searchController = TextEditingController();
  AttendanceHistoryFilter _currentFilter = AttendanceHistoryFilter.all;
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<AttendanceSession> _filterAndSearchHistory(List<AttendanceSession> history) {
    return history.where((session) {
      // Apply status filter
      if (_currentFilter == AttendanceHistoryFilter.active && session.status != 'active') return false;
      if (_currentFilter == AttendanceHistoryFilter.ended && session.status == 'active') return false;

      // Apply search query
      if (_searchQuery.isEmpty) return true;
      final query = _searchQuery.toLowerCase();
      return session.id.toLowerCase().contains(query) ||
          _formatDate(session.startTime).toLowerCase().contains(query) ||
          _formatTime(session.startTime).toLowerCase().contains(query);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final user = authState.user!;
    final attendanceState = ref.watch(attendanceActionsProvider);
    final syncState = ref.watch(attendanceSyncProvider);
    final isOnline = ref.watch(connectivityServiceProvider).isConnected;

    // Ensure only lecturers and admins can access
    if (user.role != RoleConstants.lecturerRole && user.role != RoleConstants.adminRole) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Access Denied'),
        ),
        body: const Center(
          child: Text('Only lecturers and administrators can manage attendance.'),
        ),
      );
    }

    final activeSessionAsync = ref.watch(activeSessionProvider(widget.classId));
    final attendanceHistoryAsync = ref.watch(attendanceHistoryProvider(widget.classId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance Management'),
        actions: [
          if (!isOnline)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: Icon(Icons.cloud_off, color: Colors.orange),
            ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.read(attendanceActionsProvider.notifier).syncPendingCheckIns();
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          if (isOnline) {
            await ref.read(attendanceActionsProvider.notifier).syncPendingCheckIns();
          }
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            if (!isOnline)
              Container(
                padding: const EdgeInsets.all(8),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.orange),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.cloud_off, color: Colors.orange),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'You are offline. Changes will be synced when you are back online.',
                        style: TextStyle(color: Colors.orange[800]),
                      ),
                    ),
                  ],
                ),
              ),
            if (syncState.isLoading)
              const Center(child: CircularProgressIndicator()),
            if (syncState.hasError)
              Container(
                padding: const EdgeInsets.all(8),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error, color: Colors.red),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Error syncing data: ${syncState.error}',
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  ],
                ),
              ),
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
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Start New Session',
                        style: AppStyles.titleLarge,
                      ),
                      SizedBox(height: AppConstants.defaultSpacing),
                      ElevatedButton.icon(
                        onPressed: () {
                          _showStartSessionDialog(context, ref);
                        },
                        icon: const Icon(Icons.play_arrow),
                        label: const Text('Start Attendance Session'),
                      ),
                    ],
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
                      SizedBox(height: AppConstants.defaultPadding),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton.icon(
                            onPressed: () {
                              _showManualCheckInDialog(context, ref, session.id);
                            },
                            icon: const Icon(Icons.person_add),
                            label: const Text('Manual Check-in'),
                          ),
                          SizedBox(width: AppConstants.defaultSpacing),
                          ElevatedButton.icon(
                            onPressed: () {
                              _showEndSessionDialog(context, ref, session.id);
                            },
                            icon: const Icon(Icons.stop),
                            label: const Text('End Session'),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
              loading: () => SkeletonList(
                itemCount: 3,
                itemHeight: 80,
                spacing: AppConstants.defaultPadding,
              ),
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
                      'Attendance History',
                      style: AppStyles.titleLarge,
                    ),
                    PopupMenuButton<AttendanceHistorySortOption>(
                      icon: const Icon(Icons.sort),
                      tooltip: 'Sort by',
                      onSelected: (option) {
                        // Sort the list based on the selected option
                        ref.read(attendanceHistoryProvider(widget.classId).notifier).sortHistory(option);
                      },
                      itemBuilder: (context) => [
                        const PopupMenuItem(
                          value: AttendanceHistorySortOption.dateDesc,
                          child: Row(
                            children: [
                              Icon(Icons.arrow_downward),
                              SizedBox(width: 8),
                              Text('Newest First'),
                            ],
                          ),
                        ),
                        const PopupMenuItem(
                          value: AttendanceHistorySortOption.dateAsc,
                          child: Row(
                            children: [
                              Icon(Icons.arrow_upward),
                              SizedBox(width: 8),
                              Text('Oldest First'),
                            ],
                          ),
                        ),
                        const PopupMenuItem(
                          value: AttendanceHistorySortOption.presentCountDesc,
                          child: Row(
                            children: [
                              Icon(Icons.arrow_downward),
                              SizedBox(width: 8),
                              Text('Most Present'),
                            ],
                          ),
                        ),
                        const PopupMenuItem(
                          value: AttendanceHistorySortOption.presentCountAsc,
                          child: Row(
                            children: [
                              Icon(Icons.arrow_upward),
                              SizedBox(width: 8),
                              Text('Least Present'),
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
                          hintText: 'Search by date, time, or session ID',
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
                    PopupMenuButton<AttendanceHistoryFilter>(
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
                          value: AttendanceHistoryFilter.all,
                          child: Row(
                            children: [
                              Icon(Icons.history),
                              SizedBox(width: 8),
                              Text('All Sessions'),
                            ],
                          ),
                        ),
                        const PopupMenuItem(
                          value: AttendanceHistoryFilter.active,
                          child: Row(
                            children: [
                              Icon(Icons.play_arrow, color: Colors.green),
                              SizedBox(width: 8),
                              Text('Active Only'),
                            ],
                          ),
                        ),
                        const PopupMenuItem(
                          value: AttendanceHistoryFilter.ended,
                          child: Row(
                            children: [
                              Icon(Icons.stop, color: Colors.grey),
                              SizedBox(width: 8),
                              Text('Ended Only'),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                SizedBox(height: AppConstants.defaultSpacing),

                // Filter indicator
                if (_currentFilter != AttendanceHistoryFilter.all || _searchQuery.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Wrap(
                      spacing: 8,
                      children: [
                        if (_currentFilter != AttendanceHistoryFilter.all)
                          Chip(
                            label: Text(
                              _currentFilter == AttendanceHistoryFilter.active
                                  ? 'Active Only'
                                  : 'Ended Only',
                            ),
                            deleteIcon: const Icon(Icons.close, size: 16),
                            onDeleted: () {
                              setState(() {
                                _currentFilter = AttendanceHistoryFilter.all;
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

                attendanceHistoryAsync.when(
                  data: (history) {
                    if (history.isEmpty) {
                      return EmptyState(
                        message: 'No attendance history available',
                        icon: Icons.history,
                      );
                    }

                    final filteredHistory = _filterAndSearchHistory(history);
                    if (filteredHistory.isEmpty) {
                      return EmptyState(
                        message: 'No sessions match your search criteria',
                        icon: Icons.search_off,
                      );
                    }

                    return ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: filteredHistory.length,
                      itemBuilder: (context, index) {
                        final session = filteredHistory[index];
                        return AppCard(
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: session.status == 'active'
                                  ? Colors.green
                                  : Colors.grey,
                              child: Icon(
                                session.status == 'active'
                                    ? Icons.play_arrow
                                    : Icons.stop,
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
                                  'Date: ${_formatDate(session.startTime)}',
                                  style: AppStyles.bodyMedium,
                                ),
                                Text(
                                  'Time: ${_formatTime(session.startTime)}',
                                  style: AppStyles.bodyMedium,
                                ),
                              ],
                            ),
                            trailing: Text(
                              '${session.presentCount}/${session.totalCount}',
                              style: AppStyles.titleMedium,
                            ),
                            onTap: () {
                              Navigator.of(context).pushNamed(
                                AppConstants.attendanceDetailsRoute,
                                arguments: {
                                  'sessionId': session.id,
                                  'className': widget.className,
                                },
                              );
                            },
                          ),
                        );
                      },
                    );
                  },
                  loading: () => SkeletonList(
                    itemCount: 3,
                    itemHeight: 80,
                    spacing: AppConstants.defaultPadding,
                  ),
                  error: (error, stackTrace) {
                    Logger.error('Failed to load attendance history', error, stackTrace);
                    return EmptyState(
                      message: 'Failed to load attendance history',
                      icon: Icons.error_outline,
                      onRetry: () {
                        ref.invalidate(attendanceHistoryProvider(widget.classId));
                      },
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showStartSessionDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Start Attendance Session'),
        content: const Text('Are you sure you want to start a new attendance session?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              try {
                await ref.read(attendanceProvider.notifier).startSession(widget.classId);
                if (context.mounted) {
                  Toast.show(
                    context,
                    message: 'Attendance session started successfully',
                    type: ToastType.success,
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  Toast.show(
                    context,
                    message: 'Failed to start session: $e',
                    type: ToastType.error,
                  );
                }
              }
            },
            child: const Text('Start'),
          ),
        ],
      ),
    );
  }

  void _showEndSessionDialog(BuildContext context, WidgetRef ref, String sessionId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('End Attendance Session'),
        content: const Text('Are you sure you want to end this attendance session?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              try {
                await ref.read(attendanceProvider.notifier).endSession(sessionId);
                if (context.mounted) {
                  Toast.show(
                    context,
                    message: 'Attendance session ended successfully',
                    type: ToastType.success,
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  Toast.show(
                    context,
                    message: 'Failed to end session: $e',
                    type: ToastType.error,
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('End'),
          ),
        ],
      ),
    );
  }

  void _showManualCheckInDialog(BuildContext context, WidgetRef ref, String sessionId) {
    final isOnline = ref.read(connectivityServiceProvider).isConnected;
    final studentIdController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Manual Check-in'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (!isOnline)
              Container(
                padding: const EdgeInsets.all(8),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.orange),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.cloud_off, color: Colors.orange),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'You are offline. This check-in will be synced when you are back online.',
                        style: TextStyle(color: Colors.orange[800]),
                      ),
                    ),
                  ],
                ),
              ),
            TextField(
              controller: studentIdController,
              decoration: const InputDecoration(
                labelText: 'Student ID',
                hintText: 'Enter student ID',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              if (studentIdController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Please enter a student ID')),
                );
                return;
              }

              Navigator.pop(context);
              try {
                await ref.read(attendanceActionsProvider.notifier).manualCheckIn(
                  sessionId,
                  studentIdController.text,
                );

                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      isOnline
                          ? 'Student checked in successfully'
                          : 'Check-in saved offline. Will sync when online.',
                    ),
                    backgroundColor: Colors.green,
                  ),
                );
              } catch (e) {
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Error: $e'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            child: const Text('Check In'),
          ),
        ],
      ),
    );
  }

  String _formatTime(DateTime time) {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatItem({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: color, size: 32),
        SizedBox(height: AppConstants.defaultSpacing),
        Text(
          value,
          style: AppStyles.titleLarge.copyWith(color: color),
        ),
        Text(
          label,
          style: AppStyles.bodyMedium,
        ),
      ],
    );
  }
}