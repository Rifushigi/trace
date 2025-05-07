class AttendanceSession {
  final String id;
  final DateTime startTime;
  final DateTime? endTime;
  final String status;
  final int presentCount;
  final int absentCount;
  final int totalCount;

  AttendanceSession({
    required this.id,
    required this.startTime,
    this.endTime,
    required this.status,
    required this.presentCount,
    required this.absentCount,
    required this.totalCount,
  });

  factory AttendanceSession.fromJson(Map<String, dynamic> json) {
    return AttendanceSession(
      id: json['id'] as String,
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: json['endTime'] != null
          ? DateTime.parse(json['endTime'] as String)
          : null,
      status: json['status'] as String,
      presentCount: json['presentCount'] as int,
      absentCount: json['absentCount'] as int,
      totalCount: json['totalCount'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'status': status,
      'presentCount': presentCount,
      'absentCount': absentCount,
      'totalCount': totalCount,
    };
  }
}
