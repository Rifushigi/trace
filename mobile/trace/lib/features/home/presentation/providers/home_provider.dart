import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/dashboard_item.dart';
import '../../data/repositories/home_repository_impl.dart';
import '../../../authentication/providers/auth_provider.dart';
import '../../../../utils/logger.dart';

final dashboardItemsProvider = FutureProvider<List<DashboardItem>>((ref) async {
  final authState = ref.watch(authProvider);
  final user = authState.user;
  if (user == null) throw Exception('User not authenticated');
  
  final repository = ref.read(homeRepositoryProvider);
  return repository.getDashboardItems(user.role);
});

final dashboardStatsProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final authState = ref.watch(authProvider);
  final user = authState.user;
  if (user == null) throw Exception('User not authenticated');
  
  final repository = ref.read(homeRepositoryProvider);
  return repository.getDashboardStats(user.id);
});

final homePreferencesProvider = StateNotifierProvider<HomePreferencesNotifier, Map<String, dynamic>>((ref) {
  final authState = ref.watch(authProvider);
  final user = authState.user;
  if (user == null) throw Exception('User not authenticated');
  
  return HomePreferencesNotifier(
    ref.read(homeRepositoryProvider),
    user.id,
  );
});

class HomePreferencesNotifier extends StateNotifier<Map<String, dynamic>> {
  final HomeRepository _repository;
  final String _userId;

  HomePreferencesNotifier(this._repository, this._userId) : super({
    'showRecentActivity': true,
    'showSystemStats': true,
    'showUserStats': true,
  });

  Future<void> updatePreferences(Map<String, dynamic> preferences) async {
    try {
      await _repository.updateDashboardPreferences(_userId, preferences);
      state = preferences;
      Logger.info('Successfully updated dashboard preferences');
    } catch (e, stackTrace) {
      Logger.error('Failed to update dashboard preferences', e, stackTrace);
      rethrow;
    }
  }

  Future<void> togglePreference(String key) async {
    try {
      final newPreferences = Map<String, dynamic>.from(state);
      newPreferences[key] = !(state[key] as bool);
      await updatePreferences(newPreferences);
    } catch (e, stackTrace) {
      Logger.error('Failed to toggle preference: $key', e, stackTrace);
      rethrow;
    }
  }
} 