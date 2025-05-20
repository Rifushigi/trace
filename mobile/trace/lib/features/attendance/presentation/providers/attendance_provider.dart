import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/attendance_entity.dart';
import '../../domain/entities/attendance_session_entity.dart';
import '../../data/repositories/attendance_repository_impl.dart';
import '../../../../core/network/connectivity_checker.dart';
import '../../domain/entities/class_info_entity.dart';
import '../../domain/entities/student_attendance_status_entity.dart';

part 'attendance_provider.g.dart';

@riverpod
class AttendanceActions extends _$AttendanceActions {
  @override
  Future<void> build() async {}

  Future<AttendanceSessionEntity> startSession(String classId) async {
    state = const AsyncLoading();
    final result = await AsyncValue.guard<AttendanceSessionEntity>(() async {
      final repository = ref.read(attendanceRepositoryProvider);
      return repository.startSession(classId);
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

  Future<List<AttendanceEntity>> getAttendanceHistory(String classId) async {
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
    return ref
        .read(attendanceRepositoryProvider)
        .getOfflineSessionData(sessionId);
  }
}

@riverpod
class AttendanceSync extends _$AttendanceSync {
  @override
  Future<void> build() async {
    ref.listen(connectivityCheckerProvider, (previous, next) async {
      if (next.value == true) {
        await syncPendingData();
      }
    });
  }

  Future<void> syncPendingData() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(attendanceRepositoryProvider).syncPendingCheckIns();
      await ref.read(attendanceRepositoryProvider).retryFailedOperations();
    });
  }
}

@riverpod
class AttendanceHistory extends _$AttendanceHistory {
  @override
  Future<List<AttendanceEntity>> build(String classId) async {
    return ref.read(attendanceRepositoryProvider).getAttendanceHistory(classId);
  }

  Future<void> refresh(String classId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() =>
        ref.read(attendanceRepositoryProvider).getAttendanceHistory(classId));
  }
}

@riverpod
class ClassInfo extends _$ClassInfo {
  @override
  Future<ClassInfoEntity> build(String classId) async {
    return ref.read(attendanceRepositoryProvider).getClassInfo(classId);
  }

  Future<void> refresh(String classId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(attendanceRepositoryProvider).getClassInfo(classId));
  }
}

@riverpod
class ActiveSessions extends _$ActiveSessions {
  @override
  Future<List<AttendanceSessionEntity>> build() async {
    return ref.read(attendanceRepositoryProvider).getActiveSessions();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(attendanceRepositoryProvider).getActiveSessions());
  }
}

@riverpod
class StudentAttendanceStatus extends _$StudentAttendanceStatus {
  @override
  Future<StudentAttendanceStatusEntity> build(
      String classId, String studentId) async {
    return ref
        .read(attendanceRepositoryProvider)
        .getStudentAttendanceStatus(classId, studentId);
  }

  Future<void> refresh(String classId, String studentId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => ref
        .read(attendanceRepositoryProvider)
        .getStudentAttendanceStatus(classId, studentId));
  }
}

@riverpod
class ClassSchedule extends _$ClassSchedule {
  @override
  Future<List<Map<String, dynamic>>> build(String classId) async {
    return ref.read(attendanceRepositoryProvider).getClassSchedule(classId);
  }

  Future<void> refresh(String classId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(attendanceRepositoryProvider).getClassSchedule(classId));
  }
}

@riverpod
class ActiveSession extends _$ActiveSession {
  @override
  Future<AttendanceSessionEntity?> build(String classId) async {
    final activeSessions = await ref.read(activeSessionsProvider.future);
    try {
      return activeSessions.firstWhere(
        (session) => session.classId == classId,
      );
    } catch (e) {
      return null;
    }
  }

  Future<void> refresh(String classId) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final activeSessions = await ref.read(activeSessionsProvider.future);
      try {
        return activeSessions.firstWhere(
          (session) => session.classId == classId,
        );
      } catch (e) {
        return null;
      }
    });
  }
}
