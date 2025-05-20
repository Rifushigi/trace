import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/student_model.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/network/endpoints.dart';

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
  final ApiClient _apiClient;

  SessionDetailsNotifier(this._apiClient) : super(SessionDetails(students: []));

  Future<void> loadSessionDetails(String sessionId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.get(
        Endpoints.attendance.getSessionAttendanceUrl(sessionId),
      );

      if (response.statusCode == 200) {
        final List<dynamic> studentsData = response.data['data']['students'];
        final students = studentsData
            .map((data) => Student(
                  id: data['id'],
                  name: data['name'],
                  isPresent: data['isPresent'] ?? false,
                ))
            .toList();

        state = state.copyWith(
          students: students,
          isLoading: false,
        );
      } else {
        throw Exception(
            response.data['message'] ?? 'Failed to load session details');
      }
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
  final apiClient = ref.watch(apiClientProvider);
  return SessionDetailsNotifier(apiClient);
});
