import '../entities/dashboard_item.dart';

abstract class HomeRepository {
  Future<List<DashboardItem>> getDashboardItems(String role);
  Future<Map<String, dynamic>> getDashboardStats(String userId);
  Future<void> updateDashboardPreferences(String userId, Map<String, dynamic> preferences);
} 