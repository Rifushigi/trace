import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/app_constants.dart';
import '../../features/splash/presentation/screens/splash_screen.dart';
import '../../features/onboarding/presentation/screens/onboarding_screen.dart';
import '../../features/authentication/presentation/screens/sign_in_screen.dart';
import '../../features/authentication/presentation/screens/sign_up/role_selection_screen.dart';
import '../../features/authentication/presentation/screens/sign_up/student_sign_up_screen.dart';
import '../../features/authentication/presentation/screens/sign_up/lecturer_sign_up_screen.dart';
import '../../features/authentication/presentation/screens/forgot_password_screen.dart';
import '../../features/home/presentation/screens/student_home_screen.dart';
import '../../features/home/presentation/screens/lecturer_home_screen.dart';
import '../../features/profile/presentation/screens/student_profile_screen.dart';
import '../../features/profile/presentation/screens/lecturer_profile_screen.dart';
import '../../features/class_management/presentation/screens/student_class_list_screen.dart';
import '../../features/class_management/presentation/screens/class_list_screen.dart';
import '../../features/class_management/presentation/screens/class_details_screen.dart';
import '../../features/class_management/presentation/screens/create_class_screen.dart';
import '../../features/class_management/presentation/screens/update_class_screen.dart';
import '../../features/class_management/presentation/screens/class_statistics_screen.dart';
import '../../features/notifications/presentation/screens/notification_list_screen.dart';
import '../../features/authentication/presentation/providers/auth_provider.dart';
import '../../features/class_management/data/models/class_model.dart';
import '../../features/attendance/presentation/screens/attendance_management_screen.dart';
import '../../features/attendance/presentation/screens/attendance_details_screen.dart';
import '../../features/attendance/presentation/screens/student_attendance_screen.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings, WidgetRef ref) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case '/onboarding':
        return MaterialPageRoute(builder: (_) => const OnboardingScreen());
      case '/sign-in':
        return MaterialPageRoute(builder: (_) => const SignInScreen());
      case '/sign-up/role':
        return MaterialPageRoute(builder: (_) => const RoleSelectionScreen());
      case '/sign-up/student':
        return MaterialPageRoute(builder: (_) => const StudentSignUpScreen());
      case '/sign-up/lecturer':
        return MaterialPageRoute(builder: (_) => const LecturerSignUpScreen());
      case '/forgot-password':
        return MaterialPageRoute(builder: (_) => const ForgotPasswordScreen());
      case '/student/home':
        return MaterialPageRoute(builder: (_) => const StudentHomeScreen());
      case '/lecturer/home':
        return MaterialPageRoute(builder: (_) => const LecturerHomeScreen());
      case '/student/profile':
        return MaterialPageRoute(builder: (_) => const StudentProfileScreen());
      case '/lecturer/profile':
        return MaterialPageRoute(builder: (_) => const LecturerProfileScreen());
      case '/student/classes':
        return MaterialPageRoute(
            builder: (_) => const StudentClassListScreen());
      case '/lecturer/classes':
        return MaterialPageRoute(builder: (_) => const ClassListScreen());
      case '/class/create':
        return MaterialPageRoute(builder: (_) => const CreateClassScreen());
      case '/class/details':
        final classId = settings.arguments as String;
        return MaterialPageRoute(
            builder: (_) => ClassDetailsScreen(classId: classId));
      case '/class/update':
        final classModel = settings.arguments as ClassModel;
        return MaterialPageRoute(
            builder: (_) => UpdateClassScreen(classModel: classModel));
      case '/class-statistics':
        final classId = settings.arguments as String;
        return MaterialPageRoute(
          builder: (context) => Consumer(
            builder: (context, ref, child) {
              return ref.watch(authProvider).when(
                    data: (user) {
                      if (user?.role != 'lecturer' && user?.role != 'admin') {
                        return Scaffold(
                          appBar: AppBar(
                            title: const Text('Access Denied'),
                          ),
                          body: const Center(
                            child: Text(
                                'Only lecturers and administrators can view class statistics'),
                          ),
                        );
                      }
                      return ClassStatisticsScreen(classId: classId);
                    },
                    loading: () =>
                        const Center(child: CircularProgressIndicator()),
                    error: (_, __) => const Scaffold(
                      body: Center(child: Text('Error loading user data')),
                    ),
                  );
            },
          ),
        );
      case '/notifications':
        return MaterialPageRoute(
          builder: (_) => const NotificationListScreen(),
        );
      case AppConstants.attendanceManagementRoute:
        final args = settings.arguments as Map<String, dynamic>;
        final classId = args['classId'] as String;
        final className = args['className'] as String;
        return MaterialPageRoute(
          builder: (_) => AttendanceManagementScreen(
            classId: classId,
            className: className,
          ),
        );
      case AppConstants.attendanceDetailsRoute:
        final args = settings.arguments as Map<String, dynamic>;
        final sessionId = args['sessionId'] as String;
        final className = args['className'] as String;
        return MaterialPageRoute(
          builder: (_) => AttendanceDetailsScreen(
            sessionId: sessionId,
            className: className,
          ),
        );
      case AppConstants.studentAttendanceRoute:
        final args = settings.arguments as Map<String, dynamic>;
        final classId = args['classId'] as String;
        final className = args['className'] as String;
        return MaterialPageRoute(
          builder: (_) => StudentAttendanceScreen(
            classId: classId,
            className: className,
          ),
        );
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
