class AttendanceSessionEntity {
  final String id;
  final String classId;
  final DateTime startTime;
  final DateTime? endTime;
  final bool isActive;
  final List<String> checkedInStudents;

  AttendanceSessionEntity({
    required this.id,
    required this.classId,
    required this.startTime,
    this.endTime,
    required this.isActive,
    required this.checkedInStudents,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'classId': classId,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'isActive': isActive,
      'checkedInStudents': checkedInStudents,
    };
  }

  factory AttendanceSessionEntity.fromJson(Map<String, dynamic> json) {
    return AttendanceSessionEntity(
      id: json['id'] as String,
      classId: json['classId'] as String,
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: json['endTime'] != null
          ? DateTime.parse(json['endTime'] as String)
          : null,
      isActive: json['isActive'] as bool,
      checkedInStudents: List<String>.from(json['checkedInStudents'] as List),
    );
  }
}
