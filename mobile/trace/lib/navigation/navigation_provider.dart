import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'bottom_navigation.dart';
import 'page_transitions.dart';

final navigationProvider = StateNotifierProvider<NavigationNotifier, int>((ref) {
  return NavigationNotifier();
});

class NavigationNotifier extends StateNotifier<int> {
  NavigationNotifier() : super(0);

  void setIndex(int index) {
    state = index;
  }
}

class NavigationWrapper extends ConsumerWidget {
  final Widget child;
  final UserRole role;

  const NavigationWrapper({
    Key? key,
    required this.child,
    required this.role,
  }) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentIndex = ref.watch(navigationProvider);

    return Scaffold(
      body: child,
      bottomNavigationBar: AppBottomNavigation(
        role: role,
        currentIndex: currentIndex,
        onTap: (index) {
          if (index != currentIndex) {
            ref.read(navigationProvider.notifier).setIndex(index);
            _navigateToScreen(context, index, role);
          }
        },
      ),
    );
  }

  void _navigateToScreen(BuildContext context, int index, UserRole role) {
    String route;
    switch (role) {
      case UserRole.student:
        switch (index) {
          case 0:
            route = '/student/home';
            break;
          case 1:
            route = '/student/classes';
            break;
          case 2:
            route = '/student/attendance';
            break;
          case 3:
            route = '/student/profile';
            break;
          default:
            route = '/student/home';
        }
        break;

      case UserRole.lecturer:
        switch (index) {
          case 0:
            route = '/lecturer/home';
            break;
          case 1:
            route = '/lecturer/classes';
            break;
          case 2:
            route = '/lecturer/attendance';
            break;
          case 3:
            route = '/lecturer/profile';
            break;
          default:
            route = '/lecturer/home';
        }
        break;

      case UserRole.admin:
        switch (index) {
          case 0:
            route = '/admin/home';
            break;
          case 1:
            route = '/admin/classes';
            break;
          case 2:
            route = '/admin/users';
            break;
          case 3:
            route = '/admin/profile';
            break;
          default:
            route = '/admin/home';
        }
        break;
    }

    Navigator.pushReplacement(
      context,
      SlidePageRoute(
        child: _buildScreenForRoute(route),
        begin: const Offset(1.0, 0.0),
        end: Offset.zero,
      ),
    );
  }

  Widget _buildScreenForRoute(String route) {
    // This method should return the appropriate screen widget based on the route
    // You'll need to implement this based on your app's screen structure
    return Container(); // Placeholder
  }
} 