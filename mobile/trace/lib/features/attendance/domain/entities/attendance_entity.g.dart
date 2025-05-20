// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attendance_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AttendanceEntityImpl _$$AttendanceEntityImplFromJson(
        Map<String, dynamic> json) =>
    _$AttendanceEntityImpl(
      sessionId: json['sessionId'] as String,
      classId: json['classId'] as String,
      studentId: json['studentId'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      status: json['status'] as String,
    );

Map<String, dynamic> _$$AttendanceEntityImplToJson(
        _$AttendanceEntityImpl instance) =>
    <String, dynamic>{
      'sessionId': instance.sessionId,
      'classId': instance.classId,
      'studentId': instance.studentId,
      'timestamp': instance.timestamp.toIso8601String(),
      'status': instance.status,
    };
