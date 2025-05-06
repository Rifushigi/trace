class AttendanceSession {
  final String id;
  final String classId;
  final DateTime startTime;
  final DateTime? endTime;
  final bool isActive;
  final int presentCount;
  final int absentCount;
  final int totalCount;

  AttendanceSession({
    required this.id,
    required this.classId,
    required this.startTime,
    this.endTime,
    required this.isActive,
    required this.presentCount,
    required this.absentCount,
    required this.totalCount,
  });

  factory AttendanceSession.fromJson(Map<String, dynamic> json) {
    return AttendanceSession(
      id: json['id'] as String,
      classId: json['classId'] as String,
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: json['endTime'] != null
          ? DateTime.parse(json['endTime'] as String)
          : null,
      isActive: json['isActive'] as bool,
      presentCount: json['presentCount'] as int,
      absentCount: json['absentCount'] as int,
      totalCount: json['totalCount'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'classId': classId,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'isActive': isActive,
      'presentCount': presentCount,
      'absentCount': absentCount,
      'totalCount': totalCount,
    };
  }
} 