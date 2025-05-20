import 'dart:convert';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:riverpod/riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../domain/repositories/attendance_repository.dart';
import '../../domain/entities/attendance_entity.dart';
// import '../models/attendance_model.dart'; // Removed broken import
import '../../domain/entities/attendance_session_entity.dart';
import '../../domain/entities/class_info_entity.dart';
import '../../domain/entities/student_attendance_status_entity.dart';

part 'attendance_repository_impl.g.dart';

@riverpod
AttendanceRepository attendanceRepository(Ref ref) {
  return AttendanceRepositoryImpl(ref);
}

class AttendanceRepositoryImpl implements AttendanceRepository {
  final Ref ref;

  AttendanceRepositoryImpl(this.ref);

  Future<SharedPreferences> get _prefs async =>
      await SharedPreferences.getInstance();

  @override
  Future<AttendanceSessionEntity> startSession(String classId) async {
    final prefs = await _prefs;
    final sessionId = DateTime.now().millisecondsSinceEpoch.toString();
    final session = AttendanceSessionEntity(
      id: sessionId,
      classId: classId,
      startTime: DateTime.now(),
      endTime: null,
      isActive: true,
      checkedInStudents: [],
    );
    // Store session in active_sessions
    final sessionsJson = prefs.getString('active_sessions');
    List<dynamic> sessions =
        sessionsJson != null ? jsonDecode(sessionsJson) : [];
    sessions.add(session.toJson());
    await prefs.setString('active_sessions', jsonEncode(sessions));
    // Store session details
    await prefs.setString(
        'offline_session_$sessionId', jsonEncode(session.toJson()));
    return session;
  }

  @override
  Future<void> endSession(String sessionId) async {
    final prefs = await _prefs;
    // Update session in active_sessions
    final sessionsJson = prefs.getString('active_sessions');
    if (sessionsJson == null) return;
    List<dynamic> sessions = jsonDecode(sessionsJson);
    for (var i = 0; i < sessions.length; i++) {
      if (sessions[i]['id'] == sessionId) {
        sessions[i]['endTime'] = DateTime.now().toIso8601String();
        sessions[i]['isActive'] = false;
        break;
      }
    }
    await prefs.setString('active_sessions', jsonEncode(sessions));
    // Update offline session
    final sessionJson = prefs.getString('offline_session_$sessionId');
    if (sessionJson != null) {
      final sessionMap = jsonDecode(sessionJson);
      sessionMap['endTime'] = DateTime.now().toIso8601String();
      sessionMap['isActive'] = false;
      await prefs.setString(
          'offline_session_$sessionId', jsonEncode(sessionMap));
    }
  }

  @override
  Future<void> studentCheckIn(String sessionId) async {
    final prefs = await _prefs;
    // For demo, use a dummy studentId
    const studentId = 'current_student';
    final sessionJson = prefs.getString('offline_session_$sessionId');
    if (sessionJson == null) throw Exception('Session not found');
    final sessionMap = jsonDecode(sessionJson);
    final checkedIn = List<String>.from(sessionMap['checkedInStudents'] ?? []);
    if (!checkedIn.contains(studentId)) {
      checkedIn.add(studentId);
      sessionMap['checkedInStudents'] = checkedIn;
      await prefs.setString(
          'offline_session_$sessionId', jsonEncode(sessionMap));
    }
  }

  @override
  Future<List<AttendanceEntity>> getAttendanceHistory(String classId) async {
    final prefs = await _prefs;
    final historyJson = prefs.getString('attendance_history_$classId');
    if (historyJson == null) return [];
    final List<dynamic> decoded = jsonDecode(historyJson);
    // Since AttendanceModel is missing, use AttendanceEntity.fromJson directly
    return decoded.map((json) => AttendanceEntity.fromJson(json)).toList();
  }

  @override
  Future<void> manualCheckIn(String sessionId, String studentId) async {
    final prefs = await _prefs;
    final sessionJson = prefs.getString('offline_session_$sessionId');
    if (sessionJson == null) throw Exception('Session not found');
    final sessionMap = jsonDecode(sessionJson);
    final checkedIn = List<String>.from(sessionMap['checkedInStudents'] ?? []);
    if (!checkedIn.contains(studentId)) {
      checkedIn.add(studentId);
      sessionMap['checkedInStudents'] = checkedIn;
      await prefs.setString(
          'offline_session_$sessionId', jsonEncode(sessionMap));
    }
  }

  @override
  Future<void> syncPendingCheckIns() async {
    // Simulate sync: no-op for local storage
    return;
  }

  @override
  Future<void> retryFailedOperations() async {
    // Simulate retry: no-op for local storage
    return;
  }

  @override
  Future<Map<String, dynamic>?> getOfflineSessionData(String sessionId) async {
    final prefs = await _prefs;
    final sessionJson = prefs.getString('offline_session_$sessionId');
    if (sessionJson == null) return null;
    return jsonDecode(sessionJson);
  }

  @override
  Future<List<AttendanceSessionEntity>> getActiveSessions() async {
    final prefs = await _prefs;
    final sessionsJson = prefs.getString('active_sessions');
    if (sessionsJson == null) return [];
    final List<dynamic> decoded = jsonDecode(sessionsJson);
    return decoded
        .map((json) => AttendanceSessionEntity.fromJson(json))
        .toList();
  }

  @override
  Future<ClassInfoEntity> getClassInfo(String classId) async {
    final prefs = await _prefs;
    final infoJson = prefs.getString('class_info_$classId');
    if (infoJson == null) throw Exception('Class info not found');
    return ClassInfoEntity.fromJson(jsonDecode(infoJson));
  }

  @override
  Future<StudentAttendanceStatusEntity> getStudentAttendanceStatus(
      String classId, String studentId) async {
    final prefs = await _prefs;
    final statusJson = prefs.getString('student_status_${classId}_$studentId');
    if (statusJson == null) throw Exception('Student status not found');
    return StudentAttendanceStatusEntity.fromJson(jsonDecode(statusJson));
  }

  @override
  Future<List<Map<String, dynamic>>> getClassSchedule(String classId) async {
    final prefs = await _prefs;
    final scheduleJson = prefs.getString('class_schedule_$classId');
    if (scheduleJson == null) throw Exception('Class schedule not found');
    final List<dynamic> decoded = jsonDecode(scheduleJson);
    return decoded.map((item) => Map<String, dynamic>.from(item)).toList();
  }

  @override
  Future<Map<String, dynamic>> getClassStats(String classId) async {
    final prefs = await _prefs;
    final statsJson = prefs.getString('class_stats_$classId');
    if (statsJson == null) throw Exception('Class stats not found');
    return jsonDecode(statsJson);
  }
}
