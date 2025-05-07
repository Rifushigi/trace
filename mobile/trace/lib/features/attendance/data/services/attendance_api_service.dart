import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/network/api_client.dart';
import '../models/attendance_model.dart';

part 'attendance_api_service.g.dart';

@riverpod
AttendanceApiService attendanceApiService(AttendanceApiServiceRef ref) {
  return AttendanceApiService(ref.watch(apiClientProvider));
}

class AttendanceApiService {
  final ApiClient _apiClient;

  AttendanceApiService(this._apiClient);

  Future<AttendanceModel> startSession(String classId) async {
    final response = await _apiClient
        .post('/attendance/sessions', data: {'classId': classId});
    return AttendanceModel.fromJson(response.data['data']);
  }

  Future<void> endSession(String sessionId) async {
    await _apiClient.put('/attendance/sessions/$sessionId/end');
  }

  Future<void> manualCheckIn(String sessionId, String studentId) async {
    await _apiClient.post('/attendance/check-in', data: {
      'sessionId': sessionId,
      'studentId': studentId,
    });
  }

  Future<void> studentCheckIn(String sessionId) async {
    await _apiClient
        .post('/attendance/check-in', data: {'sessionId': sessionId});
  }

  Future<List<AttendanceModel>> getAttendanceHistory(String classId) async {
    final response = await _apiClient.get('/attendance/history/$classId');
    return (response.data['data'] as List)
        .map((json) => AttendanceModel.fromJson(json))
        .toList();
  }

  Future<Map<String, dynamic>> getClassInfo(String classId) async {
    final response = await _apiClient.get('/classes/$classId');
    return response.data['data'];
  }

  Future<List<AttendanceModel>> getActiveSessions() async {
    final response = await _apiClient.get('/attendance/sessions/active');
    return (response.data['data'] as List)
        .map((json) => AttendanceModel.fromJson(json))
        .toList();
  }

  Future<Map<String, dynamic>> getStudentAttendanceStatus(
      String classId, String studentId) async {
    final response =
        await _apiClient.get('/attendance/status/$classId/$studentId');
    return response.data['data'];
  }

  Future<List<Map<String, dynamic>>> getClassSchedule(String classId) async {
    final response = await _apiClient.get('/classes/$classId/schedule');
    return List<Map<String, dynamic>>.from(response.data['data']);
  }

  Future<Map<String, dynamic>> getClassStats(String classId) async {
    final response = await _apiClient.get('/classes/$classId/stats');
    return response.data['data'];
  }
}
