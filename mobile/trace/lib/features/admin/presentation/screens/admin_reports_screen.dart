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

/// Screen for viewing system reports in the admin dashboard.
class AdminReportsScreen extends ConsumerStatefulWidget {
  /// Creates a new instance of [AdminReportsScreen].
  const AdminReportsScreen({super.key});

  @override
  ConsumerState<AdminReportsScreen> createState() => _AdminReportsScreenState();
}

class _AdminReportsScreenState extends ConsumerState<AdminReportsScreen> {
  bool _isGeneratingReport = false;
  String? _selectedReportType;

  Future<void> _handleGenerateReport(String reportType) async {
    try {
      setState(() {
        _isGeneratingReport = true;
        _selectedReportType = reportType;
      });

      await ref.read(generateReportProvider(reportType).future);
      ref.invalidate(systemReportsProvider);

      if (mounted) {
        Toast.show(
          context,
          message: 'Report generated successfully',
          type: ToastType.success,
        );
      }
    } catch (e, stackTrace) {
      AppLogger.error('Failed to generate report', e, stackTrace);
      if (mounted) {
        Toast.show(
          context,
          message: 'Failed to generate report',
          type: ToastType.error,
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isGeneratingReport = false;
          _selectedReportType = null;
        });
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
                title: const Text('System Reports'),
              ),
              body: LoadingOverlay(
                isLoading: _isGeneratingReport,
                child: ref.watch(systemReportsProvider).when(
                      data: (reports) {
                        return RefreshIndicator(
                          onRefresh: () async {
                            ref.invalidate(systemReportsProvider);
                            Toast.show(
                              context,
                              message: 'Reports refreshed',
                              type: ToastType.success,
                            );
                          },
                          child: ListView(
                            padding: const EdgeInsets.all(
                                AppConstants.defaultPadding),
                            children: [
                              _buildReportCard(
                                title: 'Attendance Overview',
                                description:
                                    'View attendance statistics across all classes',
                                icon: Icons.calendar_today,
                                onGenerate: () =>
                                    _handleGenerateReport('attendance'),
                                isGenerating: _isGeneratingReport &&
                                    _selectedReportType == 'attendance',
                                lastGenerated: reports['attendance_report']
                                    ?['last_generated'],
                              ),
                              const SizedBox(
                                  height: AppConstants.defaultSpacing),
                              _buildReportCard(
                                title: 'User Activity',
                                description:
                                    'Track user login and activity patterns',
                                icon: Icons.people,
                                onGenerate: () =>
                                    _handleGenerateReport('user_activity'),
                                isGenerating: _isGeneratingReport &&
                                    _selectedReportType == 'user_activity',
                                lastGenerated: reports['user_activity_report']
                                    ?['last_generated'],
                              ),
                              const SizedBox(
                                  height: AppConstants.defaultSpacing),
                              _buildReportCard(
                                title: 'System Performance',
                                description:
                                    'Monitor system performance metrics',
                                icon: Icons.speed,
                                onGenerate: () =>
                                    _handleGenerateReport('system_performance'),
                                isGenerating: _isGeneratingReport &&
                                    _selectedReportType == 'system_performance',
                                lastGenerated:
                                    reports['system_performance_report']
                                        ?['last_generated'],
                              ),
                              const SizedBox(
                                  height: AppConstants.defaultSpacing),
                              _buildReportCard(
                                title: 'Error Logs',
                                description:
                                    'View system error logs and exceptions',
                                icon: Icons.error_outline,
                                onGenerate: () =>
                                    _handleGenerateReport('error_logs'),
                                isGenerating: _isGeneratingReport &&
                                    _selectedReportType == 'error_logs',
                                lastGenerated: reports['error_logs_report']
                                    ?['last_generated'],
                              ),
                            ],
                          ),
                        );
                      },
                      loading: () => const Center(
                        child: CircularProgressIndicator(),
                      ),
                      error: (error, stackTrace) {
                        AppLogger.error(
                            'Failed to load reports', error, stackTrace);
                        return Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('Failed to load reports'),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: () {
                                  ref.invalidate(systemReportsProvider);
                                  Toast.show(
                                    context,
                                    message: 'Retrying to load reports...',
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

  Widget _buildReportCard({
    required String title,
    required String description,
    required IconData icon,
    required VoidCallback onGenerate,
    required bool isGenerating,
    String? lastGenerated,
  }) {
    return AppCard(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: AppStyles.titleMedium,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        description,
                        style: AppStyles.bodyMedium,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (lastGenerated != null) ...[
              const SizedBox(height: 8),
              Text(
                'Last generated: ${DateTime.parse(lastGenerated).toLocal().toString()}',
                style: AppStyles.bodySmall,
              ),
            ],
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: isGenerating ? null : onGenerate,
                child: Text(isGenerating ? 'Generating...' : 'Generate Report'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
