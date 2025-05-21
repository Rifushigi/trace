import '../entities/dashboard_item.dart';

abstract class HomeRepository {
  Future<List<DashboardItem>> getDashboardItems(String role);
  Future<Map<String, dynamic>> getDashboardStats();
  Future<void> updateDashboardPreferences(Map<String, dynamic> preferences);
} 