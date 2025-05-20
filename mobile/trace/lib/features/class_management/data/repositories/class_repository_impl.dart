import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/class_repository.dart';
import '../../domain/entities/class_entity.dart';
import '../../../authentication/domain/entities/user_entity.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import 'package:dio/dio.dart';
import '../../domain/entities/class_statistics.dart';
import '../models/class_statistics_model.dart';
import '../models/class_model.dart';

part 'class_repository_impl.g.dart';

class ClassRepositoryException implements Exception {
  final String message;
  ClassRepositoryException(this.message);
  @override
  String toString() => message;
}

class UnauthorizedException implements Exception {
  final String message;
  UnauthorizedException(this.message);
  @override
  String toString() => message;
}

@riverpod
ClassRepository classRepository(Ref ref) {
  return ClassRepositoryImpl(ref.watch(apiClientProvider));
}

class ClassRepositoryImpl implements ClassRepository {
  final ApiClient _apiClient;

  ClassRepositoryImpl(this._apiClient);

  @override
  Future<List<ClassEntity>> getLecturerClasses() async {
    try {
      final response = await _apiClient.get(Endpoints.classes.lecturerClasses);
      final List<dynamic> data = response.data['response']['data']['classes'];
      return data.map((json) {
        final model = ClassModel.fromJson(json);
        return ClassEntity(
          id: model.id,
          name: model.name,
          code: model.code,
          lecturerId: model.lecturerId,
          schedule: model.schedule,
          students: model.students,
        );
      }).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<List<ClassEntity>> getEnrolledClasses() async {
    try {
      final response = await _apiClient.get(Endpoints.classes.enrolledClasses);
      final List<dynamic> data = response.data['response']['data']['classes'];
      return data.map((json) {
        final model = ClassModel.fromJson(json);
        return ClassEntity(
          id: model.id,
          name: model.name,
          code: model.code,
          lecturerId: model.lecturerId,
          schedule: model.schedule,
          students: model.students,
        );
      }).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<List<ClassEntity>> searchClasses(String query) async {
    try {
      final response = await _apiClient.get(
        Endpoints.classes.search,
        queryParameters: {'query': query},
      );
      final List<dynamic> data = response.data['response']['data']['classes'];
      return data.map((json) {
        final model = ClassModel.fromJson(json);
        return ClassEntity(
          id: model.id,
          name: model.name,
          code: model.code,
          lecturerId: model.lecturerId,
          schedule: model.schedule,
          students: model.students,
        );
      }).toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<ClassEntity?> getClassDetails(String classId) async {
    try {
      final response = await _apiClient.get(
        Endpoints.classes.details(classId),
      );
      final data = response.data['response']['data']['class'];
      final model = ClassModel.fromJson(data);
      return ClassEntity(
        id: model.id,
        name: model.name,
        code: model.code,
        lecturerId: model.lecturerId,
        schedule: model.schedule,
        students: model.students,
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<ClassStatistics?> getClassStatistics(
      String classId, UserEntity user) async {
    if (user.role != 'lecturer' && user.role != 'admin') {
      throw UnauthorizedException(
          'Only lecturers and admins can view class statistics');
    }

    try {
      final response = await _apiClient.get(
        Endpoints.classes.statistics(classId),
      );
      final data = response.data['response']['data']['statistics'];
      final model = ClassStatisticsModel.fromJson(data);
      return ClassStatistics(
        totalStudents: model.totalStudents,
        presentCount: model.presentCount,
        absentCount: model.absentCount,
        lateCount: model.lateCount,
        attendanceByDate: model.attendanceByDate,
      );
    } catch (e) {
      if (e is Exception && e.toString().contains('404')) {
        return null;
      }
      throw ClassRepositoryException('Error getting class statistics: $e');
    }
  }

  @override
  Future<void> createClass(ClassEntity classModel) async {
    try {
      await _apiClient.post(
        Endpoints.classes.create,
        data: classModel.toJson(),
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> updateClass(String classId, ClassEntity classModel) async {
    try {
      await _apiClient.put(
        Endpoints.classes.update(classId),
        data: classModel.toJson(),
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> deleteClass(String classId) async {
    try {
      await _apiClient.delete(Endpoints.classes.delete(classId));
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> enrollStudent(String classId, String studentId) async {
    try {
      await _apiClient.post(
        Endpoints.classes.enroll(classId),
        data: {'studentId': studentId},
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> unenrollStudent(String classId, String studentId) async {
    try {
      await _apiClient.post(
        Endpoints.classes.unenroll(classId),
        data: {'studentId': studentId},
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  ClassRepositoryException _handleError(DioException e) {
    if (e.response?.data != null) {
      final data = e.response?.data as Map<String, dynamic>;
      final message = data['response']?['message'] ??
          data['message'] ??
          'An error occurred while processing your request';
      return ClassRepositoryException(message);
    }
    return ClassRepositoryException('Network error occurred');
  }
}
