import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/constants/role_constants.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../profile/presentation/providers/profile_provider.dart';
import '../providers/home_provider.dart';
import '../../../../core/utils/logger.dart';
import '../../../../common/appbar/role_app_bar.dart';
import '../../../../common/shared_widgets/app_card.dart';
import '../../../../common/styles/app_styles.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/skeleton_loading.dart';
import '../../../../common/shared_widgets/refresh_wrapper.dart';
import '../../../profile/domain/entities/profile_entity.dart';

class LecturerHomeScreen extends ConsumerStatefulWidget {
  const LecturerHomeScreen({super.key});

  @override
  ConsumerState<LecturerHomeScreen> createState() => _LecturerHomeScreenState();
}

class _LecturerHomeScreenState extends ConsumerState<LecturerHomeScreen> {
  final PageController _pageController = PageController();
  final int _currentSection = 0;
  double _dragStartX = 0;
  DateTime? _lastTapTime;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _handleHorizontalSwipe(DragUpdateDetails details) {
    final delta = details.globalPosition.dx - _dragStartX;
    if (delta.abs() > 50) {
      if (delta > 0 && _currentSection > 0) {
        // Swipe right to previous section
        _pageController.previousPage(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      } else if (delta < 0 && _currentSection < 2) {
        // Swipe left to next section
        _pageController.nextPage(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      }
    }
  }

  void _handleDoubleTap() {
    final now = DateTime.now();
    if (_lastTapTime != null &&
        now.difference(_lastTapTime!) < const Duration(milliseconds: 300)) {
      // Toggle class stats visibility
      ref
          .read(homePreferencesProvider.notifier)
          .togglePreference('showClassStats');
      Toast.show(
        context,
        message: ref.read(homePreferencesProvider)['showClassStats'] == true
            ? 'Class statistics shown'
            : 'Class statistics hidden',
        type: ToastType.info,
      );
    }
    _lastTapTime = now;
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final profileState = ref.watch(profileProvider);

    return authState.when(
      data: (user) {
        if (user == null) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        final typedUser = user;

        // Redirect non-lecturer users to their appropriate screens
        if (typedUser.role != RoleConstants.lecturerRole) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (typedUser.role == RoleConstants.adminRole) {
              Navigator.of(context)
                  .pushReplacementNamed(AppConstants.adminHomeRoute);
            } else if (typedUser.role == RoleConstants.studentRole) {
              Navigator.of(context)
                  .pushReplacementNamed(AppConstants.studentHomeRoute);
            }
          });
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        return profileState.when(
          data: (profile) {
            if (profile == null) {
              return const Scaffold(
                body: Center(
                  child: CircularProgressIndicator(),
                ),
              );
            }

            final dashboardItemsAsync = ref.watch(dashboardItemsProvider);
            final dashboardStatsAsync = ref.watch(dashboardStatsProvider);
            final preferences = ref.watch(homePreferencesProvider);

            void handleNavigation(String route) {
              try {
                AppLogger.info('Navigating to $route');
                Navigator.of(context).pushNamed(route);
              } catch (e, stackTrace) {
                AppLogger.error('Failed to navigate to $route', e, stackTrace);
                if (context.mounted) {
                  Toast.show(
                    context,
                    message: 'Failed to navigate to $route',
                    type: ToastType.error,
                  );
                }
              }
            }

            return Scaffold(
              appBar: LecturerAppBar(
                title: 'Lecturer Dashboard',
                onLogout: () async {
                  try {
                    await ref.read(authProvider.notifier).signOut();
                    if (context.mounted) {
                      Navigator.of(context)
                          .pushReplacementNamed(AppConstants.signInRoute);
                    }
                  } catch (e, stackTrace) {
                    AppLogger.error('Failed to sign out', e, stackTrace);
                    if (context.mounted) {
                      Toast.show(
                        context,
                        message: 'Failed to sign out',
                        type: ToastType.error,
                      );
                    }
                  }
                },
              ),
              body: GestureDetector(
                onHorizontalDragStart: (details) {
                  _dragStartX = details.globalPosition.dx;
                },
                onHorizontalDragUpdate: _handleHorizontalSwipe,
                onTap: _handleDoubleTap,
                child: RefreshableListView(
                  onRefresh: () =>
                      ref.read(profileProvider.notifier).refreshProfile(),
                  children: [
                    GestureDetector(
                      onHorizontalDragStart: (details) {
                        _dragStartX = details.globalPosition.dx;
                      },
                      onHorizontalDragUpdate: _handleHorizontalSwipe,
                      onTap: _handleDoubleTap,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Welcome Section
                          Container(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Welcome,',
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleMedium
                                      ?.copyWith(
                                        color: Colors.grey[600],
                                      ),
                                ),
                                const SizedBox(height: 4),
                                profileState.when(
                                  data: (profile) {
                                    final typedProfile =
                                        profile as ProfileEntity;
                                    return Text(
                                      '${typedProfile.firstName} ${typedProfile.lastName}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .headlineMedium
                                          ?.copyWith(
                                            fontWeight: FontWeight.bold,
                                          ),
                                    );
                                  },
                                  loading: () => const SkeletonLoading(
                                    width: 200,
                                    height: 32,
                                  ),
                                  error: (_, __) => Text(
                                    'Error loading name',
                                    style: Theme.of(context)
                                        .textTheme
                                        .headlineMedium
                                        ?.copyWith(
                                          fontWeight: FontWeight.bold,
                                        ),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                profileState.when(
                                  data: (profile) {
                                    final typedProfile =
                                        profile as ProfileEntity;
                                    return Text(
                                      '${typedProfile.staffId} • ${typedProfile.department}',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyLarge
                                          ?.copyWith(
                                            color: Colors.grey[600],
                                          ),
                                    );
                                  },
                                  loading: () => const SkeletonLoading(
                                    width: 150,
                                    height: 24,
                                  ),
                                  error: (_, __) => Text(
                                    'Error loading details',
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodyLarge
                                        ?.copyWith(
                                          color: Colors.grey[600],
                                        ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Section Indicator
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            child: Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color:
                                        Theme.of(context).colorScheme.primary,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Colors.grey[300],
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 20),

                          // Dashboard Items
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            child: dashboardItemsAsync.when(
                              data: (items) => GridView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                gridDelegate:
                                    const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 2,
                                  childAspectRatio: 1.5,
                                  crossAxisSpacing: 16,
                                  mainAxisSpacing: 16,
                                ),
                                itemCount: items.length,
                                itemBuilder: (context, index) {
                                  final item = items[index];
                                  return _DashboardCard(
                                    title: item.title,
                                    icon: _getIconData(item.icon),
                                    onTap: () => handleNavigation(item.route),
                                  );
                                },
                              ),
                              loading: () => GridView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                gridDelegate:
                                    const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 2,
                                  childAspectRatio: 1.5,
                                  crossAxisSpacing: 16,
                                  mainAxisSpacing: 16,
                                ),
                                itemCount: 4,
                                itemBuilder: (context, index) =>
                                    const SkeletonLoading(
                                  width: double.infinity,
                                  height: 100,
                                ),
                              ),
                              error: (error, stackTrace) => Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      'Error loading dashboard',
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleMedium
                                          ?.copyWith(
                                            color: Colors.red,
                                          ),
                                    ),
                                    const SizedBox(height: 8),
                                    ElevatedButton(
                                      onPressed: () {
                                        ref.invalidate(dashboardItemsProvider);
                                        Toast.show(
                                          context,
                                          message:
                                              'Retrying to load dashboard...',
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

                          const SizedBox(height: 20),

                          // Lecturer-specific Statistics
                          if (preferences['showClassStats'] == true)
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Statistics',
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleLarge
                                        ?.copyWith(
                                          fontWeight: FontWeight.bold,
                                        ),
                                  ),
                                  const SizedBox(height: 16),
                                  dashboardStatsAsync.when(
                                    data: (stats) => Column(
                                      children: [
                                        _StatItem(
                                          label: 'Total Classes',
                                          value:
                                              stats['totalClasses'].toString(),
                                          icon: Icons.class_,
                                        ),
                                        const SizedBox(height: 16),
                                        _StatItem(
                                          label: 'Active Students',
                                          value: stats['activeStudents']
                                              .toString(),
                                          icon: Icons.people,
                                        ),
                                      ],
                                    ),
                                    loading: () => Column(
                                      children: List.generate(
                                        2,
                                        (index) => Padding(
                                          padding:
                                              const EdgeInsets.only(bottom: 16),
                                          child: SkeletonLoading(
                                            width: double.infinity,
                                            height: 100,
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                        ),
                                      ),
                                    ),
                                    error: (error, stackTrace) => Center(
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            'Error loading statistics',
                                            style: Theme.of(context)
                                                .textTheme
                                                .titleMedium
                                                ?.copyWith(
                                                  color: Colors.red,
                                                ),
                                          ),
                                          const SizedBox(height: 8),
                                          ElevatedButton(
                                            onPressed: () {
                                              ref.invalidate(
                                                  dashboardStatsProvider);
                                              Toast.show(
                                                context,
                                                message:
                                                    'Retrying to load statistics...',
                                                type: ToastType.info,
                                              );
                                            },
                                            child: const Text('Retry'),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
          loading: () => const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          ),
          error: (error, stackTrace) {
            AppLogger.error('Profile state error', error, stackTrace);
            return Scaffold(
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Failed to load profile data'),
                    ElevatedButton(
                      onPressed: () => ref.invalidate(profileProvider),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
      loading: () => const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      ),
      error: (error, stackTrace) {
        AppLogger.error('Auth state error', error, stackTrace);
        return Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Failed to load user data'),
                ElevatedButton(
                  onPressed: () => ref.invalidate(authProvider),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  IconData _getIconData(String iconName) {
    switch (iconName) {
      case 'class':
        return Icons.class_;
      case 'calendar_today':
        return Icons.calendar_today;
      case 'schedule':
        return Icons.schedule;
      case 'person':
        return Icons.person;
      case 'analytics':
        return Icons.analytics;
      default:
        return Icons.help_outline;
    }
  }
}

class _DashboardCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const _DashboardCard({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: AppStyles.iconXLarge),
          const SizedBox(height: AppConstants.defaultSpacing),
          Text(
            title,
            textAlign: TextAlign.center,
            style: AppStyles.titleMedium,
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _StatItem({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppConstants.defaultSpacing),
      child: Row(
        children: [
          Icon(icon, size: AppStyles.iconLarge),
          const SizedBox(width: AppConstants.defaultSpacing),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppStyles.bodyMedium,
                ),
                Text(
                  value,
                  style: AppStyles.titleMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
