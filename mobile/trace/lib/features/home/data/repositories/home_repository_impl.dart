import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/dashboard_item.dart';
import '../../domain/repositories/home_repository.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/utils/logger.dart';
import '../models/dashboard_item_model.dart';
import '../../../../core/network/endpoints.dart';

part 'home_repository_impl.g.dart';

@riverpod
HomeRepository homeRepository(Ref ref) {
  return HomeRepositoryImpl(ref.watch(apiClientProvider));
}

class HomeRepositoryImpl implements HomeRepository {
  final ApiClient _apiClient;

  HomeRepositoryImpl(this._apiClient);

  @override
  Future<List<DashboardItem>> getDashboardItems(String role) async {
    try {
      final response = await _apiClient.get(
        Endpoints.dashboard.items,
        queryParameters: {'role': role},
      );

      if (response.statusCode == 200) {
        final List<dynamic> items = response.data['data']['items'];
        AppLogger.info('Successfully fetched dashboard items for role: $role');
        return items
            .map((item) => DashboardItemModel.fromJson(item).toEntity())
            .toList();
      }

      AppLogger.warning('Failed to fetch dashboard items, using fallback data');
      return _getFallbackItems(role);
    } catch (e, stackTrace) {
      AppLogger.error('Error fetching dashboard items', e, stackTrace);
      return _getFallbackItems(role);
    }
  }

  List<DashboardItem> _getFallbackItems(String role) {
    AppLogger.info('Using fallback dashboard items for role: $role');
    switch (role) {
      case 'admin':
        return [
          const DashboardItem(
            title: 'Users',
            description: 'Manage system users',
            icon: 'users',
            route: '/admin/users',
          ),
          const DashboardItem(
            title: 'Classes',
            description: 'Manage classes',
            icon: 'class',
            route: '/admin/classes',
          ),
          const DashboardItem(
            title: 'Reports',
            description: 'View system reports',
            icon: 'reports',
            route: '/admin/reports',
          ),
          const DashboardItem(
            title: 'Settings',
            description: 'System settings',
            icon: 'settings',
            route: '/admin/settings',
          ),
        ];
      // Add other roles as needed
      default:
        AppLogger.warning('No fallback items defined for role: $role');
        return [];
    }
  }

  @override
  Future<Map<String, dynamic>> getDashboardStats(String userId) async {
    try {
      final response = await _apiClient.get(
        Endpoints.dashboard.statsUrl(userId),
      );

      if (response.statusCode == 200) {
        AppLogger.info(
            'Successfully fetched dashboard stats for user: $userId');
        return response.data['data']['stats'];
      }

      AppLogger.warning('Failed to fetch dashboard stats for user: $userId');
      return {};
    } catch (e, stackTrace) {
      AppLogger.error('Error fetching dashboard stats', e, stackTrace);
      return {};
    }
  }

  @override
  Future<void> updateDashboardPreferences(
    String userId,
    Map<String, dynamic> preferences,
  ) async {
    try {
      await _apiClient.put(
        Endpoints.dashboard.preferencesUrl(userId),
        data: preferences,
      );
      AppLogger.info(
          'Successfully updated dashboard preferences for user: $userId');
    } catch (e, stackTrace) {
      AppLogger.error('Error updating dashboard preferences', e, stackTrace);
      rethrow;
    }
  }
}
