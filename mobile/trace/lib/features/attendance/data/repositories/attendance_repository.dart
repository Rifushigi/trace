import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/attendance_model.dart';
import '../services/attendance_api_service.dart';
import '../services/attendance_local_storage.dart';
import '../services/attendance_cache_service.dart';
import '../../../../core/services/connectivity_service.dart';

part 'attendance_repository.g.dart';

abstract class AttendanceRepository {
  Future<AttendanceModel> startSession(String classId);
  Future<void> endSession(String sessionId);
  Future<void> manualCheckIn(String sessionId, String studentId);
  Future<void> studentCheckIn(String sessionId);
  Future<List<AttendanceModel>> getAttendanceHistory(String classId);
  Future<Map<String, dynamic>> getClassInfo(String classId);
  Future<void> syncPendingCheckIns();
  Future<Map<String, dynamic>?> getOfflineSessionData(String sessionId);
  Future<void> retryFailedOperations();
  Future<List<AttendanceModel>> getActiveSessions();
  Future<Map<String, dynamic>> getStudentAttendanceStatus(String classId, String studentId);
  Future<List<Map<String, dynamic>>> getClassSchedule(String classId);
  Future<Map<String, dynamic>> getClassStats(String classId);
}

@riverpod
class AttendanceRepositoryImpl extends _$AttendanceRepositoryImpl implements AttendanceRepository {
  @override
  Future<AttendanceModel> startSession(String classId) async {
    if (await _isOnline()) {
      try {
        final session = await ref.read(attendanceApiServiceProvider).startSession(classId);
        await ref.read(attendanceLocalStorageProvider).storeOfflineSession(session.id, session.toJson());
        
        // Update active sessions cache
        final activeSessions = await getActiveSessions();
        activeSessions.add(session);
        await ref.read(attendanceCacheServiceProvider).cacheActiveSessions(activeSessions);
        
        return session;
      } catch (e) {
        // If API call fails, try to get from offline storage
        final offlineSessions = await ref.read(attendanceLocalStorageProvider).getOfflineSessions();
        final sessionData = offlineSessions.values.firstWhere(
          (session) => session['classId'] == classId && session['status'] == 'active',
          orElse: () => throw Exception('No active session found'),
        );
        return AttendanceModel.fromJson(sessionData);
      }
    } else {
      // Create offline session
      final session = AttendanceModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        classId: classId,
        startTime: DateTime.now(),
        status: 'active',
        checkIns: [],
      );
      await ref.read(attendanceLocalStorageProvider).storeOfflineSession(session.id, session.toJson());
      await ref.read(attendanceLocalStorageProvider).addToSyncQueue('startSession', {
        'classId': classId,
        'sessionId': session.id,
      });
      return session;
    }
  }

  @override
  Future<void> endSession(String sessionId) async {
    if (await _isOnline()) {
      try {
        await ref.read(attendanceApiServiceProvider).endSession(sessionId);
        await ref.read(attendanceLocalStorageProvider).addToSyncQueue('endSession', {
          'sessionId': sessionId,
        });
        
        // Update active sessions cache
        final activeSessions = await getActiveSessions();
        activeSessions.removeWhere((session) => session.id == sessionId);
        await ref.read(attendanceCacheServiceProvider).cacheActiveSessions(activeSessions);
      } catch (e) {
        await ref.read(attendanceLocalStorageProvider).addToSyncQueue('endSession', {
          'sessionId': sessionId,
          'error': e.toString(),
        });
        rethrow;
      }
    } else {
      await ref.read(attendanceLocalStorageProvider).addToSyncQueue('endSession', {
        'sessionId': sessionId,
        'timestamp': DateTime.now().toIso8601String(),
      });
    }
  }

  @override
  Future<void> manualCheckIn(String sessionId, String studentId) async {
    if (await _isOnline()) {
      try {
        await ref.read(attendanceApiServiceProvider).manualCheckIn(sessionId, studentId);
        await ref.read(attendanceLocalStorageProvider).removePendingCheckIn(sessionId, studentId);
        
        // Update student attendance status cache
        final status = await getStudentAttendanceStatus(sessionId, studentId);
        await ref.read(attendanceCacheServiceProvider).cacheStudentAttendanceStatus(
          sessionId,
          studentId,
          status,
        );
      } catch (e) {
        await ref.read(attendanceLocalStorageProvider).storePendingCheckIn(sessionId, studentId);
        await ref.read(attendanceLocalStorageProvider).addToSyncQueue('manualCheckIn', {
          'sessionId': sessionId,
          'studentId': studentId,
          'error': e.toString(),
        });
        rethrow;
      }
    } else {
      await ref.read(attendanceLocalStorageProvider).storePendingCheckIn(sessionId, studentId);
    }
  }

  @override
  Future<List<AttendanceModel>> getActiveSessions() async {
    // Try cache first
    final cachedSessions = await ref.read(attendanceCacheServiceProvider).getCachedActiveSessions();
    if (cachedSessions != null) {
      return cachedSessions;
    }

    if (await _isOnline()) {
      try {
        final sessions = await ref.read(attendanceApiServiceProvider).getActiveSessions();
        await ref.read(attendanceCacheServiceProvider).cacheActiveSessions(sessions);
        return sessions;
      } catch (e) {
        // If API call fails, try to get from offline storage
        final offlineSessions = await ref.read(attendanceLocalStorageProvider).getOfflineSessions();
        final activeSessions = offlineSessions.values
            .where((session) => session['status'] == 'active')
            .map((session) => AttendanceModel.fromJson(session))
            .toList();
        await ref.read(attendanceCacheServiceProvider).cacheActiveSessions(activeSessions);
        return activeSessions;
      }
    } else {
      final offlineSessions = await ref.read(attendanceLocalStorageProvider).getOfflineSessions();
      return offlineSessions.values
          .where((session) => session['status'] == 'active')
          .map((session) => AttendanceModel.fromJson(session))
          .toList();
    }
  }

  @override
  Future<Map<String, dynamic>> getStudentAttendanceStatus(String classId, String studentId) async {
    // Try cache first
    final cachedStatus = await ref.read(attendanceCacheServiceProvider)
        .getCachedStudentAttendanceStatus(classId, studentId);
    if (cachedStatus != null) {
      return cachedStatus;
    }

    if (await _isOnline()) {
      try {
        final status = await ref.read(attendanceApiServiceProvider)
            .getStudentAttendanceStatus(classId, studentId);
        await ref.read(attendanceCacheServiceProvider)
            .cacheStudentAttendanceStatus(classId, studentId, status);
        return status;
      } catch (e) {
        // If API call fails, try to get from offline storage
        final history = await getAttendanceHistory(classId);
        final studentHistory = history.where((record) => record.studentId == studentId).toList();
        final status = {
          'totalSessions': studentHistory.length,
          'presentCount': studentHistory.where((record) => record.status == 'present').length,
          'absentCount': studentHistory.where((record) => record.status == 'absent').length,
          'lastUpdated': DateTime.now().toIso8601String(),
        };
        await ref.read(attendanceCacheServiceProvider)
            .cacheStudentAttendanceStatus(classId, studentId, status);
        return status;
      }
    } else {
      throw Exception('No cached student attendance status available');
    }
  }

  @override
  Future<List<Map<String, dynamic>>> getClassSchedule(String classId) async {
    // Try cache first
    final cachedSchedule = await ref.read(attendanceCacheServiceProvider)
        .getCachedClassSchedule(classId);
    if (cachedSchedule != null) {
      return cachedSchedule;
    }

    if (await _isOnline()) {
      try {
        final schedule = await ref.read(attendanceApiServiceProvider).getClassSchedule(classId);
        await ref.read(attendanceCacheServiceProvider).cacheClassSchedule(classId, schedule);
        return schedule;
      } catch (e) {
        throw Exception('Failed to fetch class schedule: $e');
      }
    } else {
      throw Exception('No cached class schedule available');
    }
  }

  @override
  Future<Map<String, dynamic>> getClassStats(String classId) async {
    // Try cache first
    final cachedStats = await ref.read(attendanceCacheServiceProvider)
        .getCachedClassStats(classId);
    if (cachedStats != null) {
      return cachedStats;
    }

    if (await _isOnline()) {
      try {
        final stats = await ref.read(attendanceApiServiceProvider).getClassStats(classId);
        await ref.read(attendanceCacheServiceProvider).cacheClassStats(classId, stats);
        return stats;
      } catch (e) {
        // If API call fails, calculate from cached history
        final history = await getAttendanceHistory(classId);
        final stats = {
          'totalSessions': history.length,
          'averageAttendance': history.where((record) => record.status == 'present').length / history.length,
          'lastUpdated': DateTime.now().toIso8601String(),
        };
        await ref.read(attendanceCacheServiceProvider).cacheClassStats(classId, stats);
        return stats;
      }
    } else {
      throw Exception('No cached class statistics available');
    }
  }

  @override
  Future<void> studentCheckIn(String sessionId) async {
    if (!await _isOnline()) {
      throw Exception('Internet connection required for student check-in');
    }
    await ref.read(attendanceApiServiceProvider).studentCheckIn(sessionId);
  }

  @override
  Future<List<AttendanceModel>> getAttendanceHistory(String classId) async {
    if (await _isOnline()) {
      try {
        final history = await ref.read(attendanceApiServiceProvider).getAttendanceHistory(classId);
        await ref.read(attendanceLocalStorageProvider).cacheAttendanceHistory(classId, history);
        return history;
      } catch (e) {
        // If API call fails, try to get from cache
        final cachedHistory = await ref.read(attendanceLocalStorageProvider).getCachedAttendanceHistory();
        final classHistory = cachedHistory[classId];
        if (classHistory != null) {
          return classHistory.map((json) => AttendanceModel.fromJson(json)).toList();
        }
        rethrow;
      }
    } else {
      // Get from cache
      final cachedHistory = await ref.read(attendanceLocalStorageProvider).getCachedAttendanceHistory();
      final classHistory = cachedHistory[classId];
      if (classHistory != null) {
        return classHistory.map((json) => AttendanceModel.fromJson(json)).toList();
      }
      throw Exception('No cached attendance history available');
    }
  }

  @override
  Future<Map<String, dynamic>> getClassInfo(String classId) async {
    if (await _isOnline()) {
      try {
        final classInfo = await ref.read(attendanceApiServiceProvider).getClassInfo(classId);
        await ref.read(attendanceLocalStorageProvider).cacheClassInfo(classId, classInfo);
        return classInfo;
      } catch (e) {
        // If API call fails, try to get from cache
        final cachedInfo = await ref.read(attendanceLocalStorageProvider).getCachedClassInfo();
        final info = cachedInfo[classId];
        if (info != null) {
          return info;
        }
        rethrow;
      }
    } else {
      // Get from cache
      final cachedInfo = await ref.read(attendanceLocalStorageProvider).getCachedClassInfo();
      final info = cachedInfo[classId];
      if (info != null) {
        return info;
      }
      throw Exception('No cached class information available');
    }
  }

  @override
  Future<void> syncPendingCheckIns() async {
    if (!await _isOnline()) {
      throw Exception('Internet connection required for synchronization');
    }

    final pendingCheckIns = await ref.read(attendanceLocalStorageProvider).getPendingCheckIns();
    for (final checkIn in pendingCheckIns) {
      try {
        await ref.read(attendanceApiServiceProvider).manualCheckIn(
          checkIn['sessionId'],
          checkIn['studentId'],
        );
        await ref.read(attendanceLocalStorageProvider).removePendingCheckIn(
          checkIn['sessionId'],
          checkIn['studentId'],
        );
      } catch (e) {
        await ref.read(attendanceLocalStorageProvider).updatePendingCheckInRetry(
          checkIn['sessionId'],
          checkIn['studentId'],
        );
      }
    }
  }

  @override
  Future<Map<String, dynamic>?> getOfflineSessionData(String sessionId) async {
    final offlineSessions = await ref.read(attendanceLocalStorageProvider).getOfflineSessions();
    return offlineSessions[sessionId];
  }

  @override
  Future<void> retryFailedOperations() async {
    if (!await _isOnline()) {
      throw Exception('Internet connection required for retrying operations');
    }

    final syncQueue = await ref.read(attendanceLocalStorageProvider).getSyncQueue();
    for (int i = 0; i < syncQueue.length; i++) {
      final operation = syncQueue[i];
      try {
        switch (operation['operation']) {
          case 'startSession':
            await ref.read(attendanceApiServiceProvider).startSession(operation['data']['classId']);
            break;
          case 'endSession':
            await ref.read(attendanceApiServiceProvider).endSession(operation['data']['sessionId']);
            break;
          case 'manualCheckIn':
            await ref.read(attendanceApiServiceProvider).manualCheckIn(
              operation['data']['sessionId'],
              operation['data']['studentId'],
            );
            break;
        }
        await ref.read(attendanceLocalStorageProvider).removeFromSyncQueue(i);
      } catch (e) {
        // Update retry count and last attempt
        operation['retryCount'] = (operation['retryCount'] ?? 0) + 1;
        operation['lastAttempt'] = DateTime.now().toIso8601String();
        operation['error'] = e.toString();
        
        // If too many retries, remove from queue
        if (operation['retryCount'] > 3) {
          await ref.read(attendanceLocalStorageProvider).removeFromSyncQueue(i);
        }
      }
    }
  }

  Future<bool> _isOnline() async {
    return await ref.read(connectivityServiceProvider).isConnected();
  }
}

@riverpod
AttendanceRepository attendanceRepository(AttendanceRepositoryRef ref) {
  return AttendanceRepositoryImpl(ref);
} 