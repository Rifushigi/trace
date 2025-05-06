import 'package:freezed_annotation/freezed_annotation.dart';

part 'class_statistics.freezed.dart';
part 'class_statistics.g.dart';

@freezed
class ClassStatistics with _$ClassStatistics {
  const factory ClassStatistics({
    required int totalStudents,
    required int totalSessions,
    required double averageAttendance,
    required List<AttendanceTrend> attendanceTrend,
    required Map<String, double> attendanceByDay,
    required Map<String, double> attendanceByStudent,
    required List<RecentSession> recentSessions,
  }) = _ClassStatistics;

  factory ClassStatistics.fromJson(Map<String, dynamic> json) => _$ClassStatisticsFromJson(json);
}

@freezed
class AttendanceTrend with _$AttendanceTrend {
  const factory AttendanceTrend({
    required DateTime date,
    required double attendance,
  }) = _AttendanceTrend;

  factory AttendanceTrend.fromJson(Map<String, dynamic> json) => _$AttendanceTrendFromJson(json);
}

@freezed
class RecentSession with _$RecentSession {
  const factory RecentSession({
    required String id,
    required DateTime date,
    required double attendanceRate,
    required int presentCount,
    required int totalCount,
  }) = _RecentSession;

  factory RecentSession.fromJson(Map<String, dynamic> json) => _$RecentSessionFromJson(json);
} 