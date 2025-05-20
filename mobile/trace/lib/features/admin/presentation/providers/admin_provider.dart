import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/constants/endpoints.dart';
import '../../domain/entities/class_entity.dart';
import '../../domain/entities/user_entity.dart';

/// Provider for managing users in the admin dashboard.
final adminUsersProvider = FutureProvider<List<UserEntity>>((ref) async {
  final apiClient = ref.watch(apiClientProvider);
  final response = await apiClient.get(Endpoints.admin.users);

  if (response.data['response']['status'] == false) {
    throw Exception(
        response.data['response']['message'] ?? 'Failed to load users');
  }

  final List<dynamic> usersJson = response.data['response']['data']['users'];
  return usersJson.map((json) => UserEntity.fromJson(json)).toList();
});

/// Provider for deleting a user.
final deleteUserProvider =
    FutureProvider.family<bool, String>((ref, userId) async {
  final apiClient = ref.watch(apiClientProvider);
  final response = await apiClient.delete('${Endpoints.admin.users}/$userId');

  if (response.data['response']['status'] == false) {
    throw Exception(
        response.data['response']['message'] ?? 'Failed to delete user');
  }

  return true;
});

/// Provider for restoring a deleted user.
final restoreUserProvider =
    FutureProvider.family<bool, String>((ref, userId) async {
  final apiClient = ref.watch(apiClientProvider);
  final response =
      await apiClient.post('${Endpoints.admin.users}/$userId/restore');

  if (response.data['response']['status'] == false) {
    throw Exception(
        response.data['response']['message'] ?? 'Failed to restore user');
  }

  return true;
});

/// Provider for managing classes in the admin dashboard.
final adminClassesProvider = FutureProvider<List<ClassEntity>>((ref) async {
  final apiClient = ref.watch(apiClientProvider);
  final response = await apiClient.get(Endpoints.admin.classes);

  if (response.data['response']['status'] == false) {
    throw Exception(
        response.data['response']['message'] ?? 'Failed to load classes');
  }

  final List<dynamic> classesJson =
      response.data['response']['data']['classes'];
  return classesJson.map((json) => ClassEntity.fromJson(json)).toList();
});

/// Provider for deleting a class.
final deleteClassProvider =
    FutureProvider.family<bool, String>((ref, classId) async {
  final apiClient = ref.watch(apiClientProvider);
  final response = await apiClient.delete(Endpoints.classes.delete(classId));

  if (response.data['response']['status'] == false) {
    throw Exception(
        response.data['response']['message'] ?? 'Failed to delete class');
  }

  return true;
});

/// Provider for archiving a class.
final archiveClassProvider =
    FutureProvider.family<bool, String>((ref, classId) async {
  final apiClient = ref.watch(apiClientProvider);
  final response = await apiClient.post(
    '${Endpoints.admin.classes}/$classId/archive',
  );

  if (response.data['response']['status'] == false) {
    throw Exception(
        response.data['response']['message'] ?? 'Failed to archive class');
  }

  return true;
});

/// Provider for system reports.
final systemReportsProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final apiClient = ref.watch(apiClientProvider);
  final response = await apiClient.get(Endpoints.admin.reports);

  if (response.data['response']['status'] == false) {
    throw Exception(response.data['response']['message'] ??
        'Failed to load system reports');
  }

  return response.data['response']['data'];
});

/// Provider for generating a specific report.
final generateReportProvider =
    FutureProvider.family<Map<String, dynamic>, String>(
        (ref, reportType) async {
  final apiClient = ref.watch(apiClientProvider);
  final response = await apiClient.post(
    '${Endpoints.admin.reports}/$reportType/generate',
  );

  if (response.data['response']['status'] == false) {
    throw Exception(
        response.data['response']['message'] ?? 'Failed to generate report');
  }

  return response.data['response']['data'];
});

/// Provider for system settings.
final systemSettingsProvider =
    FutureProvider<Map<String, dynamic>>((ref) async {
  final apiClient = ref.watch(apiClientProvider);
  final response = await apiClient.get(Endpoints.admin.settings);

  if (response.data['response']['status'] == false) {
    throw Exception(response.data['response']['message'] ??
        'Failed to load system settings');
  }

  return response.data['response']['data'];
});

/// Provider for updating system settings.
final updateSettingsProvider =
    FutureProvider.family<bool, Map<String, dynamic>>((ref, settings) async {
  final apiClient = ref.watch(apiClientProvider);
  final response = await apiClient.put(
    Endpoints.admin.settings,
    data: settings,
  );

  if (response.data['response']['status'] == false) {
    throw Exception(
        response.data['response']['message'] ?? 'Failed to update settings');
  }

  return true;
});
