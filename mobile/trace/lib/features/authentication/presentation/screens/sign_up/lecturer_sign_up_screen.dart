import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
  void initState() {
    super.initState();
    // Pre-warm the controllers to avoid first-time lag
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _emailController.text = '';
      _passwordController.text = '';
      _firstNameController.text = '';
      _lastNameController.text = '';
      _staffIdController.text = '';
      _collegeController.text = '';
    });
  }

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
    // Force validation of all fields
    setState(() {
      _formKey.currentState?.validate();
    });

    // Check if all fields are valid
    bool isPersonalInfoValid = _firstNameController.text.isNotEmpty &&
        _lastNameController.text.isNotEmpty &&
        _emailController.text.isNotEmpty &&
        _passwordController.text.isNotEmpty &&
        ValidationConstants.isValidName(_firstNameController.text) &&
        ValidationConstants.isValidName(_lastNameController.text) &&
        ValidationConstants.isValidEmail(_emailController.text) &&
        ValidationConstants.isValidPassword(_passwordController.text);

    bool isProfessionalInfoValid = _staffIdController.text.isNotEmpty &&
        _collegeController.text.isNotEmpty &&
        ValidationConstants.isValidStaffId(_staffIdController.text);

    if (isPersonalInfoValid && isProfessionalInfoValid) {
      try {
        debugPrint(
            '📝 Attempting to sign up with email: ${_emailController.text}');
        await ref.read(authProvider.notifier).signUp(
              email: _emailController.text,
              password: _passwordController.text,
              firstName: _firstNameController.text,
              lastName: _lastNameController.text,
              role: RoleConstants.lecturerRole,
              staffId: _staffIdController.text,
              college: _collegeController.text,
            );

        // Check if the sign-up was successful by checking the auth state
        final authState = ref.read(authProvider);
        if (authState.hasValue && authState.value != null) {
          debugPrint('✅ Sign up successful for: ${_emailController.text}');
          if (mounted) {
            Toast.show(
              context,
              message:
                  'Account created successfully! Please check your email for verification.',
              type: ToastType.success,
              duration: const Duration(seconds: 5),
            );
            Navigator.of(context)
                .pushReplacementNamed(AppConstants.signInRoute);
          }
        } else {
          throw Exception('Sign up failed: No user data received');
        }
      } catch (e) {
        debugPrint('❌ Sign up failed: $e');
        if (mounted) {
          Toast.show(
            context,
            message: e.toString(),
            type: ToastType.error,
          );
        }
      }
    } else {
      debugPrint('❌ Form validation failed');
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
      message: 'Creating your account...',
      child: Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          backgroundColor:
              Theme.of(context).colorScheme.surfaceContainerHighest,
          elevation: 2,
          centerTitle: true,
          systemOverlayStyle: SystemUiOverlayStyle.dark,
          title: Text(
            'Lecturer Sign Up',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
          ),
        ),
        body: SafeArea(
          child: Form(
            key: _formKey,
            autovalidateMode: AutovalidateMode.disabled,
            child: Column(
              children: [
                const SizedBox(height: AppConstants.defaultPadding * 2),
                Container(
                  padding:
                      const EdgeInsets.symmetric(vertical: 4, horizontal: 12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Theme.of(context).colorScheme.primary,
                        Theme.of(context).colorScheme.primaryContainer,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'TRACE',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: AppConstants.defaultPadding),
                Expanded(
                  child: Stepper(
                    currentStep: _currentStep,
                    margin: const EdgeInsets.symmetric(vertical: 16),
                    onStepContinue: () {
                      if (_currentStep < 1) {
                        // Validate current step before proceeding
                        if (_formKey.currentState?.validate() ?? false) {
                          setState(() {
                            _currentStep += 1;
                          });
                        } else {
                          Toast.show(
                            context,
                            message: 'Please fill in all fields correctly',
                            type: ToastType.error,
                          );
                        }
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
                        content: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 8),
                          child: Column(
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
                              const SizedBox(
                                  height: AppConstants.defaultPadding),
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
                              const SizedBox(
                                  height: AppConstants.defaultPadding),
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
                                  if (!ValidationConstants.isValidEmail(
                                      value)) {
                                    return ValidationConstants.invalidEmail;
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(
                                  height: AppConstants.defaultPadding),
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
                                  if (!ValidationConstants.isValidPassword(
                                      value)) {
                                    return ValidationConstants.invalidPassword;
                                  }
                                  return null;
                                },
                              ),
                            ],
                          ),
                        ),
                      ),
                      Step(
                        title: const Text('Professional Information'),
                        content: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 8),
                          child: Column(
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
                                  if (!ValidationConstants.isValidStaffId(
                                      value)) {
                                    return ValidationConstants.invalidStaffId;
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(
                                  height: AppConstants.defaultPadding),
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
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
