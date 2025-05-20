import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../../core/constants/app_constants.dart';
import '../../../../../core/constants/validation_constants.dart';
import '../../../../../features/authentication/presentation/providers/auth_provider.dart';
import '../../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../../common/shared_widgets/toast.dart';
import 'package:trace/core/services/haptic_service.dart';
import '../../../../../core/utils/logger.dart';

class SignInScreen extends ConsumerStatefulWidget {
  const SignInScreen({super.key});

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isPasswordVisible = false;
  final bool _validateEmail = false;
  final bool _validatePassword = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _signIn() async {
    if (_formKey.currentState?.validate() ?? false) {
      try {
        AppLogger.info(
            'Attempting to sign in with email: ${_emailController.text}');
        await ref.read(authProvider.notifier).signIn(
              _emailController.text,
              _passwordController.text,
            );

        // Check if the sign-in was successful by checking the auth state
        final authState = ref.read(authProvider);
        if (authState.hasValue && authState.value != null) {
          final user = authState.value;
          AppLogger.info('Sign in successful for user: ${user?.email}');

          if (!user!.isVerified) {
            AppLogger.warning('User email not verified: ${user.email}');
            if (!context.mounted) return;
            await showDialog(
              context: context,
              barrierDismissible: false,
              builder: (context) => AlertDialog(
                title: const Text('Email Verification Required'),
                content: const Text(
                  'Please verify your email before signing in. Check your inbox for the verification link.',
                ),
                actions: [
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: const Text('OK'),
                  ),
                  TextButton(
                    onPressed: () async {
                      Navigator.pop(context);
                      try {
                        AppLogger.info(
                            'Sending verification email to: ${user.email}');
                        await ref
                            .read(authProvider.notifier)
                            .sendVerificationEmail(user.email);
                        if (!context.mounted) return;
                        Toast.show(
                          context,
                          message: 'Verification email sent successfully',
                          type: ToastType.success,
                        );
                      } catch (e) {
                        AppLogger.error('Failed to send verification email', e);
                        if (!context.mounted) return;
                        Toast.show(
                          context,
                          message: e.toString(),
                          type: ToastType.error,
                        );
                      }
                    },
                    child: const Text('Resend Email'),
                  ),
                ],
              ),
            );
            return;
          }

          if (mounted) {
            Toast.show(
              context,
              message: 'Welcome back!',
              type: ToastType.success,
            );
          }

          // Navigate to the appropriate screen based on user role
          String route;
          if (user.role == 'student') {
            route = AppConstants.studentHomeRoute;
          } else if (user.role == 'lecturer') {
            route = AppConstants.lecturerHomeRoute;
          } else if (user.role == 'admin') {
            route = AppConstants.adminHomeRoute;
          } else {
            route = AppConstants.signInRoute;
          }
          AppLogger.info('Navigating to route: $route');
          if (mounted) {
            Navigator.of(context).pushReplacementNamed(route);
          }
        } else {
          throw Exception();
        }
      } catch (e) {
        AppLogger.error('Sign in failed', e);
        if (mounted) {
          Toast.show(
            context,
            message: "Sign in failed",
            type: ToastType.error,
          );
        }
      }
    } else {
      AppLogger.warning('Form validation failed');
      if (mounted) {
        Toast.show(
          context,
          message: 'Please fill in all fields correctly',
          type: ToastType.error,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return LoadingOverlay(
      isLoading: authState.isLoading,
      message: 'Signing in...',
      child: Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          systemOverlayStyle: SystemUiOverlayStyle.dark,
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(AppConstants.defaultPadding),
              child: Form(
                key: _formKey,
                autovalidateMode: AutovalidateMode.disabled,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: AppConstants.defaultPadding * 2),
                    // App Logo Text
                    ShaderMask(
                      shaderCallback: (bounds) => LinearGradient(
                        colors: [
                          Theme.of(context).primaryColor,
                          Theme.of(context).primaryColor.withAlpha(204),
                        ],
                      ).createShader(bounds),
                      child: const Text(
                        AppConstants.appName,
                        style: TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: 1.2,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: AppConstants.defaultPadding * 2),
                    const Text(
                      AppConstants.welcomeMessage,
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppConstants.defaultPadding * 2),
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.email),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (!_validateEmail) return null;
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        if (!ValidationConstants.isValidEmail(value)) {
                          return ValidationConstants.invalidEmail;
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: AppConstants.defaultPadding),
                    TextFormField(
                      controller: _passwordController,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        border: const OutlineInputBorder(),
                        prefixIcon: const Icon(Icons.lock),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _isPasswordVisible
                                ? Icons.visibility_off
                                : Icons.visibility,
                          ),
                          onPressed: () {
                            setState(() {
                              _isPasswordVisible = !_isPasswordVisible;
                            });
                          },
                        ),
                      ),
                      obscureText: !_isPasswordVisible,
                      validator: (value) {
                        if (!_validatePassword) return null;
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        if (!ValidationConstants.isValidPassword(value)) {
                          return ValidationConstants.invalidPassword;
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: AppConstants.defaultPadding * 1.5),
                    ElevatedButton(
                      onPressed: _signIn,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Sign In',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: AppConstants.defaultPadding),
                    TextButton(
                      onPressed: () {
                        HapticService.navigationFeedback();
                        Navigator.pushNamed(context, '/sign-up/role');
                      },
                      child: const Text(AppConstants.signUpPrompt),
                    ),
                    TextButton(
                      onPressed: () {
                        HapticService.navigationFeedback();
                        Navigator.pushNamed(context, '/forgot-password');
                      },
                      child: const Text('Forgot Password?'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
