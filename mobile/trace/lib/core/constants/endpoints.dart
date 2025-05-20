/// Constants for API endpoints.
class Endpoints {
  /// Private constructor to prevent instantiation.
  const Endpoints._();

  /// Authentication endpoints.
  static const auth = _AuthEndpoints();

  /// Admin endpoints.
  static const admin = _AdminEndpoints();

  /// Class management endpoints.
  static const classes = _ClassEndpoints();

  /// Attendance endpoints.
  static const attendance = _AttendanceEndpoints();
}

/// Authentication endpoints.
class _AuthEndpoints {
  /// Private constructor to prevent instantiation.
  const _AuthEndpoints();

  /// Sign in endpoint.
  String get signIn => '/auth/sign-in';

  /// Sign up endpoint.
  String get signUp => '/auth/sign-up';

  /// Forgot password endpoint.
  String get forgotPassword => '/auth/forgot-password';

  /// Reset password endpoint.
  String get resetPassword => '/auth/reset-password';

  /// Verify email endpoint.
  String get verifyEmail => '/auth/verify-email';

  /// Resend verification email endpoint.
  String get resendVerification => '/auth/resend-verification';
}

/// Admin endpoints.
class _AdminEndpoints {
  /// Private constructor to prevent instantiation.
  const _AdminEndpoints();

  /// Users management endpoint.
  String get users => '/admin/users';

  /// Classes management endpoint.
  String get classes => '/admin/classes';

  /// Reports endpoint.
  String get reports => '/admin/reports';

  /// Settings endpoint.
  String get settings => '/admin/settings';
}

/// Class management endpoints.
class _ClassEndpoints {
  /// Private constructor to prevent instantiation.
  const _ClassEndpoints();

  /// List classes endpoint.
  String get list => '/classes';

  /// Create class endpoint.
  String get create => '/classes';

  /// Get class details endpoint.
  String details(String classId) => '/classes/$classId';

  /// Update class endpoint.
  String update(String classId) => '/classes/$classId';

  /// Delete class endpoint.
  String delete(String classId) => '/classes/$classId';

  /// Class statistics endpoint.
  String statistics(String classId) => '/classes/$classId/statistics';
}

/// Attendance endpoints.
class _AttendanceEndpoints {
  /// Private constructor to prevent instantiation.
  const _AttendanceEndpoints();

  /// Start attendance session endpoint.
  String startSession(String classId) => '/attendance/$classId/start';

  /// End attendance session endpoint.
  String endSession(String classId) => '/attendance/$classId/end';

  /// Mark attendance endpoint.
  String markAttendance(String classId) => '/attendance/$classId/mark';

  /// Get attendance history endpoint.
  String history(String classId) => '/attendance/$classId/history';

  /// Get attendance details endpoint.
  String details(String sessionId) => '/attendance/sessions/$sessionId';
}
