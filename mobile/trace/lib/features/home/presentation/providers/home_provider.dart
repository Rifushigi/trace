import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/dashboard_item.dart';
import '../../data/repositories/home_repository_impl.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../../core/utils/logger.dart';

part 'home_provider.g.dart';

@riverpod
Future<List<DashboardItem>> dashboardItems(Ref ref) async {
  final authState = ref.watch(authProvider);
  final user = authState.value;
  if (user == null) throw Exception('User not authenticated');

  final repository = ref.watch(homeRepositoryProvider);
  return repository.getDashboardItems(user.role);
}

@riverpod
Future<Map<String, dynamic>> dashboardStats(Ref ref) async {
  final authState = ref.watch(authProvider);
  final user = authState.value;
  if (user == null) throw Exception('User not authenticated');

  final repository = ref.watch(homeRepositoryProvider);
  return repository.getDashboardStats(user.id);
}

@riverpod
class HomePreferences extends _$HomePreferences {
  @override
  Map<String, dynamic> build() {
    final authState = ref.watch(authProvider);
    final user = authState.value;
    if (user == null) throw Exception('User not authenticated');

    return {
      'showRecentActivity': true,
      'showSystemStats': true,
      'showUserStats': true,
    };
  }

  Future<void> updatePreferences(Map<String, dynamic> preferences) async {
    try {
      final authState = ref.watch(authProvider);
      final user = authState.value;
      if (user == null) throw Exception('User not authenticated');

      await ref
          .read(homeRepositoryProvider)
          .updateDashboardPreferences(user.id, preferences);
      state = preferences;
      AppLogger.info('Successfully updated dashboard preferences');
    } catch (e, stackTrace) {
      AppLogger.error('Failed to update dashboard preferences', e, stackTrace);
      rethrow;
    }
  }

  Future<void> togglePreference(String key) async {
    try {
      final newPreferences = Map<String, dynamic>.from(state);
      newPreferences[key] = !(state[key] as bool);
      await updatePreferences(newPreferences);
    } catch (e, stackTrace) {
      AppLogger.error('Failed to toggle preference: $key', e, stackTrace);
      rethrow;
    }
  }
}
