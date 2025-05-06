import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/profile_model.dart';
import 'package:dio/dio.dart';

part 'profile_repository.g.dart';

abstract class ProfileRepository {
  Future<ProfileModel> getProfile();
  Future<ProfileModel> updateProfile(ProfileModel profile);
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
  Future<ProfileModel> getProfile() async {
    try {
      final response = await _apiClient.get(Endpoints.profile);
      return ProfileModel.fromJson(response.data['response']['data']['user']);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<ProfileModel> updateProfile(ProfileModel profile) async {
    try {
      final response = await _apiClient.put(
        Endpoints.updateProfile,
        data: profile.toJson(),
      );
      return ProfileModel.fromJson(response.data['response']['data']['user']);
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
        Endpoints.uploadAvatar,
        data: formData,
      );
      return response.data['response']['data']['avatarUrl'];
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Exception _handleError(DioException e) {
    if (e.response?.data != null) {
      return Exception(e.response?.data['message'] ?? 'An error occurred');
    }
    return Exception('Network error occurred');
  }
} 