import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../features/authentication/presentation/providers/auth_provider.dart';
import '../../../../core/utils/logger.dart';

final splashProvider = StateNotifierProvider<SplashNotifier, bool>((ref) {
  return SplashNotifier(ref);
});

class SplashNotifier extends StateNotifier<bool> {
  final Ref ref;

  SplashNotifier(this.ref) : super(false);

  Future<bool> checkAuth() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final hasSeenOnboarding = prefs.getBool('has_seen_onboarding') ?? false;

      if (!hasSeenOnboarding) {
        AppLogger.info('User has not seen onboarding');
        return false;
      }

      final authState = await ref.read(authProvider.future);
      AppLogger.info('Auth state in splash provider: ${authState?.toJson()}');

      if (authState != null) {
        AppLogger.info('User is authenticated with role: ${authState.role}');
        return true;
      }

      AppLogger.info('User is not authenticated');
      return false;
    } catch (e, stackTrace) {
      AppLogger.error('Error checking auth state', e, stackTrace);
      return false;
    }
  }
}
