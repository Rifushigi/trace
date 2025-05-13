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
