import 'package:flutter/material.dart';
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

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _signIn() async {
    if (_formKey.currentState?.validate() ?? false) {
      await HapticService.actionFeedback();
      try {
        await ref.read(authProvider.notifier).signIn(
              _emailController.text,
              _passwordController.text,
            );

        final user = ref.read(authProvider).value;
        if (user != null) {
          if (!user.isVerified) {
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
          Navigator.of(context).pushReplacementNamed(route);
        }
      } catch (e) {
        if (!context.mounted) return;
        Toast.show(
          context,
          message: e.toString(),
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
        appBar: AppBar(
          title: const Text(AppConstants.appName),
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppConstants.defaultPadding),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
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
                    onPressed: authState.isLoading ? null : _signIn,
                    child: const Text('Sign In'),
                  ),
                  const SizedBox(height: AppConstants.defaultPadding),
                  TextButton(
                    onPressed: () {
                      HapticService.navigationFeedback();
                      Navigator.pushNamed(context, '/sign-up');
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
    );
  }
}
