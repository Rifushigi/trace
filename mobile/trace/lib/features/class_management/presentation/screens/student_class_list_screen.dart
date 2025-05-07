import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/class_provider.dart';
import '../../data/models/class_model.dart';
import 'class_details_screen.dart';
import '../../../../core/constants/role_constants.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/skeleton_loading.dart';
import '../../../../common/shared_widgets/refresh_wrapper.dart';

class StudentClassListScreen extends ConsumerWidget {
  const StudentClassListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final enrolledClassesAsync = ref.watch(enrolledClassesProvider);
    final user = ref.watch(authProvider).value;
    final isStudent = user?.role == RoleConstants.studentRole;

    // If not a student, show access denied
    if (!isStudent) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Access Denied'),
        ),
        body: const Center(
          child: Text('Only students can access this screen.'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Classes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              showSearch(
                context: context,
                delegate: ClassSearchDelegate(ref),
              );
            },
          ),
        ],
      ),
      body: enrolledClassesAsync.when(
        data: (classes) {
          if (classes.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('No classes enrolled'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/student/classes/search');
                    },
                    child: const Text('Find Classes'),
                  ),
                ],
              ),
            );
          }

          return RefreshableListView(
            onRefresh: () async {
              await ref.refresh(enrolledClassesProvider.future);
              if (context.mounted) {
                Toast.show(
                  context,
                  message: 'Classes refreshed successfully',
                  type: ToastType.success,
                );
              }
            },
            children: classes
                .map((classModel) => _buildClassCard(context, classModel))
                .toList(),
          );
        },
        loading: () => const SkeletonList(
          itemCount: 5,
          itemHeight: 100,
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
                onPressed: () => ref.refresh(enrolledClassesProvider),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildClassCard(BuildContext context, ClassModel classModel) {
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
              icon: const Icon(Icons.check_circle),
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  AppConstants.studentAttendanceRoute,
                  arguments: {
                    'classId': classModel.id,
                    'className': classModel.name,
                  },
                );
              },
              tooltip: 'View Attendance',
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ClassDetailsScreen(classId: classModel.id),
            ),
          );
        },
      ),
    );
  }
}

class ClassSearchDelegate extends SearchDelegate {
  final WidgetRef ref;

  ClassSearchDelegate(this.ref);

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () {
        close(context, null);
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    return _buildSearchResults(context);
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return _buildSearchResults(context);
  }

  Widget _buildSearchResults(BuildContext context) {
    if (query.isEmpty) {
      return const Center(child: Text('Enter a search term'));
    }

    final searchResultsAsync = ref.watch(searchClassesProvider(query));

    return searchResultsAsync.when(
      data: (classes) {
        if (classes.isEmpty) {
          return const Center(child: Text('No classes found'));
        }

        return ListView.builder(
          itemCount: classes.length,
          itemBuilder: (context, index) {
            final classModel = classes[index];
            return ListTile(
              title: Text(classModel.name),
              subtitle: Text('Code: ${classModel.code}'),
              trailing: ElevatedButton(
                onPressed: () async {
                  final user = ref.read(authProvider).value;
                  if (user != null) {
                    showDialog(
                      context: context,
                      barrierDismissible: false,
                      builder: (context) => const LoadingOverlay(
                        isLoading: true,
                        message: 'Enrolling in class...',
                        child: SizedBox(),
                      ),
                    );

                    try {
                      await ref
                          .read(classActionsProvider.notifier)
                          .enrollStudent(classModel.id, user.id);
                      if (context.mounted) {
                        Navigator.pop(context); // Close loading overlay
                        Toast.show(
                          context,
                          message: 'Successfully enrolled in class',
                          type: ToastType.success,
                        );
                        close(context, null);
                      }
                    } catch (error) {
                      if (context.mounted) {
                        Navigator.pop(context); // Close loading overlay
                        Toast.show(
                          context,
                          message: 'Failed to enroll: ${error.toString()}',
                          type: ToastType.error,
                        );
                      }
                    }
                  }
                },
                child: const Text('Enroll'),
              ),
            );
          },
        );
      },
      loading: () => const SkeletonList(
        itemCount: 3,
        itemHeight: 80,
      ),
      error: (error, stack) => Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Error searching classes',
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
              onPressed: () => ref.refresh(searchClassesProvider(query)),
              child: const Text('Retry'),
            ),
          ],
        ),
      ),
    );
  }
}
