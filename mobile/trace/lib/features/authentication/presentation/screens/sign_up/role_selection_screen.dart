import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../../core/constants/app_constants.dart';
import '../../../../../core/constants/role_constants.dart';
import 'student_sign_up_screen.dart';
import 'lecturer_sign_up_screen.dart';
import '../../../../../common/shared_widgets/toast.dart';

class RoleSelectionScreen extends ConsumerWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppConstants.appName),
      ),
      body: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Choose your role',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppConstants.defaultPadding * 2),
            _RoleCard(
              title: 'Student',
              description: RoleConstants.roleFeatures[RoleConstants.studentRole]
                      ?.join(', ') ??
                  '',
              icon: Icons.school,
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const StudentSignUpScreen(),
                  ),
                );
              },
            ),
            const SizedBox(height: AppConstants.defaultPadding),
            _RoleCard(
              title: 'Lecturer',
              description: RoleConstants
                      .roleFeatures[RoleConstants.lecturerRole]
                      ?.join(', ') ??
                  '',
              icon: Icons.person,
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => const LecturerSignUpScreen(),
                  ),
                );
              },
            ),
            const SizedBox(height: AppConstants.defaultPadding * 1.5),
            TextButton(
              onPressed: () {
                Navigator.of(context)
                    .pushReplacementNamed(AppConstants.signInRoute);
              },
              child: const Text('Already have an account? Sign In'),
            ),
          ],
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final VoidCallback onTap;

  const _RoleCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppConstants.defaultRadius),
      ),
      child: InkWell(
        onTap: () {
          Toast.show(
            context,
            message: 'Navigating to $title sign up...',
            type: ToastType.info,
            duration: const Duration(seconds: 1),
          );
          onTap();
        },
        borderRadius: BorderRadius.circular(AppConstants.defaultRadius),
        child: Padding(
          padding: const EdgeInsets.all(AppConstants.defaultPadding),
          child: Column(
            children: [
              Icon(
                icon,
                size: 48,
                color: Theme.of(context).primaryColor,
              ),
              const SizedBox(height: AppConstants.defaultPadding),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: AppConstants.defaultSpacing),
              Text(
                description,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.color
                      ?.withAlpha(179),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
