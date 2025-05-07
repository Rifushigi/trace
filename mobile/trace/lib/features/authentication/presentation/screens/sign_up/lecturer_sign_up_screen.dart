import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trace/core/constants/app_constants.dart';
import 'package:trace/core/constants/role_constants.dart';
import 'package:trace/core/constants/validation_constants.dart';
import '../../providers/auth_provider.dart';
import 'package:trace/common/shared_widgets/loading_overlay.dart';
import 'package:trace/common/shared_widgets/toast.dart';

class LecturerSignUpScreen extends ConsumerStatefulWidget {
  const LecturerSignUpScreen({super.key});

  @override
  ConsumerState<LecturerSignUpScreen> createState() =>
      _LecturerSignUpScreenState();
}

class _LecturerSignUpScreenState extends ConsumerState<LecturerSignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _staffIdController = TextEditingController();
  final _collegeController = TextEditingController();
  int _currentStep = 0;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _staffIdController.dispose();
    _collegeController.dispose();
    super.dispose();
  }

  Future<void> _signUp() async {
    if (_formKey.currentState?.validate() ?? false) {
      try {
        await ref.read(authProvider.notifier).signUp(
              email: _emailController.text,
              password: _passwordController.text,
              firstName: _firstNameController.text,
              lastName: _lastNameController.text,
              role: RoleConstants.lecturerRole,
              staffId: _staffIdController.text,
              college: _collegeController.text,
            );
        if (mounted) {
          Toast.show(
            context,
            message:
                'Account created successfully! Please check your email for verification.',
            type: ToastType.success,
            duration: const Duration(seconds: 5),
          );
          Navigator.of(context).pushReplacementNamed(AppConstants.signInRoute);
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
      message: 'Creating your account...',
      child: Scaffold(
        appBar: AppBar(
          title: const Text(AppConstants.appName),
        ),
        body: Form(
          key: _formKey,
          child: Stepper(
            currentStep: _currentStep,
            onStepContinue: () {
              if (_currentStep < 1) {
                setState(() {
                  _currentStep += 1;
                });
              } else {
                _signUp();
              }
            },
            onStepCancel: () {
              if (_currentStep > 0) {
                setState(() {
                  _currentStep -= 1;
                });
              } else {
                Navigator.of(context).pop();
              }
            },
            steps: [
              Step(
                title: const Text('Personal Information'),
                content: Column(
                  children: [
                    TextFormField(
                      controller: _firstNameController,
                      decoration: const InputDecoration(
                        labelText: 'First Name',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        if (!ValidationConstants.isValidName(value)) {
                          return ValidationConstants.invalidName;
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: AppConstants.defaultPadding),
                    TextFormField(
                      controller: _lastNameController,
                      decoration: const InputDecoration(
                        labelText: 'Last Name',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        if (!ValidationConstants.isValidName(value)) {
                          return ValidationConstants.invalidName;
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: AppConstants.defaultPadding),
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        border: OutlineInputBorder(),
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
                      decoration: const InputDecoration(
                        labelText: 'Password',
                        border: OutlineInputBorder(),
                      ),
                      obscureText: true,
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
                  ],
                ),
              ),
              Step(
                title: const Text('Professional Information'),
                content: Column(
                  children: [
                    TextFormField(
                      controller: _staffIdController,
                      decoration: const InputDecoration(
                        labelText: 'Staff ID',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        if (!ValidationConstants.isValidStaffId(value)) {
                          return ValidationConstants.invalidStaffId;
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: AppConstants.defaultPadding),
                    TextFormField(
                      controller: _collegeController,
                      decoration: const InputDecoration(
                        labelText: 'College',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        return null;
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
