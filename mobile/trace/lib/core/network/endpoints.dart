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

  static class Endpoints {
    static const String getLecturerClasses = '$baseUrl/class/lecturer';
    static const String getEnrolledClasses = '$baseUrl/class/enrolled';
    static const String getClassDetails = '$baseUrl/class/:classId';
    static const String createClass = '$baseUrl/class';
    static const String updateClass = '$baseUrl/class/:classId';
    static const String deleteClass = '$baseUrl/class/:classId';
    static const String searchClasses = '$baseUrl/class/search';
    static const String enrollStudent = '$baseUrl/class/:classId/students/:studentId';
    static const String unenrollStudent = '$baseUrl/class/:classId/students/:studentId';

    static String getClassDetails(String classId) => getClassDetails.replaceAll(':classId', classId);
    static String updateClass(String classId) => updateClass.replaceAll(':classId', classId);
    static String deleteClass(String classId) => deleteClass.replaceAll(':classId', classId);
    static String enrollStudent(String classId, String studentId) => 
        enrollStudent
            .replaceAll(':classId', classId)
            .replaceAll(':studentId', studentId);
    static String unenrollStudent(String classId, String studentId) => 
        unenrollStudent
            .replaceAll(':classId', classId)
            .replaceAll(':studentId', studentId);
  }

  static class Auth {
    static const String signIn = '$baseUrl/auth/signin';
    static const String signUp = '$baseUrl/auth/signup';
    static const String signOut = '$baseUrl/auth/signout';
    static const String refreshToken = '$baseUrl/auth/refresh-token';
    static const String sendOtp = '$baseUrl/auth/send-otp';
    static const String verifyOtp = '$baseUrl/auth/verify-otp';
    static const String sendVerificationEmail = '$baseUrl/auth/send-verification-email';
    static const String verifyEmail = '$baseUrl/auth/verify-email';
  }

  static class Profile {
    static const String getProfile = '$baseUrl/profile';
    static const String updateProfile = '$baseUrl/profile';
    static const String uploadAvatar = '$baseUrl/profile/avatar';
  }

  static class Attendance {
    static const String startSession = '$baseUrl/attendance/sessions';
    static const String endSession = '$baseUrl/attendance/sessions/:sessionId/end';
    static const String checkIn = '$baseUrl/attendance/check-in';
    static const String getSessionAttendance = '$baseUrl/attendance/sessions/:sessionId';
    static const String getStudentAttendanceHistory = '$baseUrl/attendance/students/:studentId/classes/:classId';
    static const String autoCheckIn = '$baseUrl/attendance/auto-checkin';

    static String endSession(String sessionId) => endSession.replaceAll(':sessionId', sessionId);
    static String getSessionAttendance(String sessionId) => getSessionAttendance.replaceAll(':sessionId', sessionId);
    static String getStudentAttendanceHistory(String studentId, String classId) =>
        getStudentAttendanceHistory
            .replaceAll(':studentId', studentId)
            .replaceAll(':classId', classId);
  }
}

class _AuthEndpoints {
  final String signIn = '${Endpoints.baseUrl}/auth/signin';
  final String signUp = '${Endpoints.baseUrl}/users/signup';
  final String signOut = '${Endpoints.baseUrl}/auth/signout';
  final String refreshToken = '${Endpoints.baseUrl}/auth/refresh-token';
  final String sendOtp = '${Endpoints.baseUrl}/auth/send-otp';
  final String verifyOtp = '${Endpoints.baseUrl}/auth/verify-otp';
  final String sendVerificationEmail = '${Endpoints.baseUrl}/auth/send-verification-email';
  final String verifyEmail = '${Endpoints.baseUrl}/auth/verify-email';
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

class _AttendanceEndpoints {
  final String list = '${Endpoints.baseUrl}/attendance';
  final String details = '${Endpoints.baseUrl}/attendance/:id';
  final String sessions = '${Endpoints.baseUrl}/attendance/sessions';
  final String manualCheckIn = '${Endpoints.baseUrl}/attendance/check-in';
  final String autoCheckIn = '${Endpoints.baseUrl}/attendance/auto-checkin';
  final String classReport = '${Endpoints.baseUrl}/attendance/classes/:classId/report';
  final String studentReport = '${Endpoints.baseUrl}/attendance/students/:studentId/classes/:classId/report';
  final String export = '${Endpoints.baseUrl}/attendance/classes/:classId/export';
} 