// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attendance_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AttendanceModelImpl _$$AttendanceModelImplFromJson(
        Map<String, dynamic> json) =>
    _$AttendanceModelImpl(
      sessionId: json['sessionId'] as String,
      classId: json['classId'] as String,
      studentId: json['studentId'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      status: json['status'] as String,
    );

Map<String, dynamic> _$$AttendanceModelImplToJson(
        _$AttendanceModelImpl instance) =>
    <String, dynamic>{
      'sessionId': instance.sessionId,
      'classId': instance.classId,
      'studentId': instance.studentId,
      'timestamp': instance.timestamp.toIso8601String(),
      'status': instance.status,
    };
