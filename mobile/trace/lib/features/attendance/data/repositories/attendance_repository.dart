import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:riverpod/riverpod.dart';
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
  Future<Map<String, dynamic>> getStudentAttendanceStatus(
      String classId, String studentId);
  Future<List<Map<String, dynamic>>> getClassSchedule(String classId);
  Future<Map<String, dynamic>> getClassStats(String classId);
}

@riverpod
AttendanceRepository attendanceRepository(AttendanceRepositoryRef ref) {
  return AttendanceRepositoryImpl(ref);
}

class AttendanceRepositoryImpl implements AttendanceRepository {
  final Ref ref;

  AttendanceRepositoryImpl(this.ref);

  @override
  Future<AttendanceModel> startSession(String classId) async {
    if (await _isOnline()) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        final session = await apiService.startSession(classId);
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        await storage.storeOfflineSession(session.sessionId, session.toJson());

        // Update active sessions cache
        final activeSessions = await getActiveSessions();
        final cacheService =
            await ref.read(attendanceCacheServiceProvider.future);
        await cacheService.cacheActiveSessions(activeSessions);

        return session;
      } catch (e) {
        // If API call fails, try to get from offline storage
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        final offlineSessions = await storage.getOfflineSessions();
        final sessionData = offlineSessions.values.firstWhere(
          (session) =>
              session['classId'] == classId && session['status'] == 'active',
          orElse: () => throw Exception('No active session found'),
        );
        return AttendanceModel.fromJson(sessionData);
      }
    } else {
      // Create offline session
      final session = AttendanceModel(
        sessionId: DateTime.now().millisecondsSinceEpoch.toString(),
        studentId: 'offline',
        timestamp: DateTime.now(),
        classId: classId,
        status: 'active',
      );
      final storage = await ref.read(attendanceLocalStorageProvider.future);
      await storage.storeOfflineSession(session.sessionId, session.toJson());
      await storage.addToSyncQueue('startSession', {
        'classId': classId,
        'sessionId': session.sessionId,
      });
      return session;
    }
  }

  @override
  Future<void> endSession(String sessionId) async {
    if (await _isOnline()) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        await apiService.endSession(sessionId);
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        await storage.addToSyncQueue('endSession', {
          'sessionId': sessionId,
        });

        // Update active sessions cache
        final activeSessions = await getActiveSessions();
        final cacheService =
            await ref.read(attendanceCacheServiceProvider.future);
        await cacheService.cacheActiveSessions(activeSessions);
      } catch (e) {
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        await storage.addToSyncQueue('endSession', {
          'sessionId': sessionId,
          'error': e.toString(),
        });
        rethrow;
      }
    } else {
      final storage = await ref.read(attendanceLocalStorageProvider.future);
      await storage.addToSyncQueue('endSession', {
        'sessionId': sessionId,
        'timestamp': DateTime.now().toIso8601String(),
      });
    }
  }

  @override
  Future<void> manualCheckIn(String sessionId, String studentId) async {
    if (await _isOnline()) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        await apiService.manualCheckIn(sessionId, studentId);
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        await storage.removePendingCheckIn(sessionId, studentId);

        // Update student attendance status cache
        final status = await getStudentAttendanceStatus(sessionId, studentId);
        final cacheService =
            await ref.read(attendanceCacheServiceProvider.future);
        await cacheService.cacheStudentAttendanceStatus(
          sessionId,
          studentId,
          status,
        );
      } catch (e) {
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        await storage.storePendingCheckIn(sessionId, studentId);
        await storage.addToSyncQueue('manualCheckIn', {
          'sessionId': sessionId,
          'studentId': studentId,
          'error': e.toString(),
        });
        rethrow;
      }
    } else {
      final storage = await ref.read(attendanceLocalStorageProvider.future);
      await storage.storePendingCheckIn(sessionId, studentId);
    }
  }

  @override
  Future<List<AttendanceModel>> getActiveSessions() async {
    // Try cache first
    final cacheService = await ref.read(attendanceCacheServiceProvider.future);
    final cachedSessions = await cacheService.getCachedActiveSessions();
    if (cachedSessions != null) {
      return cachedSessions;
    }

    if (await _isOnline()) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        final sessions = await apiService.getActiveSessions();
        await cacheService.cacheActiveSessions(sessions);
        return sessions;
      } catch (e) {
        // If API call fails, try to get from offline storage
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        final offlineSessions = await storage.getOfflineSessions();
        final activeSessions = offlineSessions.values
            .where((session) => session['status'] == 'active')
            .map((session) => AttendanceModel.fromJson(session))
            .toList();
        await cacheService.cacheActiveSessions(activeSessions);
        return activeSessions;
      }
    } else {
      final storage = await ref.read(attendanceLocalStorageProvider.future);
      final offlineSessions = await storage.getOfflineSessions();
      return offlineSessions.values
          .where((session) => session['status'] == 'active')
          .map((session) => AttendanceModel.fromJson(session))
          .toList();
    }
  }

  @override
  Future<Map<String, dynamic>> getStudentAttendanceStatus(
      String classId, String studentId) async {
    // Try cache first
    final cacheService = await ref.read(attendanceCacheServiceProvider.future);
    final cachedStatus =
        await cacheService.getCachedStudentAttendanceStatus(classId, studentId);
    if (cachedStatus != null) {
      return cachedStatus;
    }

    if (await _isOnline()) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        final status =
            await apiService.getStudentAttendanceStatus(classId, studentId);
        await cacheService.cacheStudentAttendanceStatus(
            classId, studentId, status);
        return status;
      } catch (e) {
        // If API call fails, try to get from offline storage
        final history = await getAttendanceHistory(classId);
        final studentHistory =
            history.where((record) => record.studentId == studentId).toList();
        final status = {
          'totalSessions': studentHistory.length,
          'presentCount': studentHistory
              .where((record) => record.status == 'present')
              .length,
          'absentCount': studentHistory
              .where((record) => record.status == 'absent')
              .length,
          'lastUpdated': DateTime.now().toIso8601String(),
        };
        await cacheService.cacheStudentAttendanceStatus(
            classId, studentId, status);
        return status;
      }
    } else {
      throw Exception('No cached student attendance status available');
    }
  }

  @override
  Future<List<Map<String, dynamic>>> getClassSchedule(String classId) async {
    // Try cache first
    final cacheService = await ref.read(attendanceCacheServiceProvider.future);
    final cachedSchedule = await cacheService.getCachedClassSchedule(classId);
    if (cachedSchedule != null) {
      return cachedSchedule;
    }

    if (await _isOnline()) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        final schedule = await apiService.getClassSchedule(classId);
        await cacheService.cacheClassSchedule(classId, schedule);
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
    final cacheService = await ref.read(attendanceCacheServiceProvider.future);
    final cachedStats = await cacheService.getCachedClassStats(classId);
    if (cachedStats != null) {
      return cachedStats;
    }

    if (await _isOnline()) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        final stats = await apiService.getClassStats(classId);
        await cacheService.cacheClassStats(classId, stats);
        return stats;
      } catch (e) {
        // If API call fails, calculate from cached history
        final history = await getAttendanceHistory(classId);
        final stats = {
          'totalSessions': history.length,
          'averageAttendance':
              history.where((record) => record.status == 'present').length /
                  history.length,
          'lastUpdated': DateTime.now().toIso8601String(),
        };
        await cacheService.cacheClassStats(classId, stats);
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
    final apiService = ref.read(attendanceApiServiceProvider);
    await apiService.studentCheckIn(sessionId);
  }

  @override
  Future<List<AttendanceModel>> getAttendanceHistory(String classId) async {
    if (await _isOnline()) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        final history = await apiService.getAttendanceHistory(classId);
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        await storage.cacheAttendanceHistory(classId, history);
        return history;
      } catch (e) {
        // If API call fails, try to get from cache
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        final cachedHistory = await storage.getCachedAttendanceHistory();
        final classHistory = cachedHistory[classId];
        if (classHistory != null) {
          return classHistory
              .map((json) => AttendanceModel.fromJson(json))
              .toList();
        }
        rethrow;
      }
    } else {
      // Get from cache
      final storage = await ref.read(attendanceLocalStorageProvider.future);
      final cachedHistory = await storage.getCachedAttendanceHistory();
      final classHistory = cachedHistory[classId];
      if (classHistory != null) {
        return classHistory
            .map((json) => AttendanceModel.fromJson(json))
            .toList();
      }
      throw Exception('No cached attendance history available');
    }
  }

  @override
  Future<Map<String, dynamic>> getClassInfo(String classId) async {
    if (await _isOnline()) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        final classInfo = await apiService.getClassInfo(classId);
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        await storage.cacheClassInfo(classId, classInfo);
        return classInfo;
      } catch (e) {
        // If API call fails, try to get from cache
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        final cachedInfo = await storage.getCachedClassInfo();
        final info = cachedInfo[classId];
        if (info != null) {
          return info;
        }
        rethrow;
      }
    } else {
      // Get from cache
      final storage = await ref.read(attendanceLocalStorageProvider.future);
      final cachedInfo = await storage.getCachedClassInfo();
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

    final storage = await ref.read(attendanceLocalStorageProvider.future);
    final pendingCheckIns = await storage.getPendingCheckIns();
    for (final checkIn in pendingCheckIns) {
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        await apiService.manualCheckIn(
          checkIn['sessionId'],
          checkIn['studentId'],
        );
        await storage.removePendingCheckIn(
          checkIn['sessionId'],
          checkIn['studentId'],
        );
      } catch (e) {
        await storage.updatePendingCheckInRetry(
          checkIn['sessionId'],
          checkIn['studentId'],
        );
      }
    }
  }

  @override
  Future<Map<String, dynamic>?> getOfflineSessionData(String sessionId) async {
    final storage = await ref.read(attendanceLocalStorageProvider.future);
    final offlineSessions = await storage.getOfflineSessions();
    return offlineSessions[sessionId];
  }

  @override
  Future<void> retryFailedOperations() async {
    if (!await _isOnline()) {
      throw Exception('Internet connection required for retrying operations');
    }

    final storage = await ref.read(attendanceLocalStorageProvider.future);
    final syncQueue = await storage.getSyncQueue();
    for (int i = 0; i < syncQueue.length; i++) {
      final operation = syncQueue[i];
      try {
        final apiService = ref.read(attendanceApiServiceProvider);
        switch (operation['operation']) {
          case 'startSession':
            await apiService.startSession(operation['data']['classId']);
            break;
          case 'endSession':
            await apiService.endSession(operation['data']['sessionId']);
            break;
          case 'manualCheckIn':
            await apiService.manualCheckIn(
              operation['data']['sessionId'],
              operation['data']['studentId'],
            );
            break;
        }
        await storage.removeFromSyncQueue(i);
      } catch (e) {
        // Update retry count and last attempt
        operation['retryCount'] = (operation['retryCount'] ?? 0) + 1;
        operation['lastAttempt'] = DateTime.now().toIso8601String();
        operation['error'] = e.toString();

        // If too many retries, remove from queue
        if (operation['retryCount'] > 3) {
          await storage.removeFromSyncQueue(i);
        }
      }
    }
  }

  Future<bool> _isOnline() async {
    final connectivity = await ref.read(connectivityServiceProvider.future);
    return connectivity;
  }
}
