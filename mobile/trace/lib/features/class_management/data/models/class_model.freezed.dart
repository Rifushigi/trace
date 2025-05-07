// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'class_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ClassSchedule _$ClassScheduleFromJson(Map<String, dynamic> json) {
  return _ClassSchedule.fromJson(json);
}

/// @nodoc
mixin _$ClassSchedule {
  String get day => throw _privateConstructorUsedError;
  String get startTime => throw _privateConstructorUsedError;
  String get endTime => throw _privateConstructorUsedError;
  bool get isRecurring => throw _privateConstructorUsedError;
  List<String> get recurringDays => throw _privateConstructorUsedError;
  String? get endDate => throw _privateConstructorUsedError;

  /// Serializes this ClassSchedule to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ClassSchedule
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ClassScheduleCopyWith<ClassSchedule> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ClassScheduleCopyWith<$Res> {
  factory $ClassScheduleCopyWith(
          ClassSchedule value, $Res Function(ClassSchedule) then) =
      _$ClassScheduleCopyWithImpl<$Res, ClassSchedule>;
  @useResult
  $Res call(
      {String day,
      String startTime,
      String endTime,
      bool isRecurring,
      List<String> recurringDays,
      String? endDate});
}

/// @nodoc
class _$ClassScheduleCopyWithImpl<$Res, $Val extends ClassSchedule>
    implements $ClassScheduleCopyWith<$Res> {
  _$ClassScheduleCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ClassSchedule
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? day = null,
    Object? startTime = null,
    Object? endTime = null,
    Object? isRecurring = null,
    Object? recurringDays = null,
    Object? endDate = freezed,
  }) {
    return _then(_value.copyWith(
      day: null == day
          ? _value.day
          : day // ignore: cast_nullable_to_non_nullable
              as String,
      startTime: null == startTime
          ? _value.startTime
          : startTime // ignore: cast_nullable_to_non_nullable
              as String,
      endTime: null == endTime
          ? _value.endTime
          : endTime // ignore: cast_nullable_to_non_nullable
              as String,
      isRecurring: null == isRecurring
          ? _value.isRecurring
          : isRecurring // ignore: cast_nullable_to_non_nullable
              as bool,
      recurringDays: null == recurringDays
          ? _value.recurringDays
          : recurringDays // ignore: cast_nullable_to_non_nullable
              as List<String>,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ClassScheduleImplCopyWith<$Res>
    implements $ClassScheduleCopyWith<$Res> {
  factory _$$ClassScheduleImplCopyWith(
          _$ClassScheduleImpl value, $Res Function(_$ClassScheduleImpl) then) =
      __$$ClassScheduleImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String day,
      String startTime,
      String endTime,
      bool isRecurring,
      List<String> recurringDays,
      String? endDate});
}

/// @nodoc
class __$$ClassScheduleImplCopyWithImpl<$Res>
    extends _$ClassScheduleCopyWithImpl<$Res, _$ClassScheduleImpl>
    implements _$$ClassScheduleImplCopyWith<$Res> {
  __$$ClassScheduleImplCopyWithImpl(
      _$ClassScheduleImpl _value, $Res Function(_$ClassScheduleImpl) _then)
      : super(_value, _then);

  /// Create a copy of ClassSchedule
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? day = null,
    Object? startTime = null,
    Object? endTime = null,
    Object? isRecurring = null,
    Object? recurringDays = null,
    Object? endDate = freezed,
  }) {
    return _then(_$ClassScheduleImpl(
      day: null == day
          ? _value.day
          : day // ignore: cast_nullable_to_non_nullable
              as String,
      startTime: null == startTime
          ? _value.startTime
          : startTime // ignore: cast_nullable_to_non_nullable
              as String,
      endTime: null == endTime
          ? _value.endTime
          : endTime // ignore: cast_nullable_to_non_nullable
              as String,
      isRecurring: null == isRecurring
          ? _value.isRecurring
          : isRecurring // ignore: cast_nullable_to_non_nullable
              as bool,
      recurringDays: null == recurringDays
          ? _value._recurringDays
          : recurringDays // ignore: cast_nullable_to_non_nullable
              as List<String>,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ClassScheduleImpl extends _ClassSchedule {
  const _$ClassScheduleImpl(
      {required this.day,
      required this.startTime,
      required this.endTime,
      this.isRecurring = false,
      final List<String> recurringDays = const [],
      this.endDate})
      : _recurringDays = recurringDays,
        super._();

  factory _$ClassScheduleImpl.fromJson(Map<String, dynamic> json) =>
      _$$ClassScheduleImplFromJson(json);

  @override
  final String day;
  @override
  final String startTime;
  @override
  final String endTime;
  @override
  @JsonKey()
  final bool isRecurring;
  final List<String> _recurringDays;
  @override
  @JsonKey()
  List<String> get recurringDays {
    if (_recurringDays is EqualUnmodifiableListView) return _recurringDays;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_recurringDays);
  }

  @override
  final String? endDate;

  @override
  String toString() {
    return 'ClassSchedule(day: $day, startTime: $startTime, endTime: $endTime, isRecurring: $isRecurring, recurringDays: $recurringDays, endDate: $endDate)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ClassScheduleImpl &&
            (identical(other.day, day) || other.day == day) &&
            (identical(other.startTime, startTime) ||
                other.startTime == startTime) &&
            (identical(other.endTime, endTime) || other.endTime == endTime) &&
            (identical(other.isRecurring, isRecurring) ||
                other.isRecurring == isRecurring) &&
            const DeepCollectionEquality()
                .equals(other._recurringDays, _recurringDays) &&
            (identical(other.endDate, endDate) || other.endDate == endDate));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      day,
      startTime,
      endTime,
      isRecurring,
      const DeepCollectionEquality().hash(_recurringDays),
      endDate);

  /// Create a copy of ClassSchedule
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ClassScheduleImplCopyWith<_$ClassScheduleImpl> get copyWith =>
      __$$ClassScheduleImplCopyWithImpl<_$ClassScheduleImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ClassScheduleImplToJson(
      this,
    );
  }
}

