/// Constants used throughout the app
class AppConstants {
  // App Info
  static const String appName = 'Trace';
  static const String appVersion = '1.0.0';

  // Routes
  static const String signInRoute = '/sign-in';
  static const String signUpRoute = '/sign-up';
  static const String onboardingRoute = '/onboarding';
  static const String homeRoute = '/home';
  static const String profileRoute = '/profile';
  static const String settingsRoute = '/settings';
  static const String attendanceRoute = '/attendance';
  static const String notificationsRoute = '/notifications';
  static const String studentHomeRoute = '/student/home';
  static const String lecturerHomeRoute = '/lecturer/home';
  static const String adminHomeRoute = '/admin/home';
  static const String attendanceManagementRoute = '/attendance-management';
  static const String attendanceDetailsRoute = '/attendance-details';
  static const String studentAttendanceRoute = '/student-attendance';

  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String themeKey = 'app_theme';

  // API Timeouts
  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds

  // Messages
  static const String welcomeMessage = 'Welcome Back!';
  static const String signInSuccess = 'Successfully signed in';
  static const String signInError = 'Failed to sign in';
  static const String signUpPrompt = 'Don\'t have an account? Sign Up';

  // UI Constants
  static const double defaultPadding = 16.0;
  static const double defaultSpacing = 8.0;
  static const double defaultRadius = 8.0;
}
