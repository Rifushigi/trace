// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'class_entity.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ClassEntity _$ClassEntityFromJson(Map<String, dynamic> json) {
  return _ClassEntity.fromJson(json);
}

/// @nodoc
mixin _$ClassEntity {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get code => throw _privateConstructorUsedError;
  String get lecturerId => throw _privateConstructorUsedError;
  Map<String, dynamic> get schedule => throw _privateConstructorUsedError;
  List<String> get students => throw _privateConstructorUsedError;

  /// Serializes this ClassEntity to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ClassEntity
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ClassEntityCopyWith<ClassEntity> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ClassEntityCopyWith<$Res> {
  factory $ClassEntityCopyWith(
          ClassEntity value, $Res Function(ClassEntity) then) =
      _$ClassEntityCopyWithImpl<$Res, ClassEntity>;
  @useResult
  $Res call(
      {String id,
      String name,
      String code,
      String lecturerId,
      Map<String, dynamic> schedule,
      List<String> students});
}

/// @nodoc
class _$ClassEntityCopyWithImpl<$Res, $Val extends ClassEntity>
    implements $ClassEntityCopyWith<$Res> {
  _$ClassEntityCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ClassEntity
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? code = null,
    Object? lecturerId = null,
    Object? schedule = null,
    Object? students = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      code: null == code
          ? _value.code
          : code // ignore: cast_nullable_to_non_nullable
              as String,
      lecturerId: null == lecturerId
          ? _value.lecturerId
          : lecturerId // ignore: cast_nullable_to_non_nullable
              as String,
      schedule: null == schedule
          ? _value.schedule
          : schedule // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>,
      students: null == students
          ? _value.students
          : students // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ClassEntityImplCopyWith<$Res>
    implements $ClassEntityCopyWith<$Res> {
  factory _$$ClassEntityImplCopyWith(
          _$ClassEntityImpl value, $Res Function(_$ClassEntityImpl) then) =
      __$$ClassEntityImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String code,
      String lecturerId,
      Map<String, dynamic> schedule,
      List<String> students});
}

/// @nodoc
class __$$ClassEntityImplCopyWithImpl<$Res>
    extends _$ClassEntityCopyWithImpl<$Res, _$ClassEntityImpl>
    implements _$$ClassEntityImplCopyWith<$Res> {
  __$$ClassEntityImplCopyWithImpl(
      _$ClassEntityImpl _value, $Res Function(_$ClassEntityImpl) _then)
      : super(_value, _then);

  /// Create a copy of ClassEntity
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? code = null,
    Object? lecturerId = null,
    Object? schedule = null,
    Object? students = null,
  }) {
    return _then(_$ClassEntityImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      code: null == code
          ? _value.code
          : code // ignore: cast_nullable_to_non_nullable
              as String,
      lecturerId: null == lecturerId
          ? _value.lecturerId
          : lecturerId // ignore: cast_nullable_to_non_nullable
              as String,
      schedule: null == schedule
          ? _value._schedule
          : schedule // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>,
      students: null == students
          ? _value._students
          : students // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ClassEntityImpl extends _ClassEntity {
  const _$ClassEntityImpl(
      {required this.id,
      required this.name,
      required this.code,
      required this.lecturerId,
      required final Map<String, dynamic> schedule,
      final List<String> students = const []})
      : _schedule = schedule,
        _students = students,
        super._();

  factory _$ClassEntityImpl.fromJson(Map<String, dynamic> json) =>
      _$$ClassEntityImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String code;
  @override
  final String lecturerId;
  final Map<String, dynamic> _schedule;
  @override
  Map<String, dynamic> get schedule {
    if (_schedule is EqualUnmodifiableMapView) return _schedule;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_schedule);
  }

  final List<String> _students;
  @override
  @JsonKey()
  List<String> get students {
    if (_students is EqualUnmodifiableListView) return _students;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_students);
  }

  @override
  String toString() {
    return 'ClassEntity(id: $id, name: $name, code: $code, lecturerId: $lecturerId, schedule: $schedule, students: $students)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ClassEntityImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.code, code) || other.code == code) &&
            (identical(other.lecturerId, lecturerId) ||
                other.lecturerId == lecturerId) &&
            const DeepCollectionEquality().equals(other._schedule, _schedule) &&
            const DeepCollectionEquality().equals(other._students, _students));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      name,
      code,
      lecturerId,
      const DeepCollectionEquality().hash(_schedule),
      const DeepCollectionEquality().hash(_students));

  /// Create a copy of ClassEntity
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ClassEntityImplCopyWith<_$ClassEntityImpl> get copyWith =>
      __$$ClassEntityImplCopyWithImpl<_$ClassEntityImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ClassEntityImplToJson(
      this,
    );
  }
}

abstract class _ClassEntity extends ClassEntity {
  const factory _ClassEntity(
      {required final String id,
      required final String name,
      required final String code,
      required final String lecturerId,
      required final Map<String, dynamic> schedule,
      final List<String> students}) = _$ClassEntityImpl;
  const _ClassEntity._() : super._();

  factory _ClassEntity.fromJson(Map<String, dynamic> json) =
      _$ClassEntityImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get code;
  @override
  String get lecturerId;
  @override
  Map<String, dynamic> get schedule;
  @override
  List<String> get students;

  /// Create a copy of ClassEntity
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ClassEntityImplCopyWith<_$ClassEntityImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
