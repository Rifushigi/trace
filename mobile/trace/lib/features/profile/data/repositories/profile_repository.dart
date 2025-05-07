import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/profile_model.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

part 'profile_repository.g.dart';

class ProfileRepositoryException implements Exception {
  final String message;
  ProfileRepositoryException(this.message);
  @override
  String toString() => message;
}

abstract class ProfileRepository {
  Future<ProfileModel?> getProfile();
  Future<void> updateProfile(ProfileModel profile);
  Future<String> uploadAvatar(String filePath);
}

@riverpod
ProfileRepository profileRepository(ProfileRepositoryRef ref) {
  return ProfileRepositoryImpl(ref.watch(apiClientProvider));
}

class ProfileRepositoryImpl implements ProfileRepository {
  final ApiClient _apiClient;

  ProfileRepositoryImpl(this._apiClient);

  @override
  Future<ProfileModel?> getProfile() async {
    try {
      final response = await _apiClient.get(Endpoints.user.profile);
      if (response.data['response']['data']['profile'] == null) {
        return null;
      }
      return ProfileModel.fromJson(
          response.data['response']['data']['profile']);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> updateProfile(ProfileModel profile) async {
    try {
      await _apiClient.put(
        Endpoints.user.updateProfile,
        data: profile.toJson(),
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
