// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'class_statistics.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

ClassStatistics _$ClassStatisticsFromJson(Map<String, dynamic> json) {
  return _ClassStatistics.fromJson(json);
}

/// @nodoc
mixin _$ClassStatistics {
  int get totalStudents => throw _privateConstructorUsedError;
  int get totalSessions => throw _privateConstructorUsedError;
  double get averageAttendance => throw _privateConstructorUsedError;
  List<AttendanceTrend> get attendanceTrend =>
      throw _privateConstructorUsedError;
  Map<String, double> get attendanceByDay => throw _privateConstructorUsedError;
  Map<String, double> get attendanceByStudent =>
      throw _privateConstructorUsedError;
  List<RecentSession> get recentSessions => throw _privateConstructorUsedError;

  /// Serializes this ClassStatistics to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ClassStatistics
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ClassStatisticsCopyWith<ClassStatistics> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ClassStatisticsCopyWith<$Res> {
  factory $ClassStatisticsCopyWith(
          ClassStatistics value, $Res Function(ClassStatistics) then) =
      _$ClassStatisticsCopyWithImpl<$Res, ClassStatistics>;
  @useResult
  $Res call(
      {int totalStudents,
      int totalSessions,
      double averageAttendance,
      List<AttendanceTrend> attendanceTrend,
      Map<String, double> attendanceByDay,
      Map<String, double> attendanceByStudent,
      List<RecentSession> recentSessions});
}

/// @nodoc
class _$ClassStatisticsCopyWithImpl<$Res, $Val extends ClassStatistics>
    implements $ClassStatisticsCopyWith<$Res> {
  _$ClassStatisticsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ClassStatistics
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalStudents = null,
    Object? totalSessions = null,
    Object? averageAttendance = null,
    Object? attendanceTrend = null,
    Object? attendanceByDay = null,
    Object? attendanceByStudent = null,
    Object? recentSessions = null,
  }) {
    return _then(_value.copyWith(
      totalStudents: null == totalStudents
          ? _value.totalStudents
          : totalStudents // ignore: cast_nullable_to_non_nullable
              as int,
      totalSessions: null == totalSessions
          ? _value.totalSessions
          : totalSessions // ignore: cast_nullable_to_non_nullable
              as int,
      averageAttendance: null == averageAttendance
          ? _value.averageAttendance
          : averageAttendance // ignore: cast_nullable_to_non_nullable
              as double,
      attendanceTrend: null == attendanceTrend
          ? _value.attendanceTrend
          : attendanceTrend // ignore: cast_nullable_to_non_nullable
              as List<AttendanceTrend>,
      attendanceByDay: null == attendanceByDay
          ? _value.attendanceByDay
          : attendanceByDay // ignore: cast_nullable_to_non_nullable
              as Map<String, double>,
      attendanceByStudent: null == attendanceByStudent
          ? _value.attendanceByStudent
          : attendanceByStudent // ignore: cast_nullable_to_non_nullable
              as Map<String, double>,
      recentSessions: null == recentSessions
          ? _value.recentSessions
          : recentSessions // ignore: cast_nullable_to_non_nullable
              as List<RecentSession>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ClassStatisticsImplCopyWith<$Res>
    implements $ClassStatisticsCopyWith<$Res> {
  factory _$$ClassStatisticsImplCopyWith(_$ClassStatisticsImpl value,
          $Res Function(_$ClassStatisticsImpl) then) =
      __$$ClassStatisticsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {int totalStudents,
      int totalSessions,
      double averageAttendance,
      List<AttendanceTrend> attendanceTrend,
      Map<String, double> attendanceByDay,
      Map<String, double> attendanceByStudent,
      List<RecentSession> recentSessions});
}

/// @nodoc
class __$$ClassStatisticsImplCopyWithImpl<$Res>
    extends _$ClassStatisticsCopyWithImpl<$Res, _$ClassStatisticsImpl>
    implements _$$ClassStatisticsImplCopyWith<$Res> {
  __$$ClassStatisticsImplCopyWithImpl(
      _$ClassStatisticsImpl _value, $Res Function(_$ClassStatisticsImpl) _then)
      : super(_value, _then);

  /// Create a copy of ClassStatistics
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalStudents = null,
    Object? totalSessions = null,
    Object? averageAttendance = null,
    Object? attendanceTrend = null,
    Object? attendanceByDay = null,
    Object? attendanceByStudent = null,
    Object? recentSessions = null,
  }) {
    return _then(_$ClassStatisticsImpl(
      totalStudents: null == totalStudents
          ? _value.totalStudents
          : totalStudents // ignore: cast_nullable_to_non_nullable
              as int,
      totalSessions: null == totalSessions
          ? _value.totalSessions
          : totalSessions // ignore: cast_nullable_to_non_nullable
              as int,
      averageAttendance: null == averageAttendance
          ? _value.averageAttendance
          : averageAttendance // ignore: cast_nullable_to_non_nullable
              as double,
      attendanceTrend: null == attendanceTrend
          ? _value._attendanceTrend
          : attendanceTrend // ignore: cast_nullable_to_non_nullable
              as List<AttendanceTrend>,
      attendanceByDay: null == attendanceByDay
          ? _value._attendanceByDay
          : attendanceByDay // ignore: cast_nullable_to_non_nullable
              as Map<String, double>,
      attendanceByStudent: null == attendanceByStudent
          ? _value._attendanceByStudent
          : attendanceByStudent // ignore: cast_nullable_to_non_nullable
              as Map<String, double>,
      recentSessions: null == recentSessions
          ? _value._recentSessions
          : recentSessions // ignore: cast_nullable_to_non_nullable
              as List<RecentSession>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ClassStatisticsImpl implements _ClassStatistics {
  const _$ClassStatisticsImpl(
      {required this.totalStudents,
      required this.totalSessions,
      required this.averageAttendance,
      required final List<AttendanceTrend> attendanceTrend,
      required final Map<String, double> attendanceByDay,
      required final Map<String, double> attendanceByStudent,
      required final List<RecentSession> recentSessions})
      : _attendanceTrend = attendanceTrend,
        _attendanceByDay = attendanceByDay,
        _attendanceByStudent = attendanceByStudent,
        _recentSessions = recentSessions;

  factory _$ClassStatisticsImpl.fromJson(Map<String, dynamic> json) =>
      _$$ClassStatisticsImplFromJson(json);

  @override
  final int totalStudents;
  @override
  final int totalSessions;
  @override
  final double averageAttendance;
  final List<AttendanceTrend> _attendanceTrend;
  @override
  List<AttendanceTrend> get attendanceTrend {
    if (_attendanceTrend is EqualUnmodifiableListView) return _attendanceTrend;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_attendanceTrend);
  }

  final Map<String, double> _attendanceByDay;
  @override
  Map<String, double> get attendanceByDay {
    if (_attendanceByDay is EqualUnmodifiableMapView) return _attendanceByDay;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_attendanceByDay);
  }

  final Map<String, double> _attendanceByStudent;
  @override
  Map<String, double> get attendanceByStudent {
    if (_attendanceByStudent is EqualUnmodifiableMapView)
      return _attendanceByStudent;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_attendanceByStudent);
  }

  final List<RecentSession> _recentSessions;
  @override
  List<RecentSession> get recentSessions {
    if (_recentSessions is EqualUnmodifiableListView) return _recentSessions;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_recentSessions);
  }

  @override
  String toString() {
    return 'ClassStatistics(totalStudents: $totalStudents, totalSessions: $totalSessions, averageAttendance: $averageAttendance, attendanceTrend: $attendanceTrend, attendanceByDay: $attendanceByDay, attendanceByStudent: $attendanceByStudent, recentSessions: $recentSessions)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ClassStatisticsImpl &&
            (identical(other.totalStudents, totalStudents) ||
                other.totalStudents == totalStudents) &&
            (identical(other.totalSessions, totalSessions) ||
                other.totalSessions == totalSessions) &&
            (identical(other.averageAttendance, averageAttendance) ||
                other.averageAttendance == averageAttendance) &&
            const DeepCollectionEquality()
                .equals(other._attendanceTrend, _attendanceTrend) &&
            const DeepCollectionEquality()
                .equals(other._attendanceByDay, _attendanceByDay) &&
            const DeepCollectionEquality()
                .equals(other._attendanceByStudent, _attendanceByStudent) &&
            const DeepCollectionEquality()
                .equals(other._recentSessions, _recentSessions));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      totalStudents,
      totalSessions,
      averageAttendance,
      const DeepCollectionEquality().hash(_attendanceTrend),
      const DeepCollectionEquality().hash(_attendanceByDay),
      const DeepCollectionEquality().hash(_attendanceByStudent),
      const DeepCollectionEquality().hash(_recentSessions));

  /// Create a copy of ClassStatistics
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ClassStatisticsImplCopyWith<_$ClassStatisticsImpl> get copyWith =>
      __$$ClassStatisticsImplCopyWithImpl<_$ClassStatisticsImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ClassStatisticsImplToJson(
      this,
    );
  }
}

