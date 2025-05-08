import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../../core/constants/app_constants.dart';
import '../../../../../core/constants/role_constants.dart';
import '../../../../../core/constants/validation_constants.dart';
import '../../../../../features/authentication/presentation/providers/auth_provider.dart';
import '../../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../../common/shared_widgets/toast.dart';
import 'package:trace/core/services/haptic_service.dart';

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
  bool _validateEmail = false;
  bool _validatePassword = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _signIn() async {
    setState(() {
      _validateEmail = true;
      _validatePassword = true;
    });
    if (_formKey.currentState?.validate() ?? false) {
      await HapticService.actionFeedback();
      try {
        debugPrint(
            '🔐 Attempting to sign in with email: ${_emailController.text}');
        await ref.read(authProvider.notifier).signIn(
              _emailController.text,
              _passwordController.text,
            );

        final user = ref.read(authProvider).value;
        debugPrint('✅ Sign in successful for user: ${user?.email}');

        if (user != null) {
          if (!user.isVerified) {
            debugPrint('⚠️ User email not verified: ${user.email}');
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
                        debugPrint(
                            '📧 Sending verification email to: ${user.email}');
                        await ref
                            .read(authProvider.notifier)
                            .verifyEmail(user.email);
                        if (!context.mounted) return;
                        Toast.show(
                          context,
                          message: 'Verification email sent successfully',
                          type: ToastType.success,
                        );
                      } catch (e) {
                        debugPrint('❌ Failed to send verification email: $e');
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
          if (!context.mounted) return;
          final route = RoleConstants.roleHomeRoutes[user.role] ??
              AppConstants.signInRoute;
          debugPrint('🔄 Navigating to: $route');
          Navigator.of(context).pushReplacementNamed(route);
        }
      } catch (e) {
        debugPrint('❌ Sign in failed: $e');
        if (!context.mounted) return;
        Toast.show(
          context,
          message: e.toString(),
          type: ToastType.error,
        );
      }
    } else {
      debugPrint('❌ Form validation failed');
      if (!context.mounted) return;
      Toast.show(
        context,
        message: 'Please check your email and password',
        type: ToastType.error,
      );
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
