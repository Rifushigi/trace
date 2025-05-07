// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'class_statistics.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ClassStatisticsImpl _$$ClassStatisticsImplFromJson(
        Map<String, dynamic> json) =>
    _$ClassStatisticsImpl(
      totalStudents: (json['totalStudents'] as num).toInt(),
      totalSessions: (json['totalSessions'] as num).toInt(),
      averageAttendance: (json['averageAttendance'] as num).toDouble(),
      attendanceTrend: (json['attendanceTrend'] as List<dynamic>)
          .map((e) => AttendanceTrend.fromJson(e as Map<String, dynamic>))
          .toList(),
      attendanceByDay: (json['attendanceByDay'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
      attendanceByStudent:
          (json['attendanceByStudent'] as Map<String, dynamic>).map(
        (k, e) => MapEntry(k, (e as num).toDouble()),
      ),
      recentSessions: (json['recentSessions'] as List<dynamic>)
          .map((e) => RecentSession.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$$ClassStatisticsImplToJson(
        _$ClassStatisticsImpl instance) =>
    <String, dynamic>{
      'totalStudents': instance.totalStudents,
      'totalSessions': instance.totalSessions,
      'averageAttendance': instance.averageAttendance,
      'attendanceTrend': instance.attendanceTrend,
      'attendanceByDay': instance.attendanceByDay,
      'attendanceByStudent': instance.attendanceByStudent,
      'recentSessions': instance.recentSessions,
    };

_$AttendanceTrendImpl _$$AttendanceTrendImplFromJson(
        Map<String, dynamic> json) =>
    _$AttendanceTrendImpl(
      date: DateTime.parse(json['date'] as String),
      attendance: (json['attendance'] as num).toDouble(),
    );

Map<String, dynamic> _$$AttendanceTrendImplToJson(
        _$AttendanceTrendImpl instance) =>
    <String, dynamic>{
      'date': instance.date.toIso8601String(),
      'attendance': instance.attendance,
    };

_$RecentSessionImpl _$$RecentSessionImplFromJson(Map<String, dynamic> json) =>
    _$RecentSessionImpl(
      id: json['id'] as String,
      date: DateTime.parse(json['date'] as String),
      attendanceRate: (json['attendanceRate'] as num).toDouble(),
      presentCount: (json['presentCount'] as num).toInt(),
      totalCount: (json['totalCount'] as num).toInt(),
    );

Map<String, dynamic> _$$RecentSessionImplToJson(_$RecentSessionImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date.toIso8601String(),
      'attendanceRate': instance.attendanceRate,
      'presentCount': instance.presentCount,
      'totalCount': instance.totalCount,
    };
