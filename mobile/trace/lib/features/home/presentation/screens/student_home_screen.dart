import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/constants/role_constants.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../profile/presentation/providers/profile_provider.dart';
import '../providers/home_provider.dart';
import '../../../../utils/logger.dart';
import '../../../../common/appbar/role_app_bar.dart';
import '../../../../common/shared_widgets/app_card.dart';
import '../../../../common/styles/app_styles.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/skeleton_loading.dart';
import '../../../../common/shared_widgets/refresh_wrapper.dart';
import '../../../../common/animations/app_animations.dart';

class StudentHomeScreen extends ConsumerStatefulWidget {
  const StudentHomeScreen({super.key});

  @override
  ConsumerState<StudentHomeScreen> createState() => _StudentHomeScreenState();
}

class _StudentHomeScreenState extends ConsumerState<StudentHomeScreen> {
  final PageController _pageController = PageController();
  final int _currentSection = 0;
  double _dragStartX = 0;
  final double _dragStartY = 0;
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
      // Toggle attendance stats visibility
      ref
          .read(homePreferencesProvider.notifier)
          .togglePreference('showAttendanceStats');
      Toast.show(
        context,
        message:
            ref.read(homePreferencesProvider)['showAttendanceStats'] == true
                ? 'Attendance stats shown'
                : 'Attendance stats hidden',
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

        // Redirect non-student users to their appropriate screens
        if (user.role != RoleConstants.studentRole) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (user.role == RoleConstants.adminRole) {
              Navigator.of(context)
                  .pushReplacementNamed(AppConstants.adminHomeRoute);
            } else if (user.role == RoleConstants.lecturerRole) {
              Navigator.of(context)
                  .pushReplacementNamed(AppConstants.lecturerHomeRoute);
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
                Logger.info('Navigating to $route');
                Navigator.of(context).pushNamed(route);
              } catch (e, stackTrace) {
                Logger.error('Failed to navigate to $route', e, stackTrace);
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
              appBar: StudentAppBar(
                title: 'Student Dashboard',
                onLogout: () async {
                  try {
                    await ref.read(authProvider.notifier).signOut();
                    if (context.mounted) {
                      Navigator.of(context)
                          .pushReplacementNamed(AppConstants.signInRoute);
                    }
                  } catch (e, stackTrace) {
                    Logger.error('Failed to sign out', e, stackTrace);
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
                  onRefresh: () async {
                    await ref.read(profileProvider.notifier).refreshProfile();
                  },
                  children: [
                    // Welcome Section with animation
                    AppAnimations.fadeIn(
                      child: AppCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Welcome, ${profile.firstName} ${profile.lastName}',
                              style: Theme.of(context).textTheme.headlineSmall,
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Matric Number: ${profile.matricNo}',
                              style: Theme.of(context).textTheme.bodyLarge,
                            ),
                            Text(
                              'Program: ${profile.program}',
                              style: Theme.of(context).textTheme.bodyLarge,
                            ),
                            Text(
                              'Level: ${profile.level}',
                              style: Theme.of(context).textTheme.bodyLarge,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: AppConstants.defaultPadding * 1.5),

                    // Section indicator
                    AppAnimations.fadeIn(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          3,
                          (index) => Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: _currentSection == index
                                  ? Theme.of(context).primaryColor
                                  : Theme.of(context)
                                      .primaryColor
                                      .withOpacity(0.3),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: AppConstants.defaultPadding),

                    // Dashboard Items with animation
                    AppAnimations.slideIn(
                      child: dashboardItemsAsync.when(
                        data: (items) => GridView.count(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisCount: 2,
                          mainAxisSpacing: AppConstants.defaultPadding,
                          crossAxisSpacing: AppConstants.defaultPadding,
                          children: items
                              .map((item) => _DashboardCard(
                                    title: item.title,
                                    icon: _getIconData(item.icon),
                                    onTap: () => handleNavigation(item.route),
                                  ))
                              .toList(),
                        ),
                        loading: () => GridView.count(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisCount: 2,
                          mainAxisSpacing: AppConstants.defaultPadding,
                          crossAxisSpacing: AppConstants.defaultPadding,
                          children: List.generate(
                            4,
                            (index) => const SkeletonLoading(
                              width: double.infinity,
                              height: 120,
                              borderRadius:
                                  BorderRadius.all(Radius.circular(8)),
                            ),
                          ),
                        ),
                        error: (error, stackTrace) {
                          Logger.error('Failed to load dashboard items', error,
                              stackTrace);
                          return Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text('Failed to load dashboard items'),
                                const SizedBox(height: AppConstants.defaultSpacing),
                                ElevatedButton(
                                  onPressed: () {
                                    ref.invalidate(dashboardItemsProvider);
                                    Toast.show(
                                      context,
                                      message:
                                          'Retrying to load dashboard items...',
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

                    const SizedBox(height: AppConstants.defaultPadding * 1.5),

                    // Student-specific Statistics Section with animation
                    if (preferences['showAttendanceStats'] == true)
                      AppAnimations.scaleIn(
                        child: dashboardStatsAsync.when(
                          data: (stats) => AppCard(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      'My Attendance',
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleLarge,
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.close),
                                      onPressed: () {
                                        ref
                                            .read(homePreferencesProvider
                                                .notifier)
                                            .togglePreference(
                                                'showAttendanceStats');
                                        Toast.show(
                                          context,
                                          message: 'Attendance stats hidden',
                                          type: ToastType.info,
                                        );
                                      },
                                    ),
                                  ],
                                ),
                                const SizedBox(height: AppConstants.defaultPadding),
                                _StatItem(
                                  label: 'Overall Attendance',
                                  value: '${stats['overallAttendance']}%',
                                  icon: Icons.calendar_today,
                                ),
                                _StatItem(
                                  label: 'Classes Today',
                                  value: stats['classesToday'].toString(),
                                  icon: Icons.class_,
                                ),
                                _StatItem(
                                  label: 'Upcoming Classes',
                                  value: stats['upcomingClasses'].toString(),
                                  icon: Icons.schedule,
                                ),
                              ],
                            ),
                          ),
                          loading: () => AppCard(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SkeletonLoading(
                                  width: 200,
                                  height: 32,
                                ),
                                const SizedBox(height: AppConstants.defaultPadding),
                                ListView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemCount: 3,
                                  itemBuilder: (context, index) => const Padding(
                                    padding: EdgeInsets.only(
                                        bottom: AppConstants.defaultSpacing),
                                    child: SkeletonLoading(
                                      width: double.infinity,
                                      height: 48,
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(8)),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          error: (error, stackTrace) {
                            Logger.error(
                                'Failed to load statistics', error, stackTrace);
                            return Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Text('Failed to load statistics'),
                                  const SizedBox(height: AppConstants.defaultSpacing),
                                  ElevatedButton(
                                    onPressed: () {
                                      ref.invalidate(dashboardStatsProvider);
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
                            );
                          },
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
            Logger.error('Profile state error', error, stackTrace);
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
        Logger.error('Auth state error', error, stackTrace);
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
