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

enum StudentListSortOption {
  nameAsc,
  nameDesc,
  statusPresent,
  statusAbsent,
  idAsc,
  idDesc,
}

enum StudentFilter {
  all,
  present,
  absent,
}

class AttendanceDetailsScreen extends ConsumerStatefulWidget {
  final String sessionId;
  final String className;

  const AttendanceDetailsScreen({
    super.key,
    required this.sessionId,
    required this.className,
  });

  @override
  ConsumerState<AttendanceDetailsScreen> createState() => _AttendanceDetailsScreenState();
}

class _AttendanceDetailsScreenState extends ConsumerState<AttendanceDetailsScreen> {
  final TextEditingController _searchController = TextEditingController();
  StudentFilter _currentFilter = StudentFilter.all;
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Student> _filterAndSearchStudents(List<Student> students) {
    return students.where((student) {
      // Apply status filter
      if (_currentFilter == StudentFilter.present && !student.isPresent) return false;
      if (_currentFilter == StudentFilter.absent && student.isPresent) return false;

      // Apply search query
      if (_searchQuery.isEmpty) return true;
      final query = _searchQuery.toLowerCase();
      return student.name.toLowerCase().contains(query) ||
          student.id.toLowerCase().contains(query);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final user = authState.user!;

    // Ensure only lecturers and admins can access
    if (user.role != RoleConstants.lecturerRole && user.role != RoleConstants.adminRole) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Access Denied'),
        ),
        body: EmptyState(
          message: 'Only lecturers and administrators can view attendance details.',
          icon: Icons.lock,
        ),
      );
    }

    final sessionDetailsAsync = ref.watch(sessionDetailsProvider(widget.sessionId));

    return Scaffold(
      appBar: LecturerAppBar(
        title: 'Attendance Details',
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.invalidate(sessionDetailsProvider(widget.sessionId));
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(sessionDetailsProvider(widget.sessionId));
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
                      'Session ID: ${widget.sessionId}',
                      style: AppStyles.bodyMedium,
                    ),
                  ],
                ),
              ),
              SizedBox(height: AppConstants.defaultPadding * 1.5),

              // Session Details
              sessionDetailsAsync.when(
                data: (session) {
                  if (session == null) {
                    return EmptyState(
                      message: 'Session not found',
                      icon: Icons.search_off,
                    );
                  }

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AppCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Session Details',
                              style: AppStyles.titleLarge,
                            ),
                            SizedBox(height: AppConstants.defaultSpacing),
                            Text(
                              'Start Time: ${_formatDateTime(session.startTime)}',
                              style: AppStyles.bodyMedium,
                            ),
                            if (session.endTime != null)
                              Text(
                                'End Time: ${_formatDateTime(session.endTime!)}',
                                style: AppStyles.bodyMedium,
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
                                Expanded(
                                  child: _StatItem(
                                    label: 'Total',
                                    value: session.totalCount.toString(),
                                    icon: Icons.people,
                                    color: Colors.blue,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: AppConstants.defaultPadding * 1.5),

                      // Student List
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Student List',
                                style: AppStyles.titleLarge,
                              ),
                              PopupMenuButton<StudentListSortOption>(
                                icon: const Icon(Icons.sort),
                                tooltip: 'Sort by',
                                onSelected: (option) {
                                  // Sort the list based on the selected option
                                  ref.read(sessionDetailsProvider(widget.sessionId).notifier).sortStudents(option);
                                },
                                itemBuilder: (context) => [
                                  const PopupMenuItem(
                                    value: StudentListSortOption.nameAsc,
                                    child: Row(
                                      children: [
                                        Icon(Icons.arrow_upward),
                                        SizedBox(width: 8),
                                        Text('Name (A-Z)'),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: StudentListSortOption.nameDesc,
                                    child: Row(
                                      children: [
                                        Icon(Icons.arrow_downward),
                                        SizedBox(width: 8),
                                        Text('Name (Z-A)'),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: StudentListSortOption.statusPresent,
                                    child: Row(
                                      children: [
                                        Icon(Icons.check_circle),
                                        SizedBox(width: 8),
                                        Text('Present First'),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: StudentListSortOption.statusAbsent,
                                    child: Row(
                                      children: [
                                        Icon(Icons.cancel),
                                        SizedBox(width: 8),
                                        Text('Absent First'),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: StudentListSortOption.idAsc,
                                    child: Row(
                                      children: [
                                        Icon(Icons.arrow_upward),
                                        SizedBox(width: 8),
                                        Text('ID (A-Z)'),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: StudentListSortOption.idDesc,
                                    child: Row(
                                      children: [
                                        Icon(Icons.arrow_downward),
                                        SizedBox(width: 8),
                                        Text('ID (Z-A)'),
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
                                    hintText: 'Search by name or ID',
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
                              PopupMenuButton<StudentFilter>(
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
                                    value: StudentFilter.all,
                                    child: Row(
                                      children: [
                                        Icon(Icons.people),
                                        SizedBox(width: 8),
                                        Text('All Students'),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: StudentFilter.present,
                                    child: Row(
                                      children: [
                                        Icon(Icons.check_circle, color: Colors.green),
                                        SizedBox(width: 8),
                                        Text('Present Only'),
                                      ],
                                    ),
                                  ),
                                  const PopupMenuItem(
                                    value: StudentFilter.absent,
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
                          if (_currentFilter != StudentFilter.all || _searchQuery.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 8.0),
                              child: Wrap(
                                spacing: 8,
                                children: [
                                  if (_currentFilter != StudentFilter.all)
                                    Chip(
                                      label: Text(
                                        _currentFilter == StudentFilter.present
                                            ? 'Present Only'
                                            : 'Absent Only',
                                      ),
                                      deleteIcon: const Icon(Icons.close, size: 16),
                                      onDeleted: () {
                                        setState(() {
                                          _currentFilter = StudentFilter.all;
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

                          if (session.students.isEmpty)
                            EmptyState(
                              message: 'No students in this session',
                              icon: Icons.people_outline,
                            )
                          else
                            Builder(
                              builder: (context) {
                                final filteredStudents = _filterAndSearchStudents(session.students);
                                if (filteredStudents.isEmpty) {
                                  return EmptyState(
                                    message: 'No students match your search criteria',
                                    icon: Icons.search_off,
                                  );
                                }
                                return ListView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: filteredStudents.length,
                                  itemBuilder: (context, index) {
                                    final student = filteredStudents[index];
                                    return AppCard(
                                      child: ListTile(
                                        leading: CircleAvatar(
                                          backgroundColor: student.isPresent
                                              ? Colors.green
                                              : Colors.red,
                                          child: Icon(
                                            student.isPresent
                                                ? Icons.check
                                                : Icons.close,
                                            color: Colors.white,
                                          ),
                                        ),
                                        title: Text(
                                          student.name,
                                          style: AppStyles.titleMedium,
                                        ),
                                        subtitle: Text(
                                          student.id,
                                          style: AppStyles.bodyMedium,
                                        ),
                                      ),
                                    );
                                  },
                                );
                              },
                            ),
                        ],
                      ),
                    ],
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, stackTrace) {
                  Logger.error('Failed to load session details', error, stackTrace);
                  return EmptyState(
                    message: 'Failed to load session details',
                    icon: Icons.error_outline,
                    onRetry: () {
                      ref.invalidate(sessionDetailsProvider(widget.sessionId));
                    },
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
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