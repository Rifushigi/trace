import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/app_card.dart';
import '../../../../common/styles/app_styles.dart';
import '../../../../core/utils/logger.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../providers/admin_provider.dart';

/// Screen for managing system settings in the admin dashboard.
class AdminSettingsScreen extends ConsumerStatefulWidget {
  /// Creates a new instance of [AdminSettingsScreen].
  const AdminSettingsScreen({super.key});

  @override
  ConsumerState<AdminSettingsScreen> createState() =>
      _AdminSettingsScreenState();
}

class _AdminSettingsScreenState extends ConsumerState<AdminSettingsScreen> {
  bool _isSaving = false;
  final Map<String, dynamic> _settings = {};
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    try {
      final settings = await ref.read(systemSettingsProvider.future);
      setState(() {
        _settings.clear();
        _settings.addAll(settings);
      });
    } catch (e, stackTrace) {
      AppLogger.error('Failed to load settings', e, stackTrace);
      if (mounted) {
        Toast.show(
          context,
          message: 'Failed to load settings',
          type: ToastType.error,
        );
      }
    }
  }

  Future<void> _handleSaveSettings() async {
    if (!_formKey.currentState!.validate()) return;

    try {
      setState(() => _isSaving = true);

      await ref.read(updateSettingsProvider(_settings).future);
      ref.invalidate(systemSettingsProvider);

      if (mounted) {
        Toast.show(
          context,
          message: 'Settings saved successfully',
          type: ToastType.success,
        );
      }
    } catch (e, stackTrace) {
      AppLogger.error('Failed to save settings', e, stackTrace);
      if (mounted) {
        Toast.show(
          context,
          message: 'Failed to save settings',
          type: ToastType.error,
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSaving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ref.watch(authProvider).when(
          data: (user) {
            if (user == null || user.role != 'admin') {
              return const Scaffold(
                body: Center(
                  child: Text('Access Denied'),
                ),
              );
            }

            return Scaffold(
              appBar: AppBar(
                title: const Text('System Settings'),
              ),
              body: LoadingOverlay(
                isLoading: _isSaving,
                child: ref.watch(systemSettingsProvider).when(
                      data: (settings) {
                        return RefreshIndicator(
                          onRefresh: _loadSettings,
                          child: SingleChildScrollView(
                            padding: const EdgeInsets.all(
                                AppConstants.defaultPadding),
                            child: Form(
                              key: _formKey,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSection(
                                    title: 'General Settings',
                                    children: [
                                      _buildTextField(
                                        label: 'System Name',
                                        value: _settings['system_name'] ?? '',
                                        onChanged: (value) =>
                                            _settings['system_name'] = value,
                                        validator: (value) {
                                          if (value == null || value.isEmpty) {
                                            return 'Please enter a system name';
                                          }
                                          return null;
                                        },
                                      ),
                                      const SizedBox(
                                          height: AppConstants.defaultSpacing),
                                      _buildTextField(
                                        label: 'Support Email',
                                        value: _settings['support_email'] ?? '',
                                        onChanged: (value) =>
                                            _settings['support_email'] = value,
                                        validator: (value) {
                                          if (value == null || value.isEmpty) {
                                            return 'Please enter a support email';
                                          }
                                          if (!value.contains('@')) {
                                            return 'Please enter a valid email';
                                          }
                                          return null;
                                        },
                                      ),
                                    ],
                                  ),
                                  const SizedBox(
                                      height: AppConstants.defaultSpacing * 2),
                                  _buildSection(
                                    title: 'Attendance Settings',
                                    children: [
                                      _buildSwitch(
                                        label: 'Enable QR Code Attendance',
                                        value:
                                            _settings['enable_qr_attendance'] ??
                                                true,
                                        onChanged: (value) => setState(() {
                                          _settings['enable_qr_attendance'] =
                                              value;
                                        }),
                                      ),
                                      const SizedBox(
                                          height: AppConstants.defaultSpacing),
                                      _buildSwitch(
                                        label: 'Enable Face Recognition',
                                        value: _settings[
                                                'enable_face_recognition'] ??
                                            false,
                                        onChanged: (value) => setState(() {
                                          _settings['enable_face_recognition'] =
                                              value;
                                        }),
                                      ),
                                      const SizedBox(
                                          height: AppConstants.defaultSpacing),
                                      _buildTextField(
                                        label:
                                            'Attendance Grace Period (minutes)',
                                        value: (_settings[
                                                    'attendance_grace_period'] ??
                                                5)
                                            .toString(),
                                        keyboardType: TextInputType.number,
                                        onChanged: (value) => _settings[
                                                'attendance_grace_period'] =
                                            int.tryParse(value) ?? 5,
                                        validator: (value) {
                                          if (value == null || value.isEmpty) {
                                            return 'Please enter a grace period';
                                          }
                                          final number = int.tryParse(value);
                                          if (number == null || number < 0) {
                                            return 'Please enter a valid number';
                                          }
                                          return null;
                                        },
                                      ),
                                    ],
                                  ),
                                  const SizedBox(
                                      height: AppConstants.defaultSpacing * 2),
                                  _buildSection(
                                    title: 'Notification Settings',
                                    children: [
                                      _buildSwitch(
                                        label: 'Email Notifications',
                                        value: _settings[
                                                'enable_email_notifications'] ??
                                            true,
                                        onChanged: (value) => setState(() {
                                          _settings[
                                                  'enable_email_notifications'] =
                                              value;
                                        }),
                                      ),
                                      const SizedBox(
                                          height: AppConstants.defaultSpacing),
                                      _buildSwitch(
                                        label: 'Push Notifications',
                                        value: _settings[
                                                'enable_push_notifications'] ??
                                            true,
                                        onChanged: (value) => setState(() {
                                          _settings[
                                                  'enable_push_notifications'] =
                                              value;
                                        }),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(
                                      height: AppConstants.defaultSpacing * 2),
                                  SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton(
                                      onPressed: _isSaving
                                          ? null
                                          : _handleSaveSettings,
                                      child: Text(_isSaving
                                          ? 'Saving...'
                                          : 'Save Settings'),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                      loading: () => const Center(
                        child: CircularProgressIndicator(),
                      ),
                      error: (error, stackTrace) {
                        AppLogger.error(
                            'Failed to load settings', error, stackTrace);
                        return Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('Failed to load settings'),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: () {
                                  ref.invalidate(systemSettingsProvider);
                                  Toast.show(
                                    context,
                                    message: 'Retrying to load settings...',
                                    type: ToastType.info,
                                  );
                                },
                                child: const Text('Retry'),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
              ),
            );
          },
          loading: () => const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          ),
          error: (error, stackTrace) {
            AppLogger.error('Failed to load user data', error, stackTrace);
            return Scaffold(
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Failed to load user data'),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        ref.invalidate(authProvider);
                        Toast.show(
                          context,
                          message: 'Retrying to load user data...',
                          type: ToastType.info,
                        );
                      },
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            );
          },
        );
  }

  Widget _buildSection({
    required String title,
    required List<Widget> children,
  }) {
    return AppCard(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: AppStyles.titleMedium,
            ),
            const SizedBox(height: AppConstants.defaultSpacing),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required String value,
    required ValueChanged<String> onChanged,
    String? Function(String?)? validator,
    TextInputType? keyboardType,
  }) {
    return TextFormField(
      initialValue: value,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
      ),
      keyboardType: keyboardType,
      onChanged: onChanged,
      validator: validator,
    );
  }

  Widget _buildSwitch({
    required String label,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppStyles.bodyMedium),
        Switch(
          value: value,
          onChanged: onChanged,
        ),
      ],
    );
  }
}
