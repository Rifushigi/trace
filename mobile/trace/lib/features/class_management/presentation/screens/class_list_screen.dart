import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/class_provider.dart';
import '../../domain/entities/class_entity.dart';
import 'class_details_screen.dart';
import 'create_class_screen.dart';
import 'update_class_screen.dart';
import '../../../../core/constants/role_constants.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/skeleton_loading.dart';
import '../../../../common/shared_widgets/refresh_wrapper.dart';

class ClassListScreen extends ConsumerWidget {
  const ClassListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final classListAsync = ref.watch(classListProvider);
    final authState = ref.watch(authProvider);
    final user = authState.value;
    final isLecturerOrAdmin = user?.role == RoleConstants.lecturerRole ||
        user?.role == RoleConstants.adminRole;

    // If not a lecturer or admin, show access denied
    if (!isLecturerOrAdmin) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Access Denied'),
        ),
        body: const Center(
          child:
              Text('Only lecturers and administrators can access this screen.'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Classes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const CreateClassScreen()),
              );
            },
          ),
        ],
      ),
      body: classListAsync.when(
        data: (classes) => RefreshableListView(
          onRefresh: () async {
            ref.invalidate(classListProvider);
            if (context.mounted) {
              Toast.show(
                context,
                message: 'Classes refreshed successfully',
                type: ToastType.success,
              );
            }
          },
          children: classes
              .map((classModel) => _buildClassCard(context, ref, classModel))
              .toList(),
        ),
        loading: () => ListView.builder(
          itemCount: 5,
          itemBuilder: (context, index) => const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SkeletonLoading(
              width: double.infinity,
              height: 100,
            ),
          ),
        ),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Error loading classes',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                error.toString(),
                style: Theme.of(context)
                    .textTheme
                    .bodyMedium
                    ?.copyWith(color: Colors.red),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.refresh(classListProvider),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildClassCard(
      BuildContext context, WidgetRef ref, ClassEntity classModel) {
    final schedule = classModel.schedule;
    final day = schedule['day'] as String? ?? 'N/A';
    final startTime = schedule['startTime'] as String? ?? 'N/A';
    final endTime = schedule['endTime'] as String? ?? 'N/A';

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        title: Text(classModel.name),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Code: ${classModel.code}'),
            Text('Schedule: $day $startTime - $endTime'),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(Icons.manage_accounts),
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  AppConstants.attendanceManagementRoute,
                  arguments: {
                    'classId': classModel.id,
                    'className': classModel.name,
                  },
                );
              },
              tooltip: 'Manage Attendance',
            ),
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          UpdateClassScreen(classModel: classModel)),
                );
              },
              tooltip: 'Edit Class',
            ),
            IconButton(
              icon: const Icon(Icons.delete),
              onPressed: () async {
                final confirmed = await showDialog<bool>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Delete Class'),
                    content: const Text(
                        'Are you sure you want to delete this class?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context, false),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text('Delete'),
                      ),
                    ],
                  ),
                );

                if (confirmed == true && context.mounted) {
                  const LoadingOverlay(
                    isLoading: true,
                    message: 'Deleting class...',
                    child: SizedBox(),
                  );

                  try {
                    await ref
                        .read(classActionsProvider.notifier)
                        .deleteClass(classModel.id);
                    if (context.mounted) {
                      Toast.show(
                        context,
                        message: 'Class deleted successfully',
                        type: ToastType.success,
                      );
                    }
                  } catch (error) {
                    if (context.mounted) {
                      Toast.show(
                        context,
                        message: 'Failed to delete class: ${error.toString()}',
                        type: ToastType.error,
                      );
                    }
                  }
                }
              },
              tooltip: 'Delete Class',
            ),
          ],
        ),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) =>
                    ClassDetailsScreen(classId: classModel.id)),
          );
        },
      ),
    );
  }
}
