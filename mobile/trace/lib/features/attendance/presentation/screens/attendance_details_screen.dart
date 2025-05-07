import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../authentication/presentation/providers/auth_provider.dart';
import '../providers/session_details_provider.dart';

enum StudentListSortOption {
  nameAsc,
  nameDesc,
  statusPresent,
  statusAbsent,
  idAsc,
  idDesc,
}

enum StudentFilter {
  all,
  present,
  absent,
}

class AttendanceDetailsScreen extends ConsumerWidget {
  final String sessionId;
  final String className;

  const AttendanceDetailsScreen({
    super.key,
    required this.sessionId,
    required this.className,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final sessionDetails = ref.watch(sessionDetailsProvider);

    return authState.when(
      data: (user) {
        if (user == null) {
          return const Center(
              child: Text('Please log in to view attendance details'));
        }

        if (user.role != 'teacher' && user.role != 'admin') {
          return const Center(child: Text('Unauthorized access'));
        }

        return Scaffold(
          appBar: AppBar(
            title: const Text('Attendance Details'),
          ),
          body: sessionDetails.isLoading
              ? const Center(child: CircularProgressIndicator())
              : sessionDetails.error != null
                  ? Center(child: Text('Error: ${sessionDetails.error}'))
                  : ListView.builder(
                      itemCount: sessionDetails.students.length,
                      itemBuilder: (context, index) {
                        final student = sessionDetails.students[index];
                        return ListTile(
                          title: Text(student.name),
                          trailing: Icon(
                            student.isPresent
                                ? Icons.check_circle
                                : Icons.cancel,
                            color:
                                student.isPresent ? Colors.green : Colors.red,
                          ),
                        );
                      },
                    ),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => Center(child: Text('Error: $error')),
    );
  }
}
