import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'endpoints.dart';
import '../utils/logger.dart';

part 'api_client.g.dart';

@riverpod
ApiClient apiClient(Ref ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: Endpoints.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: const {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: (status) {
        return status != null && status < 500;
      },
    ),
  );

  final prefs = ref.watch(sharedPreferencesProvider);
  final client = ApiClient(dio, prefs);
  client._setupInterceptors();
  return client;
}

class ApiClient {
  final Dio _dio;
  final SharedPreferences _prefs;
  static const String _deviceIdKey = 'device_id';
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';

  const ApiClient(this._dio, this._prefs);

  void _setupInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          AppLogger.info('URL:${options.path}');
          AppLogger.info('Method: ${options.method}');
          if (options.data != null) {
            AppLogger.info('Request Body: ${options.data}');
          }
          if (options.queryParameters.isNotEmpty) {
            AppLogger.info('Query Parameters: ${options.queryParameters}');
          }

          // Add device ID if available
          final deviceId = _prefs.getString(_deviceIdKey);
          if (deviceId != null) {
            options.headers['Cookie'] = 'deviceId=$deviceId';
          }

          // Add access token if available
          final accessToken = _prefs.getString(_accessTokenKey);
          if (accessToken != null) {
            options.headers['Cookie'] =
                '${options.headers['Cookie'] ?? ''}; accessToken=$accessToken';
          }

          // Add withCredentials to all requests
          options.extra['withCredentials'] = true;

          return handler.next(options);
        },
        onResponse: (response, handler) async {
          AppLogger.info('=== RESPONSE ===');
          AppLogger.info('URL: ${response.requestOptions.uri}');
          AppLogger.info(
              'Status: ${response.statusCode} ${response.statusMessage}');
          AppLogger.info('Response Data: ${response.data}');

          // Extract and store cookies from response
          final cookies = response.headers['set-cookie'];
          if (cookies != null) {
            for (final cookie in cookies) {
              if (cookie.startsWith('deviceId=')) {
                await _prefs.setString(
                    _deviceIdKey, cookie.split(';')[0].split('=')[1]);
              } else if (cookie.startsWith('accessToken=')) {
                await _prefs.setString(
                    _accessTokenKey, cookie.split(';')[0].split('=')[1]);
              } else if (cookie.startsWith('refreshToken=')) {
                await _prefs.setString(
                    _refreshTokenKey, cookie.split(';')[0].split('=')[1]);
              }
            }
          }
          return handler.next(response);
        },
        onError: (DioException e, handler) async {
          AppLogger.error('URL: ${e.requestOptions.uri}');
          if (e.response != null) {
            AppLogger.error('Error Response Data: ${e.response?.data}');
          }
          AppLogger.error('Request Data: ${e.requestOptions.data}');

          if (e.response?.statusCode == 401) {
            // Token expired, try to refresh
            final refreshToken = _prefs.getString(_refreshTokenKey);
            if (refreshToken != null) {
              try {
                AppLogger.info('Attempting to refresh token');
                final response = await _dio.get(
                  '/auth/refresh-token',
                  options: Options(
                    headers: {'Cookie': 'refreshToken=$refreshToken'},
                  ),
                );

                // Update tokens from response
                final cookies = response.headers['set-cookie'];
                if (cookies != null) {
                  for (final cookie in cookies) {
                    if (cookie.startsWith('accessToken=')) {
                      await _prefs.setString(
                          _accessTokenKey, cookie.split(';')[0].split('=')[1]);
                    } else if (cookie.startsWith('refreshToken=')) {
                      await _prefs.setString(
                          _refreshTokenKey, cookie.split(';')[0].split('=')[1]);
                    }
                  }
                }

                // Retry the original request
                AppLogger.info('Retrying original request after token refresh');
                final opts = Options(
                  method: e.requestOptions.method,
                  headers: e.requestOptions.headers,
                );
                final retryResponse = await _dio.request(
                  e.requestOptions.path,
                  data: e.requestOptions.data,
                  queryParameters: e.requestOptions.queryParameters,
                  options: opts,
                );
                return handler.resolve(retryResponse);
              } catch (e) {
                AppLogger.error('Token refresh failed', e);
                // If refresh fails, clear tokens and throw error
                await _clearTokens();
                return handler.reject(e as DioException);
              }
            }
          }
          return handler.next(e);
        },
      ),
    );
  }

  Future<void> _clearTokens() async {
    await _prefs.remove(_deviceIdKey);
    await _prefs.remove(_accessTokenKey);
    await _prefs.remove(_refreshTokenKey);
    AppLogger.info('Cleared all tokens');
  }

  // Public method to handle logout
  Future<void> logout() async {
    await _clearTokens();
  }

  // HTTP Methods
  Future<Response> get(String path,
      {Map<String, dynamic>? queryParameters, Options? options}) {
    return _dio.get(path, queryParameters: queryParameters, options: options);
  }

  Future<Response> post(String path,
      {dynamic data, Map<String, dynamic>? queryParameters, Options? options}) {
    return _dio.post(path,
        data: data, queryParameters: queryParameters, options: options);
  }

  Future<Response> put(String path,
      {dynamic data, Map<String, dynamic>? queryParameters, Options? options}) {
    return _dio.put(path,
        data: data, queryParameters: queryParameters, options: options);
  }

  Future<Response> delete(String path,
      {dynamic data, Map<String, dynamic>? queryParameters, Options? options}) {
    return _dio.delete(path,
        data: data, queryParameters: queryParameters, options: options);
  }
}

@riverpod
SharedPreferences sharedPreferences(Ref ref) {
  throw UnimplementedError('Initialize SharedPreferences in main.dart');
}
