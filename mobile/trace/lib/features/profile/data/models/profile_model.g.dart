// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'profile_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ProfileModelImpl _$$ProfileModelImplFromJson(Map<String, dynamic> json) =>
    _$ProfileModelImpl(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      isVerified: json['isVerified'] as bool,
      avatar: json['avatar'] as String?,
      matricNo: json['matricNo'] as String?,
      program: json['program'] as String?,
      level: json['level'] as String?,
      staffId: json['staffId'] as String?,
      college: json['college'] as String?,
      department: json['department'] as String?,
    );

Map<String, dynamic> _$$ProfileModelImplToJson(_$ProfileModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'email': instance.email,
      'role': instance.role,
      'isVerified': instance.isVerified,
      'avatar': instance.avatar,
      'matricNo': instance.matricNo,
      'program': instance.program,
      'level': instance.level,
      'staffId': instance.staffId,
      'college': instance.college,
      'department': instance.department,
    };
