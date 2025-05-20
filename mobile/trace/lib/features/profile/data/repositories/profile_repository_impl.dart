import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/profile_repository.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import 'package:dio/dio.dart';
import '../../domain/entities/profile_entity.dart';
import '../models/profile_model.dart';

part 'profile_repository_impl.g.dart';

class ProfileRepositoryException implements Exception {
  final String message;
  ProfileRepositoryException(this.message);
  @override
  String toString() => message;
}

@riverpod
ProfileRepository profileRepository(Ref ref) {
  return ProfileRepositoryImpl(ref.watch(apiClientProvider));
}

class ProfileRepositoryImpl implements ProfileRepository {
  final ApiClient _apiClient;

  ProfileRepositoryImpl(this._apiClient);

  @override
  Future<ProfileEntity?> getProfile() async {
    try {
      final response = await _apiClient.get(Endpoints.user.profile);
      if (response.data['response']['data']['profile'] == null) {
        return null;
      }
      final model =
          ProfileModel.fromJson(response.data['response']['data']['profile']);
      return ProfileEntity.fromJson(model.toJson());
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> updateProfile(ProfileEntity profile) async {
    try {
      final model = ProfileModel.fromEntity(profile);
      await _apiClient.put(
        Endpoints.user.updateProfile,
        data: model.toJson(),
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<String> uploadAvatar(String filePath) async {
    try {
      final formData = FormData.fromMap({
        'avatar': await MultipartFile.fromFile(filePath),
      });
      final response = await _apiClient.post(
        Endpoints.user.uploadAvatar,
        data: formData,
      );
      return response.data['response']['data']['avatarUrl'];
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  ProfileRepositoryException _handleError(DioException e) {
    if (e.response?.data != null) {
      final data = e.response?.data as Map<String, dynamic>;
      final message = data['response']?['message'] ??
          data['message'] ??
          'An error occurred while processing your request';
      return ProfileRepositoryException(message);
    }
    return ProfileRepositoryException('Network error occurred');
  }
}
