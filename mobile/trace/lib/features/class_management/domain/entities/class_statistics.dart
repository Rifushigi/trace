class ClassStatistics {
  final int totalStudents;
  final int presentCount;
  final int absentCount;
  final int lateCount;
  final Map<String, int> attendanceByDate;

  ClassStatistics({
    required this.totalStudents,
    required this.presentCount,
    required this.absentCount,
    required this.lateCount,
    required this.attendanceByDate,
  });

  factory ClassStatistics.fromJson(Map<String, dynamic> json) {
    return ClassStatistics(
      totalStudents: json['totalStudents'] as int,
      presentCount: json['presentCount'] as int,
      absentCount: json['absentCount'] as int,
      lateCount: json['lateCount'] as int,
      attendanceByDate: Map<String, int>.from(json['attendanceByDate'] as Map),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalStudents': totalStudents,
      'presentCount': presentCount,
      'absentCount': absentCount,
      'lateCount': lateCount,
      'attendanceByDate': attendanceByDate,
    };
  }
}
