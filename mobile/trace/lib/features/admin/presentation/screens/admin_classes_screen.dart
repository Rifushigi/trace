import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../core/utils/logger.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../../common/shared_widgets/app_card.dart';
import '../../../../common/styles/app_styles.dart';
import '../../../../common/shared_widgets/skeleton_loading.dart';
import '../../../../common/shared_widgets/refresh_wrapper.dart';
import '../../../../common/animations/app_animations.dart';
import '../providers/admin_provider.dart';

/// Screen for managing classes in the admin dashboard.
class AdminClassesScreen extends ConsumerStatefulWidget {
  /// Creates a new instance of [AdminClassesScreen].
  const AdminClassesScreen({super.key});

  @override
  ConsumerState<AdminClassesScreen> createState() => _AdminClassesScreenState();
}

class _AdminClassesScreenState extends ConsumerState<AdminClassesScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedStatus = 'all';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _handleDeleteClass(String classId) async {
    try {
      final confirmed = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Delete Class'),
          content: const Text('Are you sure you want to delete this class?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Delete'),
            ),
          ],
        ),
      );

      if (confirmed == true) {
        await ref.read(deleteClassProvider(classId).future);
        ref.invalidate(adminClassesProvider);
        if (mounted) {
          Toast.show(
            context,
            message: 'Class deleted successfully',
            type: ToastType.success,
          );
        }
      }
    } catch (e, stackTrace) {
      AppLogger.error('Failed to delete class', e, stackTrace);
      if (mounted) {
        Toast.show(
          context,
          message: 'Failed to delete class',
          type: ToastType.error,
        );
      }
    }
  }

  Future<void> _handleArchiveClass(String classId) async {
    try {
      final confirmed = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Archive Class'),
          content: const Text('Are you sure you want to archive this class?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Archive'),
            ),
          ],
        ),
      );

      if (confirmed == true) {
        await ref.read(archiveClassProvider(classId).future);
        ref.invalidate(adminClassesProvider);
        if (mounted) {
          Toast.show(
            context,
            message: 'Class archived successfully',
            type: ToastType.success,
          );
        }
      }
    } catch (e, stackTrace) {
      AppLogger.error('Failed to archive class', e, stackTrace);
      if (mounted) {
        Toast.show(
          context,
          message: 'Failed to archive class',
          type: ToastType.error,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ref.watch(authProvider).when(
          data: (user) {
            if (user == null || user.role != 'admin') {
              return const Scaffold(
                body: Center(
                  child: Text('Access Denied'),
                ),
              );
            }
            return Scaffold(
              appBar: AppBar(
                title: const Text('Class Management'),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: () {
                      Navigator.of(context).pushNamed('/create-class');
                    },
                  ),
                ],
              ),
              body: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(AppConstants.defaultPadding),
                    child: Column(
                      children: [
                        TextField(
                          controller: _searchController,
                          decoration: InputDecoration(
                            hintText: 'Search classes...',
                            prefixIcon: const Icon(Icons.search),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          onChanged: (value) {
                            setState(() {});
                          },
                        ),
                        const SizedBox(height: 24),
                        DropdownButtonFormField<String>(
                          value: _selectedStatus,
                          decoration: InputDecoration(
                            labelText: 'Status',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          items: const [
                            DropdownMenuItem(
                              value: 'all',
                              child: Text('All Status'),
                            ),
                            DropdownMenuItem(
                              value: 'active',
                              child: Text('Active'),
                            ),
                            DropdownMenuItem(
                              value: 'archived',
                              child: Text('Archived'),
                            ),
                          ],
                          onChanged: (value) {
                            setState(() {
                              _selectedStatus = value!;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ref.watch(adminClassesProvider).when(
                          data: (classes) {
                            if (classes.isEmpty) {
                              return const Center(
                                child: Text('No classes found'),
                              );
                            }
                            final filteredClasses = classes.where((class_) {
                              final matchesSearch = class_.name
                                      .toLowerCase()
                                      .contains(_searchController.text
                                          .toLowerCase()) ||
                                  class_.code.toLowerCase().contains(
                                      _searchController.text.toLowerCase());
                              final matchesStatus = _selectedStatus == 'all' ||
                                  (_selectedStatus == 'active' &&
                                      !class_.isArchived) ||
                                  (_selectedStatus == 'archived' &&
                                      class_.isArchived);
                              return matchesSearch && matchesStatus;
                            }).toList();
                            return RefreshableListView(
                              onRefresh: () async {
                                ref.invalidate(adminClassesProvider);
                                Toast.show(
                                  context,
                                  message: 'Classes list refreshed',
                                  type: ToastType.success,
                                );
                              },
                              children: [
                                ...filteredClasses
                                    .map((class_) => AppAnimations.fadeIn(
                                          child: AppCard(
                                            onTap: () {
                                              Navigator.of(context).pushNamed(
                                                '/class-details',
                                                arguments: class_.id,
                                              );
                                            },
                                            child: ListTile(
                                              leading: CircleAvatar(
                                                child: Text(class_.name[0]),
                                              ),
                                              title: Text(
                                                class_.name,
                                                style: AppStyles.titleMedium,
                                              ),
                                              subtitle: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    'Code: ${class_.code}',
                                                    style: AppStyles.bodyMedium,
                                                  ),
                                                  Text(
                                                    'Lecturer: ${class_.lecturerName}',
                                                    style: AppStyles.bodySmall,
                                                  ),
                                                ],
                                              ),
                                              trailing: PopupMenuButton<String>(
                                                onSelected: (value) async {
                                                  switch (value) {
                                                    case 'edit':
                                                      Navigator.of(context)
                                                          .pushNamed(
                                                        '/update-class',
                                                        arguments: class_,
                                                      );
                                                      break;
                                                    case 'archive':
                                                      await _handleArchiveClass(
                                                          class_.id);
                                                      break;
                                                    case 'delete':
                                                      await _handleDeleteClass(
                                                          class_.id);
                                                      break;
                                                    case 'statistics':
                                                      Navigator.of(context)
                                                          .pushNamed(
                                                        '/class-statistics',
                                                        arguments: class_.id,
                                                      );
                                                      break;
                                                  }
                                                },
                                                itemBuilder: (context) => [
                                                  const PopupMenuItem(
                                                    value: 'edit',
                                                    child: Text('Edit'),
                                                  ),
                                                  const PopupMenuItem(
                                                    value: 'statistics',
                                                    child:
                                                        Text('View Statistics'),
                                                  ),
                                                  if (class_.isArchived)
                                                    const PopupMenuItem(
                                                      value: 'delete',
                                                      child: Text('Delete'),
                                                    )
                                                  else
                                                    const PopupMenuItem(
                                                      value: 'archive',
                                                      child: Text('Archive'),
                                                    ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        )),
                              ],
                            );
                          },
                          loading: () => ListView.builder(
                            itemCount: 5,
                            itemBuilder: (context, index) => const Padding(
                              padding: EdgeInsets.all(8.0),
                              child: SkeletonLoading(
                                width: double.infinity,
                                height: 72,
                                borderRadius:
                                    BorderRadius.all(Radius.circular(8)),
                              ),
                            ),
                          ),
                          error: (error, stackTrace) {
                            AppLogger.error(
                                'Failed to load classes', error, stackTrace);
                            return Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Text(
                                    'Failed to load classes',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    error.toString(),
                                    style: const TextStyle(
                                      color: Colors.red,
                                      fontSize: 14,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                  const SizedBox(height: 16),
                                  ElevatedButton.icon(
                                    onPressed: () {
                                      ref.invalidate(adminClassesProvider);
                                      Toast.show(
                                        context,
                                        message: 'Retrying to load classes...',
                                        type: ToastType.info,
                                      );
                                    },
                                    icon: const Icon(Icons.refresh),
                                    label: const Text('Retry'),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                  ),
                ],
              ),
            );
          },
          loading: () => const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          ),
          error: (error, stackTrace) {
            AppLogger.error('Failed to load user data', error, stackTrace);
            return Scaffold(
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Failed to load user data'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        ref.invalidate(authProvider);
                        Toast.show(
                          context,
                          message: 'Retrying to load user data...',
                          type: ToastType.info,
                        );
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            );
          },
        );
  }
}