abstract class _ClassStatistics implements ClassStatistics {
  const factory _ClassStatistics(
          {required final int totalStudents,
          required final int totalSessions,
          required final double averageAttendance,
          required final List<AttendanceTrend> attendanceTrend,
          required final Map<String, double> attendanceByDay,
          required final Map<String, double> attendanceByStudent,
          required final List<RecentSession> recentSessions}) =
      _$ClassStatisticsImpl;

  factory _ClassStatistics.fromJson(Map<String, dynamic> json) =
      _$ClassStatisticsImpl.fromJson;

  @override
  int get totalStudents;
  @override
  int get totalSessions;
  @override
  double get averageAttendance;
  @override
  List<AttendanceTrend> get attendanceTrend;
  @override
  Map<String, double> get attendanceByDay;
  @override
  Map<String, double> get attendanceByStudent;
  @override
  List<RecentSession> get recentSessions;

  /// Create a copy of ClassStatistics
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ClassStatisticsImplCopyWith<_$ClassStatisticsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

AttendanceTrend _$AttendanceTrendFromJson(Map<String, dynamic> json) {
  return _AttendanceTrend.fromJson(json);
}

/// @nodoc
mixin _$AttendanceTrend {
  DateTime get date => throw _privateConstructorUsedError;
  double get attendance => throw _privateConstructorUsedError;

  /// Serializes this AttendanceTrend to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AttendanceTrend
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AttendanceTrendCopyWith<AttendanceTrend> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AttendanceTrendCopyWith<$Res> {
  factory $AttendanceTrendCopyWith(
          AttendanceTrend value, $Res Function(AttendanceTrend) then) =
      _$AttendanceTrendCopyWithImpl<$Res, AttendanceTrend>;
  @useResult
  $Res call({DateTime date, double attendance});
}

/// @nodoc
class _$AttendanceTrendCopyWithImpl<$Res, $Val extends AttendanceTrend>
    implements $AttendanceTrendCopyWith<$Res> {
  _$AttendanceTrendCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AttendanceTrend
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? attendance = null,
  }) {
    return _then(_value.copyWith(
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime,
      attendance: null == attendance
          ? _value.attendance
          : attendance // ignore: cast_nullable_to_non_nullable
              as double,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$AttendanceTrendImplCopyWith<$Res>
    implements $AttendanceTrendCopyWith<$Res> {
  factory _$$AttendanceTrendImplCopyWith(_$AttendanceTrendImpl value,
          $Res Function(_$AttendanceTrendImpl) then) =
      __$$AttendanceTrendImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({DateTime date, double attendance});
}

/// @nodoc
class __$$AttendanceTrendImplCopyWithImpl<$Res>
    extends _$AttendanceTrendCopyWithImpl<$Res, _$AttendanceTrendImpl>
    implements _$$AttendanceTrendImplCopyWith<$Res> {
  __$$AttendanceTrendImplCopyWithImpl(
      _$AttendanceTrendImpl _value, $Res Function(_$AttendanceTrendImpl) _then)
      : super(_value, _then);

  /// Create a copy of AttendanceTrend
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? attendance = null,
  }) {
    return _then(_$AttendanceTrendImpl(
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime,
      attendance: null == attendance
          ? _value.attendance
          : attendance // ignore: cast_nullable_to_non_nullable
              as double,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$AttendanceTrendImpl implements _AttendanceTrend {
  const _$AttendanceTrendImpl({required this.date, required this.attendance});

  factory _$AttendanceTrendImpl.fromJson(Map<String, dynamic> json) =>
      _$$AttendanceTrendImplFromJson(json);

  @override
  final DateTime date;
  @override
  final double attendance;

  @override
  String toString() {
    return 'AttendanceTrend(date: $date, attendance: $attendance)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AttendanceTrendImpl &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.attendance, attendance) ||
                other.attendance == attendance));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, date, attendance);

  /// Create a copy of AttendanceTrend
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AttendanceTrendImplCopyWith<_$AttendanceTrendImpl> get copyWith =>
      __$$AttendanceTrendImplCopyWithImpl<_$AttendanceTrendImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AttendanceTrendImplToJson(
      this,
    );
  }
}

abstract class _AttendanceTrend implements AttendanceTrend {
  const factory _AttendanceTrend(
      {required final DateTime date,
      required final double attendance}) = _$AttendanceTrendImpl;

  factory _AttendanceTrend.fromJson(Map<String, dynamic> json) =
      _$AttendanceTrendImpl.fromJson;

  @override
  DateTime get date;
  @override
  double get attendance;

  /// Create a copy of AttendanceTrend
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AttendanceTrendImplCopyWith<_$AttendanceTrendImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

RecentSession _$RecentSessionFromJson(Map<String, dynamic> json) {
  return _RecentSession.fromJson(json);
}

/// @nodoc
mixin _$RecentSession {
  String get id => throw _privateConstructorUsedError;
  DateTime get date => throw _privateConstructorUsedError;
  double get attendanceRate => throw _privateConstructorUsedError;
  int get presentCount => throw _privateConstructorUsedError;
  int get totalCount => throw _privateConstructorUsedError;

  /// Serializes this RecentSession to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of RecentSession
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RecentSessionCopyWith<RecentSession> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RecentSessionCopyWith<$Res> {
  factory $RecentSessionCopyWith(
          RecentSession value, $Res Function(RecentSession) then) =
      _$RecentSessionCopyWithImpl<$Res, RecentSession>;
  @useResult
  $Res call(
      {String id,
      DateTime date,
      double attendanceRate,
      int presentCount,
      int totalCount});
}

/// @nodoc
class _$RecentSessionCopyWithImpl<$Res, $Val extends RecentSession>
    implements $RecentSessionCopyWith<$Res> {
  _$RecentSessionCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of RecentSession
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? attendanceRate = null,
    Object? presentCount = null,
    Object? totalCount = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime,
      attendanceRate: null == attendanceRate
          ? _value.attendanceRate
          : attendanceRate // ignore: cast_nullable_to_non_nullable
              as double,
      presentCount: null == presentCount
          ? _value.presentCount
          : presentCount // ignore: cast_nullable_to_non_nullable
              as int,
      totalCount: null == totalCount
          ? _value.totalCount
          : totalCount // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RecentSessionImplCopyWith<$Res>
    implements $RecentSessionCopyWith<$Res> {
  factory _$$RecentSessionImplCopyWith(
          _$RecentSessionImpl value, $Res Function(_$RecentSessionImpl) then) =
      __$$RecentSessionImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      DateTime date,
      double attendanceRate,
      int presentCount,
      int totalCount});
}

/// @nodoc
class __$$RecentSessionImplCopyWithImpl<$Res>
    extends _$RecentSessionCopyWithImpl<$Res, _$RecentSessionImpl>
    implements _$$RecentSessionImplCopyWith<$Res> {
  __$$RecentSessionImplCopyWithImpl(
      _$RecentSessionImpl _value, $Res Function(_$RecentSessionImpl) _then)
      : super(_value, _then);

  /// Create a copy of RecentSession
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? attendanceRate = null,
    Object? presentCount = null,
    Object? totalCount = null,
  }) {
    return _then(_$RecentSessionImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      date: null == date
          ? _value.date
          : date // ignore: cast_nullable_to_non_nullable
              as DateTime,
      attendanceRate: null == attendanceRate
          ? _value.attendanceRate
          : attendanceRate // ignore: cast_nullable_to_non_nullable
              as double,
      presentCount: null == presentCount
          ? _value.presentCount
          : presentCount // ignore: cast_nullable_to_non_nullable
              as int,
      totalCount: null == totalCount
          ? _value.totalCount
          : totalCount // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RecentSessionImpl implements _RecentSession {
  const _$RecentSessionImpl(
      {required this.id,
      required this.date,
      required this.attendanceRate,
      required this.presentCount,
      required this.totalCount});

  factory _$RecentSessionImpl.fromJson(Map<String, dynamic> json) =>
      _$$RecentSessionImplFromJson(json);

  @override
  final String id;
  @override
  final DateTime date;
  @override
  final double attendanceRate;
  @override
  final int presentCount;
  @override
  final int totalCount;

  @override
  String toString() {
    return 'RecentSession(id: $id, date: $date, attendanceRate: $attendanceRate, presentCount: $presentCount, totalCount: $totalCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RecentSessionImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.attendanceRate, attendanceRate) ||
                other.attendanceRate == attendanceRate) &&
            (identical(other.presentCount, presentCount) ||
                other.presentCount == presentCount) &&
            (identical(other.totalCount, totalCount) ||
                other.totalCount == totalCount));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, id, date, attendanceRate, presentCount, totalCount);

  /// Create a copy of RecentSession
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RecentSessionImplCopyWith<_$RecentSessionImpl> get copyWith =>
      __$$RecentSessionImplCopyWithImpl<_$RecentSessionImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RecentSessionImplToJson(
      this,
    );
  }
}

abstract class _RecentSession implements RecentSession {
  const factory _RecentSession(
      {required final String id,
      required final DateTime date,
      required final double attendanceRate,
      required final int presentCount,
      required final int totalCount}) = _$RecentSessionImpl;

  factory _RecentSession.fromJson(Map<String, dynamic> json) =
      _$RecentSessionImpl.fromJson;

  @override
  String get id;
  @override
  DateTime get date;
  @override
  double get attendanceRate;
  @override
  int get presentCount;
  @override
  int get totalCount;

  /// Create a copy of RecentSession
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RecentSessionImplCopyWith<_$RecentSessionImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
