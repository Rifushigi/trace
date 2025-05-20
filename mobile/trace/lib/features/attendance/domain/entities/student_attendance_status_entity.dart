class StudentAttendanceStatusEntity {
  final String studentId;
  final String classId;
  final int totalSessions;
  final int attendedSessions;
  final double attendancePercentage;
  final List<Map<String, dynamic>> attendanceHistory;

  StudentAttendanceStatusEntity({
    required this.studentId,
    required this.classId,
    required this.totalSessions,
    required this.attendedSessions,
    required this.attendancePercentage,
    required this.attendanceHistory,
  });

  Map<String, dynamic> toJson() {
    return {
      'studentId': studentId,
      'classId': classId,
      'totalSessions': totalSessions,
      'attendedSessions': attendedSessions,
      'attendancePercentage': attendancePercentage,
      'attendanceHistory': attendanceHistory,
    };
  }

  factory StudentAttendanceStatusEntity.fromJson(Map<String, dynamic> json) {
    return StudentAttendanceStatusEntity(
      studentId: json['studentId'] as String,
      classId: json['classId'] as String,
      totalSessions: json['totalSessions'] as int,
      attendedSessions: json['attendedSessions'] as int,
      attendancePercentage: (json['attendancePercentage'] as num).toDouble(),
      attendanceHistory:
          List<Map<String, dynamic>>.from(json['attendanceHistory'] as List),
    );
  }
}
