// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'class_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ClassEntityImpl _$$ClassEntityImplFromJson(Map<String, dynamic> json) =>
    _$ClassEntityImpl(
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

Map<String, dynamic> _$$ClassEntityImplToJson(_$ClassEntityImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'code': instance.code,
      'lecturerId': instance.lecturerId,
      'schedule': instance.schedule,
      'students': instance.students,
    };