abstract class _ClassSchedule extends ClassSchedule {
  const factory _ClassSchedule(
      {required final String day,
      required final String startTime,
      required final String endTime,
      final bool isRecurring,
      final List<String> recurringDays,
      final String? endDate}) = _$ClassScheduleImpl;
  const _ClassSchedule._() : super._();

  factory _ClassSchedule.fromJson(Map<String, dynamic> json) =
      _$ClassScheduleImpl.fromJson;

  @override
  String get day;
  @override
  String get startTime;
  @override
  String get endTime;
  @override
  bool get isRecurring;
  @override
  List<String> get recurringDays;
  @override
  String? get endDate;

  /// Create a copy of ClassSchedule
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ClassScheduleImplCopyWith<_$ClassScheduleImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ClassModel _$ClassModelFromJson(Map<String, dynamic> json) {
  return _ClassModel.fromJson(json);
}

/// @nodoc
mixin _$ClassModel {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get code => throw _privateConstructorUsedError;
  String get lecturerId => throw _privateConstructorUsedError;
  Map<String, dynamic> get schedule => throw _privateConstructorUsedError;
  List<String> get students => throw _privateConstructorUsedError;

  /// Serializes this ClassModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ClassModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ClassModelCopyWith<ClassModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ClassModelCopyWith<$Res> {
  factory $ClassModelCopyWith(
          ClassModel value, $Res Function(ClassModel) then) =
      _$ClassModelCopyWithImpl<$Res, ClassModel>;
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
class _$ClassModelCopyWithImpl<$Res, $Val extends ClassModel>
    implements $ClassModelCopyWith<$Res> {
  _$ClassModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ClassModel
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
abstract class _$$ClassModelImplCopyWith<$Res>
    implements $ClassModelCopyWith<$Res> {
  factory _$$ClassModelImplCopyWith(
          _$ClassModelImpl value, $Res Function(_$ClassModelImpl) then) =
      __$$ClassModelImplCopyWithImpl<$Res>;
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
class __$$ClassModelImplCopyWithImpl<$Res>
    extends _$ClassModelCopyWithImpl<$Res, _$ClassModelImpl>
    implements _$$ClassModelImplCopyWith<$Res> {
  __$$ClassModelImplCopyWithImpl(
      _$ClassModelImpl _value, $Res Function(_$ClassModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ClassModel
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
    return _then(_$ClassModelImpl(
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
class _$ClassModelImpl extends _ClassModel {
  const _$ClassModelImpl(
      {required this.id,
      required this.name,
      required this.code,
      required this.lecturerId,
      required final Map<String, dynamic> schedule,
      final List<String> students = const []})
      : _schedule = schedule,
        _students = students,
        super._();

  factory _$ClassModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ClassModelImplFromJson(json);

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
    return 'ClassModel(id: $id, name: $name, code: $code, lecturerId: $lecturerId, schedule: $schedule, students: $students)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ClassModelImpl &&
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

  /// Create a copy of ClassModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ClassModelImplCopyWith<_$ClassModelImpl> get copyWith =>
      __$$ClassModelImplCopyWithImpl<_$ClassModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ClassModelImplToJson(
      this,
    );
  }
}

abstract class _ClassModel extends ClassModel {
  const factory _ClassModel(
      {required final String id,
      required final String name,
      required final String code,
      required final String lecturerId,
      required final Map<String, dynamic> schedule,
      final List<String> students}) = _$ClassModelImpl;
  const _ClassModel._() : super._();

  factory _ClassModel.fromJson(Map<String, dynamic> json) =
      _$ClassModelImpl.fromJson;

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

  /// Create a copy of ClassModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ClassModelImplCopyWith<_$ClassModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
