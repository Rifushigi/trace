class Endpoints {
  static const String baseUrl = 'http://localhost:3000/api/v1';

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
}

class _ClassEndpoints {
  String get getLecturerClasses => '${Endpoints.baseUrl}/class/lecturer';
  String get getEnrolledClasses => '${Endpoints.baseUrl}/class/enrolled';
  String get getClassDetails => '${Endpoints.baseUrl}/class/:classId';
  String get createClass => '${Endpoints.baseUrl}/class';
  String get updateClass => '${Endpoints.baseUrl}/class/:classId';
  String get deleteClass => '${Endpoints.baseUrl}/class/:classId';
  String get searchClasses => '${Endpoints.baseUrl}/class/search';
  String get enrollStudent =>
      '${Endpoints.baseUrl}/class/:classId/students/:studentId';
  String get unenrollStudent =>
      '${Endpoints.baseUrl}/class/:classId/students/:studentId';

  String getClassDetailsUrl(String classId) =>
      getClassDetails.replaceAll(':classId', classId);
  String updateClassUrl(String classId) =>
      updateClass.replaceAll(':classId', classId);
  String deleteClassUrl(String classId) =>
      deleteClass.replaceAll(':classId', classId);
  String enrollStudentUrl(String classId, String studentId) => enrollStudent
      .replaceAll(':classId', classId)
      .replaceAll(':studentId', studentId);
  String unenrollStudentUrl(String classId, String studentId) => unenrollStudent
      .replaceAll(':classId', classId)
      .replaceAll(':studentId', studentId);
}

class _AuthEndpoints {
  static const String signIn = '${Endpoints.baseUrl}/auth/signin';
  static const String signUp = '${Endpoints.baseUrl}/auth/signup';
  static const String signOut = '${Endpoints.baseUrl}/auth/signout';
  static const String refreshToken = '${Endpoints.baseUrl}/auth/refresh-token';
  static const String sendOtp = '${Endpoints.baseUrl}/auth/send-otp';
  static const String verifyOtp = '${Endpoints.baseUrl}/auth/verify-otp';
  static const String sendVerificationEmail =
      '${Endpoints.baseUrl}/auth/send-verification-email';
  static const String verifyEmail = '${Endpoints.baseUrl}/auth/verify-email';
}

class _ProfileEndpoints {
  static const String getProfile = '${Endpoints.baseUrl}/profile';
  static const String updateProfile = '${Endpoints.baseUrl}/profile';
  static const String uploadAvatar = '${Endpoints.baseUrl}/profile/avatar';
}

class _AttendanceEndpoints {
  static const String startSession = '${Endpoints.baseUrl}/attendance/sessions';
  static const String endSession =
      '${Endpoints.baseUrl}/attendance/sessions/:sessionId/end';
  static const String checkIn = '${Endpoints.baseUrl}/attendance/check-in';
  static const String getSessionAttendance =
      '${Endpoints.baseUrl}/attendance/sessions/:sessionId';
  static const String getStudentAttendanceHistory =
      '${Endpoints.baseUrl}/attendance/students/:studentId/classes/:classId';
  static const String autoCheckIn =
      '${Endpoints.baseUrl}/attendance/auto-checkin';

  static String endSessionUrl(String sessionId) =>
      endSession.replaceAll(':sessionId', sessionId);
  static String getSessionAttendanceUrl(String sessionId) =>
      getSessionAttendance.replaceAll(':sessionId', sessionId);
  static String getStudentAttendanceHistoryUrl(
          String studentId, String classId) =>
      getStudentAttendanceHistory
          .replaceAll(':studentId', studentId)
          .replaceAll(':classId', classId);
}

class _UserEndpoints {
  final String profile = '${Endpoints.baseUrl}/users/profile';
  final String updateProfile = '${Endpoints.baseUrl}/users/profile';
  final String uploadAvatar = '${Endpoints.baseUrl}/users/upload-avatar';
}

class _CourseEndpoints {
  final String list = '${Endpoints.baseUrl}/courses';
  final String details = '${Endpoints.baseUrl}/courses/:id';
}
