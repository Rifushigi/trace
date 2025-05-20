import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/app_card.dart';
import '../../../../common/styles/app_styles.dart';
import '../../../../core/utils/logger.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../domain/entities/user_entity.dart';
import '../providers/admin_provider.dart';

/// Screen for managing users in the admin dashboard.
class AdminUsersScreen extends ConsumerStatefulWidget {
  /// Creates a new instance of [AdminUsersScreen].
  const AdminUsersScreen({super.key});

  @override
  ConsumerState<AdminUsersScreen> createState() => _AdminUsersScreenState();
}

class _AdminUsersScreenState extends ConsumerState<AdminUsersScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedRole = 'all';
  bool _showDeleted = false;
  bool _isDeleting = false;
  bool _isRestoring = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _handleDeleteUser(String userId) async {
    if (_isDeleting) return;

    try {
      setState(() => _isDeleting = true);
      final confirmed = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Delete User'),
          content: const Text('Are you sure you want to delete this user?'),
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
        await ref.read(deleteUserProvider(userId).future);
        ref.invalidate(adminUsersProvider);
        if (mounted) {
          Toast.show(
            context,
            message: 'User deleted successfully',
            type: ToastType.success,
          );
        }
      }
    } catch (e, stackTrace) {
      AppLogger.error('Failed to delete user', e, stackTrace);
      if (mounted) {
        Toast.show(
          context,
          message: 'Failed to delete user',
          type: ToastType.error,
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isDeleting = false);
      }
    }
  }

  Future<void> _handleRestoreUser(String userId) async {
    if (_isRestoring) return;

    try {
      setState(() => _isRestoring = true);
      final confirmed = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Restore User'),
          content: const Text('Are you sure you want to restore this user?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Restore'),
            ),
          ],
        ),
      );

      if (confirmed == true) {
        await ref.read(restoreUserProvider(userId).future);
        ref.invalidate(adminUsersProvider);
        if (mounted) {
          Toast.show(
            context,
            message: 'User restored successfully',
            type: ToastType.success,
          );
        }
      }
    } catch (e, stackTrace) {
      AppLogger.error('Failed to restore user', e, stackTrace);
      if (mounted) {
        Toast.show(
          context,
          message: 'Failed to restore user',
          type: ToastType.error,
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isRestoring = false);
      }
    }
  }

  List<UserEntity> _filterUsers(List<UserEntity> users) {
    try {
      return users.where((user) {
        final searchTerm = _searchController.text.toLowerCase();
        final matchesSearch = user.email.toLowerCase().contains(searchTerm) ||
            user.firstName.toLowerCase().contains(searchTerm) ||
            user.lastName.toLowerCase().contains(searchTerm);

        final matchesRole =
            _selectedRole == 'all' || user.role == _selectedRole;
        final matchesDeleted = _showDeleted ? user.isDeleted : !user.isDeleted;

        return matchesSearch && matchesRole && matchesDeleted;
      }).toList();
    } catch (e, stackTrace) {
      AppLogger.error('Error filtering users', e, stackTrace);
      return users;
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
                title: const Text('User Management'),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.add),
                    onPressed: () {
                      Navigator.of(context).pushNamed('/create-user');
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
                            hintText: 'Search users...',
                            prefixIcon: const Icon(Icons.search),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          onChanged: (value) {
                            setState(() {});
                          },
                        ),
                        const SizedBox(height: AppConstants.defaultSpacing),
                        Row(
                          children: [
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                value: _selectedRole,
                                decoration: InputDecoration(
                                  labelText: 'Role',
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                items: const [
                                  DropdownMenuItem(
                                    value: 'all',
                                    child: Text('All Roles'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'admin',
                                    child: Text('Admin'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'lecturer',
                                    child: Text('Lecturer'),
                                  ),
                                  DropdownMenuItem(
                                    value: 'student',
                                    child: Text('Student'),
                                  ),
                                ],
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() {
                                      _selectedRole = value;
                                    });
                                  }
                                },
                              ),
                            ),
                            const SizedBox(width: AppConstants.defaultSpacing),
                            SwitchListTile(
                              title: const Text('Show Deleted'),
                              value: _showDeleted,
                              onChanged: (value) {
                                setState(() {
                                  _showDeleted = value;
                                });
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ref.watch(adminUsersProvider).when(
                          data: (users) {
                            if (users.isEmpty) {
                              return const Center(
                                child: Text('No users found'),
                              );
                            }

                            final filteredUsers = _filterUsers(users);

                            if (filteredUsers.isEmpty) {
                              return Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Text(
                                        'No users match the current filters'),
                                    const SizedBox(height: 16),
                                    ElevatedButton(
                                      onPressed: () {
                                        setState(() {
                                          _searchController.clear();
                                          _selectedRole = 'all';
                                          _showDeleted = false;
                                        });
                                      },
                                      child: const Text('Clear Filters'),
                                    ),
                                  ],
                                ),
                              );
                            }

                            return RefreshIndicator(
                              onRefresh: () async {
                                ref.invalidate(adminUsersProvider);
                                Toast.show(
                                  context,
                                  message: 'Users list refreshed',
                                  type: ToastType.success,
                                );
                              },
                              child: ListView.builder(
                                padding: const EdgeInsets.all(
                                    AppConstants.defaultPadding),
                                itemCount: filteredUsers.length,
                                itemBuilder: (context, index) {
                                  final user = filteredUsers[index];
                                  return AppCard(
                                    child: ListTile(
                                      leading: CircleAvatar(
                                        backgroundImage: user.avatar != null
                                            ? NetworkImage(user.avatar!)
                                            : null,
                                        child: user.avatar == null
                                            ? Text(user.firstName[0])
                                            : null,
                                      ),
                                      title: Text(
                                        '${user.firstName} ${user.lastName}',
                                        style: AppStyles.titleMedium,
                                      ),
                                      subtitle: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            user.email,
                                            style: AppStyles.bodyMedium,
                                          ),
                                          Text(
                                            'Role: ${user.role}',
                                            style: AppStyles.bodySmall,
                                          ),
                                          if (user.isDeleted) ...[
                                            const SizedBox(height: 4),
                                            Text(
                                              'Deleted: ${user.deletedAt?.toLocal().toString()}',
                                              style:
                                                  AppStyles.bodySmall.copyWith(
                                                color: Colors.red,
                                              ),
                                            ),
                                          ],
                                        ],
                                      ),
                                      trailing: PopupMenuButton<String>(
                                        onSelected: (value) async {
                                          switch (value) {
                                            case 'edit':
                                              Navigator.of(context).pushNamed(
                                                '/update-user',
                                                arguments: user,
                                              );
                                              break;
                                            case 'delete':
                                              if (!_isDeleting) {
                                                await _handleDeleteUser(
                                                    user.id);
                                              }
                                              break;
                                            case 'restore':
                                              if (!_isRestoring) {
                                                await _handleRestoreUser(
                                                    user.id);
                                              }
                                              break;
                                          }
                                        },
                                        itemBuilder: (context) => [
                                          const PopupMenuItem(
                                            value: 'edit',
                                            child: Text('Edit'),
                                          ),
                                          if (user.isDeleted)
                                            const PopupMenuItem(
                                              value: 'restore',
                                              child: Text('Restore'),
                                            )
                                          else
                                            const PopupMenuItem(
                                              value: 'delete',
                                              child: Text('Delete'),
                                            ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            );
                          },
                          loading: () => const Center(
                            child: CircularProgressIndicator(),
                          ),
                          error: (error, stackTrace) {
                            AppLogger.error(
                                'Failed to load users', error, stackTrace);
                            return Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Text('Failed to load users'),
                                  const SizedBox(height: 16),
                                  ElevatedButton(
                                    onPressed: () {
                                      ref.invalidate(adminUsersProvider);
                                      Toast.show(
                                        context,
                                        message: 'Retrying to load users...',
                                        type: ToastType.info,
                                      );
                                    },
                                    child: const Text('Retry'),
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
