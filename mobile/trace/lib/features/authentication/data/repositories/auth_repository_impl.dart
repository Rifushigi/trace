import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../../domain/repositories/auth_repository.dart';
import 'package:trace/features/authentication/domain/entities/user_entity.dart';
import '../../../../core/utils/logger.dart';

part 'auth_repository_impl.g.dart';

@riverpod
AuthRepository authRepository(Ref ref) {
  return AuthRepositoryImpl(ref.watch(apiClientProvider));
}

class AuthRepositoryImpl implements AuthRepository {
  final ApiClient _apiClient;

  AuthRepositoryImpl(this._apiClient);

  @override
  Future<UserEntity?> getCurrentUser() async {
    try {
      final response = await _apiClient.get(Endpoints.user.profile);
      AppLogger.info('Profile response: ${response.data}');

      if (response.data['response']['status'] == true) {
        final userData = response.data['response']['data']['profile'];
        AppLogger.info('User data from profile: $userData');
        return UserEntity.fromJson(userData);
      }

      AppLogger.warning('Profile response status is false');
      return null;
    } catch (e, stackTrace) {
      AppLogger.error('Error getting current user', e, stackTrace);
      return null;
    }
  }

  @override
  Future<UserEntity> signIn(String email, String password) async {
    try {
      final response = await _apiClient.post(Endpoints.auth.signIn, data: {
        'email': email,
        'password': password,
      });

      AppLogger.info('Sign in response: ${response.data}');

      if (response.data['response']['status'] == false) {
        throw Exception(
            response.data['response']['message'] ?? 'Sign in failed');
      }

      // The user data is in response.data.response.data.user
      final userData = response.data['response']['data']['user'];
      AppLogger.info('User data from sign in: $userData');
      return UserEntity.fromJson(userData);
    } catch (e, stackTrace) {
      AppLogger.error('Error during sign in', e, stackTrace);
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Failed to sign in: ${e.toString()}');
    }
  }

  @override
  Future<UserEntity> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String role,
    String? staffId,
    String? college,
    String? matricNo,
    String? program,
    String? level,
  }) async {
    final response = await _apiClient.post(Endpoints.auth.signUp, data: {
      'email': email,
      'password': password,
      'firstName': firstName,
      'lastName': lastName,
      'role': role,
      if (staffId != null) 'staffId': staffId,
      if (college != null) 'college': college,
      if (matricNo != null) 'matricNo': matricNo,
      if (program != null) 'program': program,
      if (level != null) 'level': level,
    });
    return UserEntity.fromJson(response.data['response']['data']['user']);
  }

  @override
  Future<void> signOut() async {
    await _apiClient.post(Endpoints.auth.signOut);
  }

  @override
  Future<void> sendOtp(String email) async {
    await _apiClient.post(Endpoints.auth.sendOtp, data: {'email': email});
  }

  @override
  Future<void> verifyOtp(String email, String otp) async {
    await _apiClient.post(Endpoints.auth.verifyOtp, data: {
      'email': email,
      'otp': otp,
    });
  }

  @override
  Future<void> sendVerificationEmail(String email) async {
    await _apiClient
        .post(Endpoints.auth.sendVerificationEmail, data: {'email': email});
  }

  @override
  Future<void> verifyEmail(String token) async {
    await _apiClient.post(Endpoints.auth.verifyEmail, data: {'token': token});
  }

  @override
  Future<UserEntity> updateProfile({
    String? name,
    String? email,
    String? avatar,
  }) async {
    final response = await _apiClient.put(Endpoints.user.updateProfile, data: {
      if (name != null) 'name': name,
      if (email != null) 'email': email,
      if (avatar != null) 'avatar': avatar,
    });
    return UserEntity.fromJson(response.data['response']['data']['user']);
  }
}
