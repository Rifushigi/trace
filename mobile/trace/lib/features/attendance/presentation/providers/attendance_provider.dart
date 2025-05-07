import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/attendance_model.dart';
import '../../data/repositories/attendance_repository.dart';
import '../../../../core/services/connectivity_service.dart';
import '../../data/services/attendance_local_storage.dart';
import '../../data/services/attendance_cache_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/attendance_session.dart';

part 'attendance_provider.g.dart';

@riverpod
class AttendanceActions extends _$AttendanceActions {
  @override
  Future<void> build() async {}

  Future<AttendanceModel> startSession(String classId) async {
    state = const AsyncLoading();
    final result = await AsyncValue.guard<AttendanceModel>(() async {
      final session =
          await ref.read(attendanceRepositoryProvider).startSession(classId);
      // Cache class info if available
      try {
        final classInfo =
            await ref.read(attendanceRepositoryProvider).getClassInfo(classId);
        final storage = await ref.read(attendanceLocalStorageProvider.future);
        await storage.cacheClassInfo(classId, classInfo);
      } catch (e) {
        // Ignore class info caching errors
      }
      return session;
    });
    state = result;
    return result.value!;
  }

  Future<void> endSession(String sessionId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(attendanceRepositoryProvider).endSession(sessionId));
  }

  Future<void> studentCheckIn(String sessionId) async {
    final repository = ref.read(attendanceRepositoryProvider);
    await repository.studentCheckIn(sessionId);
  }

  Future<List<AttendanceModel>> getAttendanceHistory(String classId) async {
    final repository = ref.read(attendanceRepositoryProvider);
    return repository.getAttendanceHistory(classId);
  }

  Future<void> manualCheckIn(String sessionId, String studentId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => ref
        .read(attendanceRepositoryProvider)
        .manualCheckIn(sessionId, studentId));
  }

  Future<void> syncPendingCheckIns() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(attendanceRepositoryProvider).syncPendingCheckIns());
  }

  Future<void> retryFailedOperations() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(attendanceRepositoryProvider).retryFailedOperations());
  }

  Future<Map<String, dynamic>?> getOfflineSessionData(String sessionId) async {
    return await ref
        .read(attendanceRepositoryProvider)
        .getOfflineSessionData(sessionId);
  }
}

@riverpod
class AttendanceSync extends _$AttendanceSync {
  @override
  Future<void> build() async {
    // Listen for connectivity changes
    ref.listen(connectivityServiceProvider, (previous, next) async {
      if (next.value == true) {
        // When back online, sync pending data
        await syncPendingData();
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
      final history = await ref
          .read(attendanceRepositoryProvider)
          .getAttendanceHistory(classId);
      return history;
    } catch (e) {
      // If online fetch fails, try to get from cache
      final storage = await ref.read(attendanceLocalStorageProvider.future);
      final cachedHistory = await storage.getOfflineSessions();
      final classHistory = cachedHistory[classId];
      if (classHistory != null) {
        return [classHistory];
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => _loadAttendanceHistory(state.value?.first['classId'] ?? ''));
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
      final info =
          await ref.read(attendanceRepositoryProvider).getClassInfo(classId);
      return info;
    } catch (e) {
      // If online fetch fails, try to get from cache
      final storage = await ref.read(attendanceLocalStorageProvider.future);
      final cachedInfo = await storage.getCachedClassInfo();
      final info = cachedInfo[classId];
      if (info != null) {
        return info;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state =
        await AsyncValue.guard(() => _loadClassInfo(state.value?['id'] ?? ''));
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
      final cacheService =
          await ref.read(attendanceCacheServiceProvider.future);
      final cachedSessions = await cacheService.getCachedActiveSessions();
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

  Future<Map<String, dynamic>> _loadStudentStatus(
      String classId, String studentId) async {
    try {
      return await ref
          .read(attendanceRepositoryProvider)
          .getStudentAttendanceStatus(classId, studentId);
    } catch (e) {
      // If online fetch fails, try to get from cache
      final cacheService =
          await ref.read(attendanceCacheServiceProvider.future);
      final cachedStatus = await cacheService.getCachedStudentAttendanceStatus(
          classId, studentId);
      if (cachedStatus != null) {
        return cachedStatus;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _loadStudentStatus(
        state.value?['classId'] ?? '', state.value?['studentId'] ?? ''));
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
      return await ref
          .read(attendanceRepositoryProvider)
          .getClassSchedule(classId);
    } catch (e) {
      // If online fetch fails, try to get from cache
      final cacheService =
          await ref.read(attendanceCacheServiceProvider.future);
      final cachedSchedule = await cacheService.getCachedClassSchedule(classId);
      if (cachedSchedule != null) {
        return cachedSchedule;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => _loadClassSchedule(state.value?.first['classId'] ?? ''));
  }
}

@Riverpod(keepAlive: true)
class ClassStats extends _$ClassStats {
  @override
  Future<Map<String, dynamic>> build(String classId) async {
    return _loadClassStats(classId);
  }

  Future<Map<String, dynamic>> _loadClassStats(String classId) async {
    try {
      return await ref
          .read(attendanceRepositoryProvider)
          .getClassStats(classId);
    } catch (e) {
      // If online fetch fails, try to get from cache
      final cacheService =
          await ref.read(attendanceCacheServiceProvider.future);
      final cachedStats = await cacheService.getCachedClassStats(classId);
      if (cachedStats != null) {
        return cachedStats;
      }
      rethrow;
    }
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => _loadClassStats(state.value?['classId'] ?? ''));
  }
}

final activeSessionProvider =
    FutureProvider.family<AttendanceSession?, String>((ref, classId) async {
  try {
    final activeSessions =
        await ref.read(attendanceRepositoryProvider).getActiveSessions();
    final classSession = activeSessions.firstWhere(
      (session) => session.classId == classId,
      orElse: () =>
          throw Exception('No active session found for class $classId'),
    );
    return AttendanceSession(
      id: classSession.sessionId,
      startTime: classSession.timestamp,
      endTime: null, // Active session doesn't have an end time yet
      status: classSession.status,
      presentCount: 0, // This will be updated when students check in
      absentCount: 0, // This will be updated when students check in
      totalCount: 0, // This will be updated when students check in
    );
  } catch (e) {
    // If no active session is found, return null
    return null;
  }
});
