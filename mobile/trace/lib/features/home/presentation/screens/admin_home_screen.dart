import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/constants/role_constants.dart';
import '../../../authentication/providers/auth_provider.dart';
import '../providers/home_provider.dart';
import '../../../../utils/logger.dart';
import '../../../../common/appbar/role_app_bar.dart';
import '../../../../common/shared_widgets/app_card.dart';
import '../../../../common/styles/app_styles.dart';
import '../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/skeleton_loading.dart';
import '../../../../common/shared_widgets/refresh_wrapper.dart';
import '../../../../common/animations/app_animations.dart';

class AdminHomeScreen extends ConsumerStatefulWidget {
  const AdminHomeScreen({super.key});

  @override
  ConsumerState<AdminHomeScreen> createState() => _AdminHomeScreenState();
}

class _AdminHomeScreenState extends ConsumerState<AdminHomeScreen> {
  final PageController _pageController = PageController();
  int _currentSection = 0;
  double _dragStartX = 0;
  double _dragStartY = 0;
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
      // Toggle system stats visibility
      ref.read(homePreferencesProvider.notifier).togglePreference('showSystemStats');
      Toast.show(
        context,
        message: ref.read(homePreferencesProvider)['showSystemStats'] == true
            ? 'System statistics shown'
            : 'System statistics hidden',
        type: ToastType.info,
      );
    }
    _lastTapTime = now;
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final user = authState.user!;

    // Redirect non-admin users to their appropriate screens
    if (user.role != RoleConstants.adminRole) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (user.role == RoleConstants.lecturerRole) {
          Navigator.of(context).pushReplacementNamed(AppConstants.lecturerHomeRoute);
        } else if (user.role == RoleConstants.studentRole) {
          Navigator.of(context).pushReplacementNamed(AppConstants.studentHomeRoute);
        }
      });
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
      appBar: AdminAppBar(
        title: 'Admin Dashboard',
        onLogout: () async {
          try {
            await ref.read(authProvider.notifier).signOut();
            if (context.mounted) {
              Navigator.of(context).pushReplacementNamed(AppConstants.signInRoute);
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
            ref.invalidate(dashboardItemsProvider);
            ref.invalidate(dashboardStatsProvider);
            Toast.show(
              context,
              message: 'Dashboard refreshed',
              type: ToastType.success,
            );
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Section with animation
              AppAnimations.fadeIn(
                child: AppCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome, ${user.firstName} ${user.lastName}',
                        style: AppStyles.headlineSmall,
                      ),
                      SizedBox(height: AppConstants.defaultSpacing),
                      Text(
                        'Staff ID: ${user.staffId}',
                        style: AppStyles.bodyLarge,
                      ),
                      Text(
                        'Department: ${user.department}',
                        style: AppStyles.bodyLarge,
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: AppConstants.defaultPadding * 1.5),

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
                            : Theme.of(context).primaryColor.withOpacity(0.3),
                      ),
                    ),
                  ),
                ),
              ),
              SizedBox(height: AppConstants.defaultPadding),

              // Dashboard Items with animation
              AppAnimations.slideIn(
                child: dashboardItemsAsync.when(
                  data: (items) => GridView.count(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    mainAxisSpacing: AppConstants.defaultPadding,
                    crossAxisSpacing: AppConstants.defaultPadding,
                    children: items.map((item) => _DashboardCard(
                      title: item.title,
                      icon: _getIconData(item.icon),
                      onTap: () => handleNavigation(item.route),
                    )).toList(),
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
                        borderRadius: 8,
                      ),
                    ),
                  ),
                  error: (error, stackTrace) {
                    Logger.error('Failed to load dashboard items', error, stackTrace);
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('Failed to load dashboard items'),
                          SizedBox(height: AppConstants.defaultSpacing),
                          ElevatedButton(
                            onPressed: () {
                              ref.invalidate(dashboardItemsProvider);
                              Toast.show(
                                context,
                                message: 'Retrying to load dashboard items...',
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

              SizedBox(height: AppConstants.defaultPadding * 1.5),

              // Admin-specific Statistics Section with animation
              if (preferences['showSystemStats'] == true)
                AppAnimations.fadeIn(
                  child: dashboardStatsAsync.when(
                    data: (stats) => AppCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'System Statistics',
                                style: AppStyles.titleLarge,
                              ),
                              IconButton(
                                icon: const Icon(Icons.close),
                                onPressed: () {
                                  ref.read(homePreferencesProvider.notifier)
                                      .togglePreference('showSystemStats');
                                  Toast.show(
                                    context,
                                    message: 'System statistics hidden',
                                    type: ToastType.info,
                                  );
                                },
                              ),
                            ],
                          ),
                          SizedBox(height: AppConstants.defaultPadding),
                          _StatItem(
                            label: 'Total Students',
                            value: stats['totalStudents'].toString(),
                            icon: Icons.people,
                          ),
                          _StatItem(
                            label: 'Total Lecturers',
                            value: stats['totalLecturers'].toString(),
                            icon: Icons.person,
                          ),
                          _StatItem(
                            label: 'Active Classes',
                            value: stats['activeClasses'].toString(),
                            icon: Icons.class_,
                          ),
                          _StatItem(
                            label: 'System Health',
                            value: stats['systemHealth'],
                            icon: Icons.health_and_safety,
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
                          SizedBox(height: AppConstants.defaultPadding),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: 4,
                            itemBuilder: (context, index) => Padding(
                              padding: EdgeInsets.only(bottom: AppConstants.defaultSpacing),
                              child: const SkeletonLoading(
                                width: double.infinity,
                                height: 48,
                                borderRadius: 8,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    error: (error, stackTrace) {
                      Logger.error('Failed to load dashboard stats', error, stackTrace);
                      return Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('Failed to load system statistics'),
                            SizedBox(height: AppConstants.defaultSpacing),
                            ElevatedButton(
                              onPressed: () {
                                ref.invalidate(dashboardStatsProvider);
                                Toast.show(
                                  context,
                                  message: 'Retrying to load system statistics...',
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
      ),
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
      case 'health_and_safety':
        return Icons.health_and_safety;
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
          SizedBox(height: AppConstants.defaultSpacing),
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
      padding: EdgeInsets.only(bottom: AppConstants.defaultSpacing),
      child: Row(
        children: [
          Icon(icon, size: AppStyles.iconLarge),
          SizedBox(width: AppConstants.defaultSpacing),
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