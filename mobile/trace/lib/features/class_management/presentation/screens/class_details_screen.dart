import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/class_provider.dart';
import '../../data/models/class_model.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../../core/constants/role_constants.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/skeleton_loading.dart';
import '../../../../common/shared_widgets/refresh_wrapper.dart';

class ClassDetailsScreen extends ConsumerWidget {
  final String classId;

  const ClassDetailsScreen({super.key, required this.classId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final classDetailsAsync = ref.watch(classDetailsProvider(classId));
    final user = ref.watch(authProvider).user;
    final isLecturerOrAdmin = user?.role == RoleConstants.lecturerRole || user?.role == RoleConstants.adminRole;
    final isStudent = user?.role == RoleConstants.studentRole;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Class Details'),
        actions: [
          if (isLecturerOrAdmin) ...[
            IconButton(
              icon: const Icon(Icons.analytics),
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  '/class-statistics',
                  arguments: classId,
                );
              },
              tooltip: 'View Statistics',
            ),
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                classDetailsAsync.whenData((classModel) {
                  Navigator.pushNamed(
                    context,
                    '/class/update',
                    arguments: classModel,
                  );
                });
              },
              tooltip: 'Edit Class',
            ),
          ],
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.invalidate(classDetailsProvider(classId));
              Toast.show(
                context,
                message: 'Refreshing class details...',
                type: ToastType.info,
              );
            },
          ),
        ],
      ),
      body: RefreshableListView(
        onRefresh: () async {
          ref.invalidate(classDetailsProvider(classId));
          Toast.show(
            context,
            message: 'Class details refreshed',
            type: ToastType.success,
          );
        },
        child: classDetailsAsync.when(
          data: (classModel) {
            if (classModel == null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Class not found'),
                    SizedBox(height: AppConstants.defaultPadding),
                    ElevatedButton(
                      onPressed: () {
                        ref.invalidate(classDetailsProvider(classId));
                        Toast.show(
                          context,
                          message: 'Retrying to load class details...',
                          type: ToastType.info,
                        );
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }
            return Padding(
              padding: EdgeInsets.all(AppConstants.defaultPadding),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(AppConstants.defaultPadding),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            classModel.name,
                            style: Theme.of(context).textTheme.headlineSmall,
                          ),
                          SizedBox(height: AppConstants.defaultSpacing),
                          Text(
                            'Code: ${classModel.code}',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          SizedBox(height: AppConstants.defaultPadding),
                          Text(
                            'Schedule:',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          SizedBox(height: AppConstants.defaultSpacing),
                          Text(
                            '${classModel.schedule.day} ${classModel.schedule.startTime} - ${classModel.schedule.endTime}',
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                          if (classModel.schedule.isRecurring) ...[
                            SizedBox(height: AppConstants.defaultSpacing),
                            Text(
                              'Recurring Days: ${classModel.schedule.recurringDays.join(", ")}',
                              style: Theme.of(context).textTheme.bodyLarge,
                            ),
                            if (classModel.schedule.endDate != null) ...[
                              SizedBox(height: AppConstants.defaultSpacing),
                              Text(
                                'End Date: ${classModel.schedule.endDate}',
                                style: Theme.of(context).textTheme.bodyLarge,
                              ),
                            ],
                          ],
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: AppConstants.defaultPadding),
                  // Attendance Section
                  if (isLecturerOrAdmin) ...[
                    Card(
                      child: Padding(
                        padding: EdgeInsets.all(AppConstants.defaultPadding),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Attendance Management',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            SizedBox(height: AppConstants.defaultPadding),
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: () {
                                      Navigator.pushNamed(
                                        context,
                                        AppConstants.attendanceManagementRoute,
                                        arguments: {
                                          'classId': classId,
                                          'className': classModel.name,
                                        },
                                      );
                                    },
                                    icon: const Icon(Icons.manage_accounts),
                                    label: const Text('Manage Attendance'),
                                  ),
                                ),
                                SizedBox(width: AppConstants.defaultSpacing),
                                Expanded(
                                  child: ElevatedButton.icon(
                                    onPressed: () {
                                      Navigator.pushNamed(
                                        context,
                                        AppConstants.attendanceDetailsRoute,
                                        arguments: {
                                          'sessionId': classId,
                                          'className': classModel.name,
                                        },
                                      );
                                    },
                                    icon: const Icon(Icons.history),
                                    label: const Text('View History'),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ] else if (isStudent) ...[
                    Card(
                      child: Padding(
                        padding: EdgeInsets.all(AppConstants.defaultPadding),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'My Attendance',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            SizedBox(height: AppConstants.defaultPadding),
                            ElevatedButton.icon(
                              onPressed: () {
                                Navigator.pushNamed(
                                  context,
                                  AppConstants.studentAttendanceRoute,
                                  arguments: {
                                    'classId': classId,
                                    'className': classModel.name,
                                  },
                                );
                              },
                              icon: const Icon(Icons.check_circle),
                              label: const Text('View My Attendance'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
          loading: () => Padding(
            padding: EdgeInsets.all(AppConstants.defaultPadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SkeletonLoading(
                  width: 200,
                  height: 32,
                ),
                SizedBox(height: AppConstants.defaultPadding),
                const SkeletonLoading(
                  width: 150,
                  height: 24,
                ),
                SizedBox(height: AppConstants.defaultPadding),
                const SkeletonLoading(
                  width: 180,
                  height: 24,
                ),
                SizedBox(height: AppConstants.defaultPadding),
                const SkeletonLoading(
                  width: 250,
                  height: 24,
                ),
                SizedBox(height: AppConstants.defaultPadding * 2),
                const SkeletonLoading(
                  width: 200,
                  height: 32,
                ),
                SizedBox(height: AppConstants.defaultPadding),
                Row(
                  children: [
                    Expanded(
                      child: SkeletonLoading(
                        width: double.infinity,
                        height: 48,
                        borderRadius: 8,
                      ),
                    ),
                    SizedBox(width: AppConstants.defaultSpacing),
                    Expanded(
                      child: SkeletonLoading(
                        width: double.infinity,
                        height: 48,
                        borderRadius: 8,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          error: (error, stack) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Error: $error'),
                SizedBox(height: AppConstants.defaultPadding),
                ElevatedButton(
                  onPressed: () {
                    ref.invalidate(classDetailsProvider(classId));
                    Toast.show(
                      context,
                      message: 'Retrying to load class details...',
                      type: ToastType.info,
                    );
                  },
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
