import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/attendance_model.dart';
import '../../data/repositories/attendance_repository.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../data/services/attendance_local_storage.dart';
import '../../data/services/attendance_cache_service.dart';

part 'attendance_provider.g.dart';

@riverpod
class AttendanceActions extends _$AttendanceActions {
  @override
  Future<void> build() async {}

  Future<void> startSession(String classId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final session = await ref.read(attendanceRepositoryProvider).startSession(classId);
      // Cache class info if available
      try {
        final classInfo = await ref.read(attendanceRepositoryProvider).getClassInfo(classId);
        await ref.read(attendanceLocalStorageProvider).cacheClassInfo(classId, classInfo);
      } catch (e) {
        // Ignore class info caching errors
      }
      return session;
    });
  }

  Future<void> endSession(String sessionId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => 
      ref.read(attendanceRepositoryProvider).endSession(sessionId)
    );
  }

  Future<void> studentCheckIn(String sessionId, String classId) async {
    final repository = ref.read(attendanceRepositoryProvider);
    await repository.studentCheckIn(sessionId, classId);
  }

  Future<List<AttendanceModel>> getSessionAttendance(String sessionId) async {
    final repository = ref.read(attendanceRepositoryProvider);
    return repository.getSessionAttendance(sessionId);
  }

  Future<List<AttendanceModel>> getStudentAttendanceHistory(String studentId, String classId) async {
    final repository = ref.read(attendanceRepositoryProvider);
    return repository.getStudentAttendanceHistory(studentId, classId);
  }

  Future<void> automaticCheckIn(String sessionId, String studentId, double confidence) async {
    final repository = ref.read(attendanceRepositoryProvider);
    await repository.automaticCheckIn(sessionId, studentId, confidence);
  }

  Future<void> manualCheckIn(String sessionId, String studentId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => 
      ref.read(attendanceRepositoryProvider).manualCheckIn(sessionId, studentId)
    );
  }

  Future<void> syncPendingCheckIns() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => 
      ref.read(attendanceRepositoryProvider).syncPendingCheckIns()
    );
  }

  Future<void> retryFailedOperations() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => 
      ref.read(attendanceRepositoryProvider).retryFailedOperations()
    );
  }

  Future<Map<String, dynamic>?> getOfflineSessionData(String sessionId) async {
    return await ref.read(attendanceRepositoryProvider).getOfflineSessionData(sessionId);
  }
}

@riverpod
class AttendanceSync extends _$AttendanceSync {
  @override
  Future<void> build() async {
    // Listen for connectivity changes
    ref.listen(connectivityServiceProvider, (previous, next) {
      if (next) {
        // When back online, sync pending data
        syncPendingData();
      }
    });
  }

  Future<void> syncPendingData() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      // First sync pending check-ins
      await ref.read(attendanceRepositoryProvider).syncPendingCheckIns();
      // Then retry any failed operations
      await ref.read(attendanceRepositoryProvider).retryFailedOperations();
    });
  }
}

@riverpod
class AttendanceHistory extends _$AttendanceHistory {
  @override
  Future<List<dynamic>> build(String classId) async {
    return _loadAttendanceHistory(classId);
  }

  Future<List<dynamic>> _loadAttendanceHistory(String classId) async {
    try {
      final history = await ref.read(attendanceRepositoryProvider).getAttendanceHistory(classId);
      return history;
    } catch (e) {
      // If online fetch fails, try to get from cache
      final cachedHistory = await ref.read(attendanceLocalStorageProvider).getCachedAttendanceHistory();
      final classHistory = cachedHistory[classId];
      if (classHistory != null) {
        return classHistory;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _loadAttendanceHistory(state.value?.first['classId'] ?? ''));
  }
}

@riverpod
class ClassInfo extends _$ClassInfo {
  @override
  Future<Map<String, dynamic>> build(String classId) async {
    return _loadClassInfo(classId);
  }

  Future<Map<String, dynamic>> _loadClassInfo(String classId) async {
    try {
      final info = await ref.read(attendanceRepositoryProvider).getClassInfo(classId);
      return info;
    } catch (e) {
      // If online fetch fails, try to get from cache
      final cachedInfo = await ref.read(attendanceLocalStorageProvider).getCachedClassInfo();
      final info = cachedInfo[classId];
      if (info != null) {
        return info;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _loadClassInfo(state.value?['id'] ?? ''));
  }
}

@riverpod
class ActiveSessions extends _$ActiveSessions {
  @override
  Future<List<AttendanceModel>> build() async {
    return _loadActiveSessions();
  }

  Future<List<AttendanceModel>> _loadActiveSessions() async {
    try {
      return await ref.read(attendanceRepositoryProvider).getActiveSessions();
    } catch (e) {
      // If online fetch fails, try to get from cache
      final cachedSessions = await ref.read(attendanceCacheServiceProvider).getCachedActiveSessions();
      if (cachedSessions != null) {
        return cachedSessions;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _loadActiveSessions());
  }
}

@riverpod
class StudentAttendanceStatus extends _$StudentAttendanceStatus {
  @override
  Future<Map<String, dynamic>> build(String classId, String studentId) async {
    return _loadStudentStatus(classId, studentId);
  }

  Future<Map<String, dynamic>> _loadStudentStatus(String classId, String studentId) async {
    try {
      return await ref.read(attendanceRepositoryProvider)
          .getStudentAttendanceStatus(classId, studentId);
    } catch (e) {
      // If online fetch fails, try to get from cache
      final cachedStatus = await ref.read(attendanceCacheServiceProvider)
          .getCachedStudentAttendanceStatus(classId, studentId);
      if (cachedStatus != null) {
        return cachedStatus;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => 
      _loadStudentStatus(state.value?['classId'] ?? '', state.value?['studentId'] ?? '')
    );
  }
}

@riverpod
class ClassSchedule extends _$ClassSchedule {
  @override
  Future<List<Map<String, dynamic>>> build(String classId) async {
    return _loadClassSchedule(classId);
  }

  Future<List<Map<String, dynamic>>> _loadClassSchedule(String classId) async {
    try {
      return await ref.read(attendanceRepositoryProvider).getClassSchedule(classId);
    } catch (e) {
      // If online fetch fails, try to get from cache
      final cachedSchedule = await ref.read(attendanceCacheServiceProvider)
          .getCachedClassSchedule(classId);
      if (cachedSchedule != null) {
        return cachedSchedule;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _loadClassSchedule(state.value?.first['classId'] ?? ''));
  }
}

@riverpod
class ClassStats extends _$ClassStats {
  @override
  Future<Map<String, dynamic>> build(String classId) async {
    return _loadClassStats(classId);
  }

  Future<Map<String, dynamic>> _loadClassStats(String classId) async {
    try {
      return await ref.read(attendanceRepositoryProvider).getClassStats(classId);
    } catch (e) {
      // If online fetch fails, try to get from cache
      final cachedStats = await ref.read(attendanceCacheServiceProvider)
          .getCachedClassStats(classId);
      if (cachedStats != null) {
        return cachedStats;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _loadClassStats(state.value?['classId'] ?? ''));
  }
} 