import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/dashboard_item.dart';
import '../../domain/repositories/home_repository.dart';
import '../../../../core/network/api_client.dart';
import '../../../../utils/logger.dart';

part 'home_repository_impl.g.dart';

@riverpod
HomeRepository homeRepository(HomeRepositoryRef ref) {
  return HomeRepositoryImpl(ref.watch(apiClientProvider));
}

class HomeRepositoryImpl implements HomeRepository {
  final ApiClient _apiClient;

  HomeRepositoryImpl(this._apiClient);

  @override
  Future<List<DashboardItem>> getDashboardItems(String role) async {
    if (role != 'admin') {
      Logger.warning('Non-admin user attempted to access dashboard items');
      throw Exception('Access denied. Admin privileges required.');
    }

    try {
      final response = await _apiClient
          .get('/dashboard/items', queryParameters: {'role': role});

      if (response.statusCode == 200) {
        final List<dynamic> items = response.data['data']['items'];
        return items
            .map((item) => DashboardItem(
                  title: item['title'],
                  route: item['route'],
                  icon: item['icon'],
                  description: item['description'],
                ))
            .toList();
      } else {
        // Fallback to hardcoded items if API fails
        Logger.warning('Failed to fetch dashboard items, using fallback data');
        return _getFallbackItems(role);
      }
    } catch (e, stackTrace) {
      Logger.error('Error fetching dashboard items', e, stackTrace);
      return _getFallbackItems(role);
    }
  }

  List<DashboardItem> _getFallbackItems(String role) {
    if (role != 'admin') {
      throw Exception('Access denied. Admin privileges required.');
    }

    return [
      const DashboardItem(
        title: 'User Management',
        route: '/admin/users',
        icon: 'people',
        description: 'Manage system users',
      ),
      const DashboardItem(
        title: 'Class Management',
        route: '/admin/classes',
        icon: 'class',
        description: 'Manage classes and enrollments',
      ),
      const DashboardItem(
        title: 'Reports',
        route: '/admin/reports',
        icon: 'assessment',
        description: 'View system reports',
      ),
      const DashboardItem(
        title: 'Settings',
        route: '/admin/settings',
        icon: 'settings',
        description: 'System settings',
      ),
    ];
  }

  @override
  Future<Map<String, dynamic>> getDashboardStats(String userId) async {
    try {
      final response = await _apiClient.get('/dashboard/stats/$userId');

      if (response.statusCode == 200) {
        return response.data['data'];
      } else {
        Logger.warning('Failed to fetch dashboard stats, using fallback data');
        return _getFallbackStats();
      }
    } catch (e, stackTrace) {
      Logger.error('Error fetching dashboard stats', e, stackTrace);
      return _getFallbackStats();
    }
  }

  Map<String, dynamic> _getFallbackStats() {
    return {
      'totalUsers': 150,
      'totalClasses': 25,
      'activeSessions': 3,
      'recentActivity': [
        {
          'type': 'user',
          'message': 'New user registered',
          'timestamp': DateTime.now().toIso8601String(),
        },
      ],
    };
  }

  @override
  Future<void> updateDashboardPreferences(
      String userId, Map<String, dynamic> preferences) async {
    try {
      await _apiClient.put(
        '/dashboard/preferences/$userId',
        data: preferences,
      );
      Logger.info('Successfully updated dashboard preferences');
    } catch (e, stackTrace) {
      Logger.error('Error updating dashboard preferences', e, stackTrace);
      rethrow;
    }
  }
}
