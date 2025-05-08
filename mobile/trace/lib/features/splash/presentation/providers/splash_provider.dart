import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../features/authentication/presentation/providers/auth_provider.dart';

final splashProvider = StateNotifierProvider<SplashNotifier, bool>((ref) {
  return SplashNotifier(ref);
});

class SplashNotifier extends StateNotifier<bool> {
  final Ref ref;

  SplashNotifier(this.ref) : super(false);

  Future<bool> checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final hasSeenOnboarding = prefs.getBool('has_seen_onboarding') ?? false;

    if (!hasSeenOnboarding) {
      return false;
    }

    final authState = await ref.read(authProvider.future);
    return authState != null;
  }
}
