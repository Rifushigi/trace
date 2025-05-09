import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../../core/constants/app_constants.dart';
import '../../../../../core/constants/role_constants.dart';
import '../../../../../core/constants/validation_constants.dart';
import '../../providers/auth_provider.dart';
import '../../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../../common/shared_widgets/toast.dart';

class StudentSignUpScreen extends ConsumerStatefulWidget {
  const StudentSignUpScreen({super.key});

  @override
  ConsumerState<StudentSignUpScreen> createState() =>
      _StudentSignUpScreenState();
}

class _StudentSignUpScreenState extends ConsumerState<StudentSignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _matricNoController = TextEditingController();
  final _programController = TextEditingController();
  final _levelController = TextEditingController();
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
      _matricNoController.text = '';
      _programController.text = '';
      _levelController.text = '';
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _matricNoController.dispose();
    _programController.dispose();
    _levelController.dispose();
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

    bool isAcademicInfoValid = _matricNoController.text.isNotEmpty &&
        _programController.text.isNotEmpty &&
        _levelController.text.isNotEmpty &&
        ValidationConstants.isValidMatricNumber(_matricNoController.text);

    if (isPersonalInfoValid && isAcademicInfoValid) {
      try {
        debugPrint(
            '📝 Attempting to sign up with email: ${_emailController.text}');
        await ref.read(authProvider.notifier).signUp(
          email: _emailController.text,
          password: _passwordController.text,
          firstName: _firstNameController.text,
          lastName: _lastNameController.text,
          role: RoleConstants.studentRole,
          additionalInfo: {
            'matricNo': _matricNoController.text,
            'program': _programController.text,
            'level': _levelController.text,
          },
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

  Widget _buildPersonalInfoStep() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
    );
  }

  Widget _buildAcademicInfoStep() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          TextFormField(
            controller: _matricNoController,
            decoration: const InputDecoration(
              labelText: 'Matric Number',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return ValidationConstants.requiredField;
              }
              if (!ValidationConstants.isValidMatricNumber(value)) {
                return ValidationConstants.invalidMatricNumber;
              }
              return null;
            },
          ),
          const SizedBox(height: AppConstants.defaultPadding),
          TextFormField(
            controller: _programController,
            decoration: const InputDecoration(
              labelText: 'Program',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return ValidationConstants.requiredField;
              }
              return null;
            },
          ),
          const SizedBox(height: AppConstants.defaultPadding),
          TextFormField(
            controller: _levelController,
            decoration: const InputDecoration(
              labelText: 'Level',
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
    );
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
            'Student Sign Up',
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
                        content: _buildPersonalInfoStep(),
                      ),
                      Step(
                        title: const Text('Academic Information'),
                        content: _buildAcademicInfoStep(),
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
