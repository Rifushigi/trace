import 'package:flutter/material.dart';
import '../features/authentication/presentation/screens/sign_in/sign_in_screen.dart';
import '../features/authentication/presentation/screens/sign_up/role_selection_screen.dart';
import '../features/home/presentation/screens/student_home_screen.dart';
import '../features/home/presentation/screens/lecturer_home_screen.dart';
import '../features/home/presentation/screens/admin_home_screen.dart';
import '../features/profile/presentation/screens/student_profile_screen.dart';
import '../features/profile/presentation/screens/lecturer_profile_screen.dart';
import '../features/profile/presentation/screens/admin_profile_screen.dart';
import '../features/class_management/presentation/screens/student_class_list_screen.dart';
import '../features/class_management/presentation/screens/lecturer_class_list_screen.dart';
import '../features/class_management/presentation/screens/admin_class_list_screen.dart';
import '../features/attendance/presentation/screens/student_attendance_screen.dart';
import '../features/attendance/presentation/screens/attendance_management_screen.dart';
import '../features/admin/presentation/screens/user_management_screen.dart';
import '../navigation/navigation_provider.dart';
import '../navigation/bottom_navigation.dart';
import '../navigation/page_transitions.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    Widget screen;
    bool useBottomNav = false;
    UserRole? role;

    switch (settings.name) {
      case '/':
      case '/sign-in':
        screen = const SignInScreen();
        break;
      case '/sign-up':
        screen = const RoleSelectionScreen();
        break;

      // Student Routes
      case '/student/home':
        screen = const StudentHomeScreen();
        useBottomNav = true;
        role = UserRole.student;
        break;
      case '/student/classes':
        screen = const StudentClassListScreen();
        useBottomNav = true;
        role = UserRole.student;
        break;
      case '/student/attendance':
        screen = const StudentAttendanceScreen();
        useBottomNav = true;
        role = UserRole.student;
        break;
      case '/student/profile':
        screen = const StudentProfileScreen();
        useBottomNav = true;
        role = UserRole.student;
        break;

      // Lecturer Routes
      case '/lecturer/home':
        screen = const LecturerHomeScreen();
        useBottomNav = true;
        role = UserRole.lecturer;
        break;
      case '/lecturer/classes':
        screen = const LecturerClassListScreen();
        useBottomNav = true;
        role = UserRole.lecturer;
        break;
      case '/lecturer/attendance':
        screen = const AttendanceManagementScreen();
        useBottomNav = true;
        role = UserRole.lecturer;
        break;
      case '/lecturer/profile':
        screen = const LecturerProfileScreen();
        useBottomNav = true;
        role = UserRole.lecturer;
        break;

      // Admin Routes
      case '/admin/home':
        screen = const AdminHomeScreen();
        useBottomNav = true;
        role = UserRole.admin;
        break;
      case '/admin/classes':
        screen = const AdminClassListScreen();
        useBottomNav = true;
        role = UserRole.admin;
        break;
      case '/admin/users':
        screen = const UserManagementScreen();
        useBottomNav = true;
        role = UserRole.admin;
        break;
      case '/admin/profile':
        screen = const AdminProfileScreen();
        useBottomNav = true;
        role = UserRole.admin;
        break;

      default:
        screen = Scaffold(
          body: Center(
            child: Text('No route defined for ${settings.name}'),
          ),
        );
    }

    final Widget finalScreen = useBottomNav && role != null
        ? NavigationWrapper(
            role: role,
            child: screen,
          )
        : screen;

    // Use fade transition for auth screens, slide transition for main app screens
    if (settings.name == '/' || settings.name == '/sign-in' || settings.name == '/sign-up') {
      return FadePageRoute(child: finalScreen);
    } else {
      return SlidePageRoute(
        child: finalScreen,
        begin: const Offset(1.0, 0.0),
        end: Offset.zero,
      );
    }
  }
} 