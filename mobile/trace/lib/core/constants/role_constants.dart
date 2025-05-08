/// Constants related to user roles and permissions
class RoleConstants {
  // User Roles
  static const String studentRole = 'student';
  static const String lecturerRole = 'lecturer';
  static const String adminRole = 'admin';

  // Role-based Routes
  static const Map<String, String> roleHomeRoutes = {
    studentRole: '/student/home',
    lecturerRole: '/lecturer/home',
    adminRole: '/admin/home',
  };

  // Role-based Features
  static const Map<String, List<String>> roleFeatures = {
    studentRole: [
      'View your attendance records',
      'Check in to classes',
      'Access your class schedule',
    ],
    lecturerRole: [
      'Manage class attendance',
      'View attendance reports',
      'Create and manage classes',
    ],
    adminRole: [
      'Manage user accounts',
      'Manage user roles',
      'Access all reports',
      'Configure system settings',
    ],
  };

  // Role-based Permissions
  static const Map<String, List<String>> rolePermissions = {
    studentRole: [
      'read:own_profile',
      'read:own_attendance',
      'read:own_schedule',
    ],
    lecturerRole: [
      'read:own_profile',
      'read:own_classes',
      'write:attendance',
      'read:class_reports',
    ],
    adminRole: [
      'read:all_profiles',
      'write:all_profiles',
      'read:all_reports',
      'write:system_settings',
    ],
  };
}
