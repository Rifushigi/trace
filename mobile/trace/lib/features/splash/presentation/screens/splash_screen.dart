import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../providers/splash_provider.dart';
import '../../../../features/authentication/presentation/providers/auth_provider.dart';
import '../../../../core/utils/logger.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  static const _gradientColors = [
    Color(0xFF2196F3), // Primary color
    Color(0xFF64B5F6), // Primary color with alpha
  ];

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    if (!mounted) return;

    try {
      // Start auth check
      final authCheck = ref.read(splashProvider.notifier).checkAuth();
      final results = await Future.wait([authCheck]);
      if (!mounted) return;

      final isAuthenticated = results[0];
      AppLogger.info('Auth check result: $isAuthenticated');

      if (!mounted) return;

      if (isAuthenticated) {
        final authState = await ref.read(authProvider.future);
        if (!mounted) return;

        AppLogger.info('Auth state: ${authState?.toJson()}');

        String route;
        if (authState?.role == 'student') {
          route = AppConstants.studentHomeRoute;
        } else if (authState?.role == 'lecturer') {
          route = AppConstants.lecturerHomeRoute;
        } else if (authState?.role == 'admin') {
          route = AppConstants.adminHomeRoute;
        } else {
          route = AppConstants.signInRoute;
        }

        AppLogger.info('Navigating to route: $route');
        Navigator.of(context).pushReplacementNamed(route);
      } else {
        AppLogger.info('User not authenticated, navigating to sign in');
        Navigator.of(context).pushReplacementNamed(AppConstants.signInRoute);
      }
    } catch (e, stackTrace) {
      AppLogger.error('Error during initialization', e, stackTrace);
      if (!mounted) return;
      Navigator.of(context).pushReplacementNamed(AppConstants.signInRoute);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(context).colorScheme.surface,
              Theme.of(context).colorScheme.surface,
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ShaderMask(
                shaderCallback: (bounds) => const LinearGradient(
                  colors: _gradientColors,
                ).createShader(bounds),
                child: const Text(
                  AppConstants.appName,
                  style: TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1.2,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: AppConstants.defaultPadding * 2),
              const CircularProgressIndicator(),
            ],
          ),
        ),
      ),
    );
  }
}
