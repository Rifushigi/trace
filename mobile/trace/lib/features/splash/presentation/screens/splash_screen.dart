import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/constants/route_constants.dart';
import '../providers/splash_provider.dart';

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
    // Delay initialization slightly to ensure the splash screen is visible
    Future.delayed(const Duration(milliseconds: 100), _initialize);
  }

  Future<void> _initialize() async {
    if (!mounted) return;

    // Start auth check
    final authCheck = ref.read(splashProvider.notifier).checkAuth();

    // Wait for both auth check and minimum display time
    final results = await Future.wait([
      authCheck,
      Future.delayed(const Duration(milliseconds: 500)), // Minimum display time
    ]);

    if (!mounted) return;

    final isAuthenticated = results[0] as bool;

    if (!mounted) return;

    Navigator.of(context).pushReplacementNamed(
      isAuthenticated ? RouteConstants.home : RouteConstants.onboarding,
    );
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
              Theme.of(context).colorScheme.background,
              Theme.of(context).colorScheme.surface,
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ShaderMask(
                shaderCallback: (bounds) => LinearGradient(
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
