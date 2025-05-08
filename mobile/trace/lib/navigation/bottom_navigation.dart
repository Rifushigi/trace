import 'package:flutter/material.dart';
import '../core/services/haptic_service.dart';

enum UserRole {
  student,
  lecturer,
  admin,
}

class AppBottomNavigation extends StatelessWidget {
  final UserRole role;
  final int currentIndex;
  final Function(int) onTap;

  const AppBottomNavigation({
    Key? key,
    required this.role,
    required this.currentIndex,
    required this.onTap,
  }) : super(key: key);

  Future<void> _handleTap(int index) async {
    if (index != currentIndex) {
      await HapticService.selectionClick();
      onTap(index);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: isDarkMode ? Colors.black12 : Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: _handleTap,
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.transparent,
        elevation: 0,
        selectedItemColor: theme.primaryColor,
        unselectedItemColor: isDarkMode ? Colors.grey[400] : Colors.grey[600],
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500),
        items: _getNavigationItems(role),
      ),
    );
  }

  List<BottomNavigationBarItem> _getNavigationItems(UserRole role) {
    switch (role) {
      case UserRole.student:
        return [
          const BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            activeIcon: Icon(Icons.dashboard, size: 28),
            label: 'Home',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.class_),
            activeIcon: Icon(Icons.class_, size: 28),
            label: 'Classes',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.how_to_reg),
            activeIcon: Icon(Icons.how_to_reg, size: 28),
            label: 'Attendance',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.person),
            activeIcon: Icon(Icons.person, size: 28),
            label: 'Profile',
          ),
        ];

      case UserRole.lecturer:
        return [
          const BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            activeIcon: Icon(Icons.dashboard, size: 28),
            label: 'Home',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.class_),
            activeIcon: Icon(Icons.class_, size: 28),
            label: 'Classes',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.manage_accounts),
            activeIcon: Icon(Icons.manage_accounts, size: 28),
            label: 'Attendance',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.person),
            activeIcon: Icon(Icons.person, size: 28),
            label: 'Profile',
          ),
        ];

      case UserRole.admin:
        return [
          const BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            activeIcon: Icon(Icons.dashboard, size: 28),
            label: 'Home',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.class_),
            activeIcon: Icon(Icons.class_, size: 28),
            label: 'Classes',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.people),
            activeIcon: Icon(Icons.people, size: 28),
            label: 'Users',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.person),
            activeIcon: Icon(Icons.person, size: 28),
            label: 'Profile',
          ),
        ];
    }
  }
} 