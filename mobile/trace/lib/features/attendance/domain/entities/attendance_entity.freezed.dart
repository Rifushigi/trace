// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'attendance_entity.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

AttendanceEntity _$AttendanceEntityFromJson(Map<String, dynamic> json) {
  return _AttendanceEntity.fromJson(json);
}

/// @nodoc
mixin _$AttendanceEntity {
  String get sessionId => throw _privateConstructorUsedError;
  String get classId => throw _privateConstructorUsedError;
  String get studentId => throw _privateConstructorUsedError;
  DateTime get timestamp => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;

  /// Serializes this AttendanceEntity to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AttendanceEntity
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AttendanceEntityCopyWith<AttendanceEntity> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AttendanceEntityCopyWith<$Res> {
  factory $AttendanceEntityCopyWith(
          AttendanceEntity value, $Res Function(AttendanceEntity) then) =
      _$AttendanceEntityCopyWithImpl<$Res, AttendanceEntity>;
  @useResult
  $Res call(
      {String sessionId,
      String classId,
      String studentId,
      DateTime timestamp,
      String status});
}

/// @nodoc
class _$AttendanceEntityCopyWithImpl<$Res, $Val extends AttendanceEntity>
    implements $AttendanceEntityCopyWith<$Res> {
  _$AttendanceEntityCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AttendanceEntity
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? sessionId = null,
    Object? classId = null,
    Object? studentId = null,
    Object? timestamp = null,
    Object? status = null,
  }) {
    return _then(_value.copyWith(
      sessionId: null == sessionId
          ? _value.sessionId
          : sessionId // ignore: cast_nullable_to_non_nullable
              as String,
      classId: null == classId
          ? _value.classId
          : classId // ignore: cast_nullable_to_non_nullable
              as String,
      studentId: null == studentId
          ? _value.studentId
          : studentId // ignore: cast_nullable_to_non_nullable
              as String,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$AttendanceEntityImplCopyWith<$Res>
    implements $AttendanceEntityCopyWith<$Res> {
  factory _$$AttendanceEntityImplCopyWith(_$AttendanceEntityImpl value,
          $Res Function(_$AttendanceEntityImpl) then) =
      __$$AttendanceEntityImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String sessionId,
      String classId,
      String studentId,
      DateTime timestamp,
      String status});
}

/// @nodoc
class __$$AttendanceEntityImplCopyWithImpl<$Res>
    extends _$AttendanceEntityCopyWithImpl<$Res, _$AttendanceEntityImpl>
    implements _$$AttendanceEntityImplCopyWith<$Res> {
  __$$AttendanceEntityImplCopyWithImpl(_$AttendanceEntityImpl _value,
      $Res Function(_$AttendanceEntityImpl) _then)
      : super(_value, _then);

  /// Create a copy of AttendanceEntity
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? sessionId = null,
    Object? classId = null,
    Object? studentId = null,
    Object? timestamp = null,
    Object? status = null,
  }) {
    return _then(_$AttendanceEntityImpl(
      sessionId: null == sessionId
          ? _value.sessionId
          : sessionId // ignore: cast_nullable_to_non_nullable
              as String,
      classId: null == classId
          ? _value.classId
          : classId // ignore: cast_nullable_to_non_nullable
              as String,
      studentId: null == studentId
          ? _value.studentId
          : studentId // ignore: cast_nullable_to_non_nullable
              as String,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AttendanceEntityImpl implements _AttendanceEntity {
  const _$AttendanceEntityImpl(
      {required this.sessionId,
      required this.classId,
      required this.studentId,
      required this.timestamp,
      required this.status});

  factory _$AttendanceEntityImpl.fromJson(Map<String, dynamic> json) =>
      _$$AttendanceEntityImplFromJson(json);

  @override
  final String sessionId;
  @override
  final String classId;
  @override
  final String studentId;
  @override
  final DateTime timestamp;
  @override
  final String status;

  @override
  String toString() {
    return 'AttendanceEntity(sessionId: $sessionId, classId: $classId, studentId: $studentId, timestamp: $timestamp, status: $status)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AttendanceEntityImpl &&
            (identical(other.sessionId, sessionId) ||
                other.sessionId == sessionId) &&
            (identical(other.classId, classId) || other.classId == classId) &&
            (identical(other.studentId, studentId) ||
                other.studentId == studentId) &&
            (identical(other.timestamp, timestamp) ||
                other.timestamp == timestamp) &&
            (identical(other.status, status) || other.status == status));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, sessionId, classId, studentId, timestamp, status);

  /// Create a copy of AttendanceEntity
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AttendanceEntityImplCopyWith<_$AttendanceEntityImpl> get copyWith =>
      __$$AttendanceEntityImplCopyWithImpl<_$AttendanceEntityImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AttendanceEntityImplToJson(
      this,
    );
  }
}

abstract class _AttendanceEntity implements AttendanceEntity {
  const factory _AttendanceEntity(
      {required final String sessionId,
      required final String classId,
      required final String studentId,
      required final DateTime timestamp,
      required final String status}) = _$AttendanceEntityImpl;

  factory _AttendanceEntity.fromJson(Map<String, dynamic> json) =
      _$AttendanceEntityImpl.fromJson;

  @override
  String get sessionId;
  @override
  String get classId;
  @override
  String get studentId;
  @override
  DateTime get timestamp;
  @override
  String get status;

  /// Create a copy of AttendanceEntity
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AttendanceEntityImplCopyWith<_$AttendanceEntityImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
