import 'package:dio/dio.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'endpoints.dart';

part 'api_client.g.dart';

@riverpod
ApiClient apiClient(ApiClientRef ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: Endpoints.baseUrl,
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 3),
      headers: const {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
    _dio.interceptors.addAll([
      PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: true,
        error: true,
        compact: true,
      ),
      InterceptorsWrapper(
        onRequest: (options, handler) async {
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

          return handler.next(options);
        },
        onResponse: (response, handler) async {
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
          if (e.response?.statusCode == 401) {
            // Token expired, try to refresh
            final refreshToken = _prefs.getString(_refreshTokenKey);
            if (refreshToken != null) {
              try {
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
                // If refresh fails, clear tokens and throw error
                await _clearTokens();
                return handler.reject(e as DioException);
              }
            }
          }
          return handler.next(e);
        },
      ),
    ]);
  }

  Future<void> _clearTokens() async {
    await _prefs.remove(_deviceIdKey);
    await _prefs.remove(_accessTokenKey);
    await _prefs.remove(_refreshTokenKey);
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
SharedPreferences sharedPreferences(SharedPreferencesRef ref) {
  throw UnimplementedError('Initialize SharedPreferences in main.dart');
}
