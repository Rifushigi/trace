import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../../../../common/animations/app_animations.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkInitialRoute();
  }

  Future<void> _checkInitialRoute() async {
    await Future.delayed(
        const Duration(seconds: 2)); // Show splash for 2 seconds

    if (!mounted) return;

    final prefs = await SharedPreferences.getInstance();
    final hasSeenOnboarding = prefs.getBool('has_seen_onboarding') ?? false;

    if (!hasSeenOnboarding) {
      if (!mounted) return;
      Navigator.of(context).pushReplacementNamed('/onboarding');
      return;
    }

    final authState = ref.read(authProvider);
    if (!mounted) return;

    authState.whenData((user) {
      if (!mounted) return;

      if (user != null) {
        // User is logged in, navigate to appropriate home screen
        switch (user.role) {
          case 'student':
            Navigator.of(context)
                .pushReplacementNamed(AppConstants.studentHomeRoute);
            break;
          case 'lecturer':
            Navigator.of(context)
                .pushReplacementNamed(AppConstants.lecturerHomeRoute);
            break;
          case 'admin':
            Navigator.of(context)
                .pushReplacementNamed(AppConstants.adminHomeRoute);
            break;
          default:
            Navigator.of(context).pushReplacementNamed('/sign-in');
        }
      } else {
        // User is not logged in
        Navigator.of(context).pushReplacementNamed('/sign-in');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo with scale and fade animation
            AppAnimations.scaleIn(
              child: AppAnimations.fadeIn(
                child: Image.asset(
                  'assets/images/logo.png',
                  width: 120,
                  height: 120,
                ),
              ),
            ),
            const SizedBox(height: 24),
            // Loading indicator with pulse animation
            AppAnimations.pulse(
              child: const CircularProgressIndicator(),
            ),
          ],
        ),
      ),
    );
  }
}
