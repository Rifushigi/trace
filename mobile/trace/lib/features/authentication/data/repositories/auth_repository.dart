import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';
import '../models/auth_model.dart';
import 'package:dio/dio.dart';

part 'auth_repository.g.dart';

abstract class AuthRepository {
  Future<AuthModel> signIn(String email, String password);
  Future<void> signOut();
  Future<void> refreshToken();
  Future<void> sendOtp(String email);
  Future<void> verifyOtp(String email, String otp);
  Future<void> sendVerificationEmail(String email);
  Future<void> verifyEmail(String token);
}

@riverpod
AuthRepository authRepository(AuthRepositoryRef ref) {
  return AuthRepositoryImpl(ref.watch(apiClientProvider));
}

class AuthRepositoryImpl implements AuthRepository {
  final ApiClient _apiClient;

  AuthRepositoryImpl(this._apiClient);

  @override
  Future<AuthModel> signIn(String email, String password) async {
    try {
      final response = await _apiClient.post(
        Endpoints.auth.signIn,
        data: {
          'email': email,
          'password': password,
        },
      );
      return AuthModel.fromJson(response.data['response']['data']['user']);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> signOut() async {
    try {
      await _apiClient.post(Endpoints.auth.signOut);
      await _apiClient.logout();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> refreshToken() async {
    try {
      await _apiClient.get(Endpoints.auth.refreshToken);
    } catch (e) {
      throw Exception('Error refreshing token: $e');
    }
  }

  @override
  Future<void> sendOtp(String email) async {
    try {
      await _apiClient.post(
        Endpoints.auth.sendOtp,
        data: {'email': email},
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> verifyOtp(String email, String otp) async {
    try {
      await _apiClient.post(
        Endpoints.auth.verifyOtp,
        data: {
          'email': email,
          'otp': otp,
        },
      );
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  @override
  Future<void> sendVerificationEmail(String email) async {
    try {
      await _apiClient.post(
        Endpoints.auth.sendVerificationEmail,
        data: {'email': email},
      );
    } catch (e) {
      throw Exception('Error sending verification email: $e');
    }
  }

  @override
  Future<void> verifyEmail(String token) async {
    try {
      await _apiClient.get(
        Endpoints.auth.verifyEmail,
        queryParameters: {'token': token},
      );
    } catch (e) {
      throw Exception('Error verifying email: $e');
    }
  }

  Exception _handleError(DioException e) {
    if (e.response?.data is Map) {
      final data = e.response?.data as Map;
      return Exception(data['message'] ?? 'An error occurred');
    }
    return Exception('An error occurred');
  }
} 