import '../entities/attendance_entity.dart';
import '../entities/attendance_session_entity.dart';
import '../entities/class_info_entity.dart';
import '../entities/student_attendance_status_entity.dart';

abstract class AttendanceRepository {
  Future<AttendanceSessionEntity> startSession(String classId);
  Future<void> endSession(String sessionId);
  Future<void> studentCheckIn(String sessionId);
  Future<List<AttendanceEntity>> getAttendanceHistory(String classId);
  Future<void> manualCheckIn(String sessionId, String studentId);
  Future<void> syncPendingCheckIns();
  Future<void> retryFailedOperations();
  Future<Map<String, dynamic>?> getOfflineSessionData(String sessionId);
  Future<List<AttendanceSessionEntity>> getActiveSessions();
  Future<ClassInfoEntity> getClassInfo(String classId);
  Future<StudentAttendanceStatusEntity> getStudentAttendanceStatus(
      String classId, String studentId);
  Future<List<Map<String, dynamic>>> getClassSchedule(String classId);
  Future<Map<String, dynamic>> getClassStats(String classId);
}
