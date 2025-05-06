import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/class_model.dart';
import '../models/class_statistics.dart';
import '../../../auth/data/models/user_model.dart';

part 'class_repository.g.dart';

abstract class ClassRepository {
  Future<List<ClassModel>> getLecturerClasses();
  Future<List<ClassModel>> getEnrolledClasses();
  Future<ClassModel> getClassDetails(String classId);
  Future<ClassModel> createClass(ClassModel classModel);
  Future<ClassModel> updateClass(String classId, ClassModel classModel);
  Future<void> deleteClass(String classId);
  Future<List<ClassModel>> searchClasses(String query);
  Future<void> enrollStudent(String classId, String studentId);
  Future<void> unenrollStudent(String classId, String studentId);
  Future<ClassStatistics?> getClassStatistics(String classId, UserModel user);
}

@riverpod
ClassRepository classRepository(ClassRepositoryRef ref) {
  return ClassRepositoryImpl(ref.watch(apiClientProvider));
}

class ClassRepositoryImpl implements ClassRepository {
  final ApiClient _apiClient;

  ClassRepositoryImpl(this._apiClient);

  @override
  Future<List<ClassModel>> getLecturerClasses() async {
    try {
      final response = await _apiClient.get(Endpoints.classes.getLecturerClasses);
      final List<dynamic> classesData = response.data['response']['data']['classes'];
      return classesData.map((json) => ClassModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error getting lecturer classes: $e');
    }
  }

  @override
  Future<List<ClassModel>> getEnrolledClasses() async {
    try {
      final response = await _apiClient.get(Endpoints.classes.getEnrolledClasses);
      final List<dynamic> classesData = response.data['response']['data']['classes'];
      return classesData.map((json) => ClassModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error getting enrolled classes: $e');
    }
  }

  @override
  Future<ClassModel> getClassDetails(String classId) async {
    try {
      final response = await _apiClient.get(Endpoints.classes.getClassDetails(classId));
      return ClassModel.fromJson(response.data['response']['data']['class']);
    } catch (e) {
      throw Exception('Error getting class details: $e');
    }
  }

  @override
  Future<ClassModel> createClass(ClassModel classModel) async {
    try {
      final response = await _apiClient.post(
        Endpoints.classes.createClass,
        data: classModel.toJson(),
      );
      return ClassModel.fromJson(response.data['response']['data']['class']);
    } catch (e) {
      throw Exception('Error creating class: $e');
    }
  }

  @override
  Future<ClassModel> updateClass(String classId, ClassModel classModel) async {
    try {
      final response = await _apiClient.put(
        Endpoints.classes.updateClass(classId),
        data: classModel.toJson(),
      );
      return ClassModel.fromJson(response.data['response']['data']['class']);
    } catch (e) {
      throw Exception('Error updating class: $e');
    }
  }

  @override
  Future<void> deleteClass(String classId) async {
    try {
      await _apiClient.delete(Endpoints.classes.deleteClass(classId));
    } catch (e) {
      throw Exception('Error deleting class: $e');
    }
  }

  @override
  Future<List<ClassModel>> searchClasses(String query) async {
    try {
      final response = await _apiClient.get(
        Endpoints.classes.searchClasses,
        queryParameters: {'query': query},
      );
      final List<dynamic> classesData = response.data['response']['data']['classes'];
      return classesData.map((json) => ClassModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error searching classes: $e');
    }
  }

  @override
  Future<ClassStatistics?> getClassStatistics(String classId, UserModel user) async {
    if (user.role != 'lecturer' && user.role != 'admin') {
      throw Exception('Unauthorized: Only lecturers and admins can view class statistics');
    }

    try {
      final response = await _apiClient.get(Endpoints.classes.getClassStatistics(classId));
      return ClassStatistics.fromJson(response.data['response']['data']['statistics']);
    } catch (e) {
      if (e is Exception && e.toString().contains('404')) {
        return null;
      }
      throw Exception('Error getting class statistics: $e');
    }
  }

  @override
  Future<void> enrollStudent(String classId, String studentId) async {
    try {
      await _apiClient.post(Endpoints.classes.enrollStudent(classId, studentId));
    } catch (e) {
      throw Exception('Error enrolling student: $e');
    }
  }

  @override
  Future<void> unenrollStudent(String classId, String studentId) async {
    try {
      await _apiClient.delete(Endpoints.classes.unenrollStudent(classId, studentId));
    } catch (e) {
      throw Exception('Error unenrolling student: $e');
    }
  }
}
