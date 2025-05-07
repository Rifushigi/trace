// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'class_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ClassScheduleImpl _$$ClassScheduleImplFromJson(Map<String, dynamic> json) =>
    _$ClassScheduleImpl(
      day: json['day'] as String,
      startTime: json['startTime'] as String,
      endTime: json['endTime'] as String,
      isRecurring: json['isRecurring'] as bool? ?? false,
      recurringDays: (json['recurringDays'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      endDate: json['endDate'] as String?,
    );

Map<String, dynamic> _$$ClassScheduleImplToJson(_$ClassScheduleImpl instance) =>
    <String, dynamic>{
      'day': instance.day,
      'startTime': instance.startTime,
      'endTime': instance.endTime,
      'isRecurring': instance.isRecurring,
      'recurringDays': instance.recurringDays,
      'endDate': instance.endDate,
    };

_$ClassModelImpl _$$ClassModelImplFromJson(Map<String, dynamic> json) =>
    _$ClassModelImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      lecturerId: json['lecturerId'] as String,
      schedule: json['schedule'] as Map<String, dynamic>,
      students: (json['students'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
    );

Map<String, dynamic> _$$ClassModelImplToJson(_$ClassModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'code': instance.code,
      'lecturerId': instance.lecturerId,
      'schedule': instance.schedule,
      'students': instance.students,
    };
