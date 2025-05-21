class Endpoints {
  // Using the machine's IP address for wireless testing on physical devices
  // Replace 192.168.1.100 with your actual development machine's IP address
  static const String baseUrl = 'http://192.168.1.133:3000/api/v1';

  // Auth endpoints
  static final auth = _AuthEndpoints();

  // User endpoints
  static final user = _UserEndpoints();

  // Course endpoints
  static final course = _CourseEndpoints();

  // Attendance endpoints
  static final attendance = _AttendanceEndpoints();

  // Class endpoints
  static final classes = _ClassEndpoints();

  // Admin endpoints
  static final admin = _AdminEndpoints();

  // Dashboard endpoints
  static final dashboard = _DashboardEndpoints();
}

class _ClassEndpoints {
  String get lecturerClasses => '${Endpoints.baseUrl}/class/lecturer';
  String get enrolledClasses => '${Endpoints.baseUrl}/class/enrolled';
  String get search => '${Endpoints.baseUrl}/class/search';
  String get create => '${Endpoints.baseUrl}/class';

  String details(String classId) => '${Endpoints.baseUrl}/class/$classId';
  String update(String classId) => '${Endpoints.baseUrl}/class/$classId';
  String delete(String classId) => '${Endpoints.baseUrl}/class/$classId';
  String statistics(String classId) =>
      '${Endpoints.baseUrl}/class/$classId/statistics';
  String enroll(String classId) =>
      '${Endpoints.baseUrl}/class/$classId/students';
  String unenroll(String classId) =>
      '${Endpoints.baseUrl}/class/$classId/students';
}

class _AuthEndpoints {
  final String signIn = '${Endpoints.baseUrl}/auth/signin';
  final String signUp = '${Endpoints.baseUrl}/users/signup';
  final String signOut = '${Endpoints.baseUrl}/auth/signout';
  final String refreshToken = '${Endpoints.baseUrl}/auth/refresh-token';
  final String sendOtp = '${Endpoints.baseUrl}/auth/otp/send';
  final String verifyOtp = '${Endpoints.baseUrl}/auth/otp/verify';
  final String sendVerificationEmail =
      '${Endpoints.baseUrl}/auth/email/send-verification';
  final String verifyEmail = '${Endpoints.baseUrl}/auth/email/verify';
}

class _UserEndpoints {
  final String profile = '${Endpoints.baseUrl}/users/profile';
  final String updateProfile = '${Endpoints.baseUrl}/users/profile';
  final String uploadAvatar = '${Endpoints.baseUrl}/users/upload-avatar';
}

class _AttendanceEndpoints {
  final String startSession = '${Endpoints.baseUrl}/attendance/sessions';
  final String endSession =
      '${Endpoints.baseUrl}/attendance/sessions/:sessionId/end';
  final String checkIn = '${Endpoints.baseUrl}/attendance/check-in';
  final String getSessionAttendance =
      '${Endpoints.baseUrl}/attendance/sessions/:sessionId';
  final String getStudentAttendanceHistory =
      '${Endpoints.baseUrl}/attendance/students/:studentId/classes/:classId';
  final String autoCheckIn = '${Endpoints.baseUrl}/attendance/auto-checkin';

  String endSessionUrl(String sessionId) =>
      endSession.replaceAll(':sessionId', sessionId);
  String getSessionAttendanceUrl(String sessionId) =>
      getSessionAttendance.replaceAll(':sessionId', sessionId);
  String getStudentAttendanceHistoryUrl(String studentId, String classId) =>
      getStudentAttendanceHistory
          .replaceAll(':studentId', studentId)
          .replaceAll(':classId', classId);
}

class _CourseEndpoints {
  final String list = '${Endpoints.baseUrl}/courses';
  final String details = '${Endpoints.baseUrl}/courses/:id';
}

class _AdminEndpoints {
  final String classes = '${Endpoints.baseUrl}/admin/classes';
  final String lecturers = '${Endpoints.baseUrl}/admin/users/lecturers';
  final String createClass = '${Endpoints.baseUrl}/admin/class';
}

class _DashboardEndpoints {
  final String items = '${Endpoints.baseUrl}/dashboard/items';
  final String stats = '${Endpoints.baseUrl}/dashboard/stats';
  final String preferences = '${Endpoints.baseUrl}/dashboard/preferences';
}
