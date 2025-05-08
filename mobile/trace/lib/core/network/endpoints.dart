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
  final String signIn = '${Endpoints.baseUrl}/auth/signin';
  final String signUp = '${Endpoints.baseUrl}/auth/signup';
  final String signOut = '${Endpoints.baseUrl}/auth/signout';
  final String refreshToken = '${Endpoints.baseUrl}/auth/refresh-token';
  final String sendOtp = '${Endpoints.baseUrl}/auth/send-otp';
  final String verifyOtp = '${Endpoints.baseUrl}/auth/verify-otp';
  final String sendVerificationEmail =
      '${Endpoints.baseUrl}/auth/send-verification-email';
  final String verifyEmail = '${Endpoints.baseUrl}/auth/verify-email';
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
