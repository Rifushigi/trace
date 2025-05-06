import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/constants/role_constants.dart';
import '../../../../core/constants/validation_constants.dart';
import '../../providers/auth_provider.dart';
import '../sign_up/role_selection_screen.dart';
import '../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../common/shared_widgets/toast.dart';
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
              email: _emailController.text,
              password: _passwordController.text,
            );
        if (mounted) {
          final user = ref.read(authProvider).user;
          if (user != null) {
            if (!user.isVerified) {
              Toast.show(
                context,
                message: 'Please verify your email before signing in. Check your inbox for the verification link.',
                type: ToastType.warning,
                duration: const Duration(seconds: 5),
              );
              return;
            }
            final route = RoleConstants.roleHomeRoutes[user.role] ?? AppConstants.signInRoute;
            Navigator.of(context).pushReplacementNamed(route);
          }
        }
      } catch (e) {
        if (mounted) {
          Toast.show(
            context,
            message: e.toString(),
            type: ToastType.error,
          );
        }
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
          title: Text(AppConstants.appName),
        ),
        body: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.all(AppConstants.defaultPadding),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    AppConstants.welcomeMessage,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: AppConstants.defaultPadding * 2),
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
                  SizedBox(height: AppConstants.defaultPadding),
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
                  SizedBox(height: AppConstants.defaultPadding * 1.5),
                  ElevatedButton(
                    onPressed: authState.isLoading ? null : () async {
                      await HapticService.actionFeedback();
                      await _signIn();
                    },
                    child: const Text('Sign In'),
                  ),
                  SizedBox(height: AppConstants.defaultPadding),
                  TextButton(
                    onPressed: () async {
                      await HapticService.navigationFeedback();
                      Navigator.pushNamed(context, '/sign-up');
                    },
                    child: Text(AppConstants.signUpPrompt),
                  ),
                  TextButton(
                    onPressed: () async {
                      await HapticService.navigationFeedback();
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