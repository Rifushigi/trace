import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/student_model.dart';

class SessionDetails {
  final List<Student> students;
  final bool isLoading;
  final String? error;

  SessionDetails({
    required this.students,
    this.isLoading = false,
    this.error,
  });

  SessionDetails copyWith({
    List<Student>? students,
    bool? isLoading,
    String? error,
  }) {
    return SessionDetails(
      students: students ?? this.students,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class SessionDetailsNotifier extends StateNotifier<SessionDetails> {
  SessionDetailsNotifier() : super(SessionDetails(students: []));

  Future<void> loadSessionDetails(String sessionId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      // TODO: Implement actual API call to load session details
      await Future.delayed(const Duration(seconds: 1)); // Simulated delay
      state = state.copyWith(
        students: [
          Student(id: '1', name: 'John Doe', isPresent: true),
          Student(id: '2', name: 'Jane Smith', isPresent: false),
        ],
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
}

final sessionDetailsProvider =
    StateNotifierProvider<SessionDetailsNotifier, SessionDetails>((ref) {
  return SessionDetailsNotifier();
});
