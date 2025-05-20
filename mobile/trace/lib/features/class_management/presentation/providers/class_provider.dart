import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/class_entity.dart';
import '../../domain/entities/class_statistics.dart';
import '../../data/repositories/class_repository_impl.dart';
import '../../domain/repositories/class_repository.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../../core/network/api_client.dart';

final classRepositoryProvider = Provider<ClassRepository>((ref) {
  return ClassRepositoryImpl(ref.watch(apiClientProvider));
});

final classListProvider = FutureProvider<List<ClassEntity>>((ref) async {
  final repository = ref.watch(classRepositoryProvider);
  return repository.getLecturerClasses();
});

final enrolledClassesProvider = FutureProvider<List<ClassEntity>>((ref) async {
  final repository = ref.watch(classRepositoryProvider);
  return repository.getEnrolledClasses();
});

final searchClassesProvider =
    FutureProvider.family<List<ClassEntity>, String>((ref, query) async {
  final repository = ref.watch(classRepositoryProvider);
  return repository.searchClasses(query);
});

final classDetailsProvider =
    FutureProvider.family<ClassEntity?, String>((ref, classId) async {
  final repository = ref.watch(classRepositoryProvider);
  return repository.getClassDetails(classId);
});

final classStatisticsProvider =
    FutureProvider.family<ClassStatistics?, String>((ref, classId) async {
  final repository = ref.watch(classRepositoryProvider);
  final user = ref.watch(authProvider).value;

  if (user == null) {
    throw Exception('User must be logged in to view class statistics');
  }

  return repository.getClassStatistics(classId, user);
});

final classActionsProvider =
    StateNotifierProvider<ClassActionsNotifier, AsyncValue<void>>((ref) {
  final repository = ref.watch(classRepositoryProvider);
  return ClassActionsNotifier(repository);
});

class ClassActionsNotifier extends StateNotifier<AsyncValue<void>> {
  final ClassRepository _repository;

  ClassActionsNotifier(this._repository) : super(const AsyncValue.data(null));

  Future<void> createClass(ClassEntity classModel) async {
    state = const AsyncValue.loading();
    try {
      await _repository.createClass(classModel);
      state = const AsyncValue.data(null);
    } catch (error, stack) {
      state = AsyncValue.error(error, stack);
    }
  }

  Future<void> updateClass(String classId, ClassEntity classModel) async {
    state = const AsyncValue.loading();
    try {
      await _repository.updateClass(classId, classModel);
      state = const AsyncValue.data(null);
    } catch (error, stack) {
      state = AsyncValue.error(error, stack);
    }
  }

  Future<void> deleteClass(String classId) async {
    state = const AsyncValue.loading();
    try {
      await _repository.deleteClass(classId);
      state = const AsyncValue.data(null);
    } catch (error, stack) {
      state = AsyncValue.error(error, stack);
    }
  }

  Future<void> enrollStudent(String classId, String studentId) async {
    state = const AsyncValue.loading();
    try {
      await _repository.enrollStudent(classId, studentId);
      state = const AsyncValue.data(null);
    } catch (error, stack) {
      state = AsyncValue.error(error, stack);
    }
  }

  Future<void> unenrollStudent(String classId, String studentId) async {
    state = const AsyncValue.loading();
    try {
      await _repository.unenrollStudent(classId, studentId);
      state = const AsyncValue.data(null);
    } catch (error, stack) {
      state = AsyncValue.error(error, stack);
    }
  }
}
