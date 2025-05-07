import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/attendance_repository.dart';

class AttendanceActions extends StateNotifier<AsyncValue<void>> {
  final AttendanceRepository _repository;

  AttendanceActions({required AttendanceRepository repository})
      : _repository = repository,
        super(const AsyncValue.data(null));

  Future<void> syncPendingCheckIns() async {
    state = const AsyncValue.loading();
    try {
      await _repository.syncPendingCheckIns();
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> manualCheckIn(String sessionId, String studentId) async {
    state = const AsyncValue.loading();
    try {
      await _repository.manualCheckIn(sessionId, studentId);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> startSession(String classId) async {
    state = const AsyncValue.loading();
    try {
      await _repository.startSession(classId);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> endSession(String sessionId) async {
    state = const AsyncValue.loading();
    try {
      await _repository.endSession(sessionId);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}

final attendanceActionsProvider =
    StateNotifierProvider<AttendanceActions, AsyncValue<void>>((ref) {
  final repository = ref.watch(attendanceRepositoryProvider);
  return AttendanceActions(repository: repository);
});

final attendanceSyncProvider = StateProvider<AsyncValue<void>>((ref) {
  return const AsyncValue.data(null);
});
