import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/class_model.dart';
import '../../data/repositories/class_repository.dart';
import '../../../auth/data/models/user_model.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

final classRepositoryProvider = Provider<ClassRepository>((ref) {
  return ClassRepository();
});

final searchClassesProvider = FutureProvider.family<List<ClassModel>, String>((ref, query) async {
  final repository = ref.watch(classRepositoryProvider);
  return repository.searchClasses(query);
});

final classDetailsProvider = FutureProvider.family<ClassModel?, String>((ref, classId) async {
  final repository = ref.watch(classRepositoryProvider);
  return repository.getClassById(classId);
});

final classStatisticsProvider = FutureProvider.family<ClassStatistics?, String>((ref, classId) async {
  final repository = ref.watch(classRepositoryProvider);
  final user = ref.watch(authProvider).user;
  
  if (user == null) {
    throw Exception('User must be logged in to view class statistics');
  }
  
  return repository.getClassStatistics(classId, user);
});

final classActionsProvider = StateNotifierProvider<ClassActionsNotifier, AsyncValue<void>>((ref) {
  final repository = ref.watch(classRepositoryProvider);
  return ClassActionsNotifier(repository);
});

class ClassActionsNotifier extends StateNotifier<AsyncValue<void>> {
  final ClassRepository _repository;

  ClassActionsNotifier(this._repository) : super(const AsyncValue.data(null));

  Future<void> createClass(ClassModel classModel) async {
    state = const AsyncValue.loading();
    try {
      await _repository.createClass(classModel);
      state = const AsyncValue.data(null);
    } catch (error, stack) {
      state = AsyncValue.error(error, stack);
    }
  }

  Future<void> updateClass(ClassModel classModel) async {
    state = const AsyncValue.loading();
    try {
      await _repository.updateClass(classModel);
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