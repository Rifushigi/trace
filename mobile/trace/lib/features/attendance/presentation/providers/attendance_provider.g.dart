// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attendance_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$attendanceActionsHash() => r'd3fbed5f126e5e4cbfd821696bd6af12514b26ce';

/// See also [AttendanceActions].
@ProviderFor(AttendanceActions)
final attendanceActionsProvider =
    AutoDisposeAsyncNotifierProvider<AttendanceActions, void>.internal(
  AttendanceActions.new,
  name: r'attendanceActionsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$attendanceActionsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$AttendanceActions = AutoDisposeAsyncNotifier<void>;
String _$attendanceSyncHash() => r'd100a490bd814432af17a991a7ca25707a436d69';

/// See also [AttendanceSync].
@ProviderFor(AttendanceSync)
final attendanceSyncProvider =
    AutoDisposeAsyncNotifierProvider<AttendanceSync, void>.internal(
  AttendanceSync.new,
  name: r'attendanceSyncProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$attendanceSyncHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$AttendanceSync = AutoDisposeAsyncNotifier<void>;
String _$attendanceHistoryHash() => r'f8b2ce0b8555f064c9b4b98380b88d4f21752ba0';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

abstract class _$AttendanceHistory
    extends BuildlessAutoDisposeAsyncNotifier<List<AttendanceEntity>> {
  late final String classId;

  FutureOr<List<AttendanceEntity>> build(
    String classId,
  );
}

/// See also [AttendanceHistory].
@ProviderFor(AttendanceHistory)
const attendanceHistoryProvider = AttendanceHistoryFamily();

/// See also [AttendanceHistory].
class AttendanceHistoryFamily
    extends Family<AsyncValue<List<AttendanceEntity>>> {
  /// See also [AttendanceHistory].
  const AttendanceHistoryFamily();

  /// See also [AttendanceHistory].
  AttendanceHistoryProvider call(
    String classId,
  ) {
    return AttendanceHistoryProvider(
      classId,
    );
  }

  @override
  AttendanceHistoryProvider getProviderOverride(
    covariant AttendanceHistoryProvider provider,
  ) {
    return call(
      provider.classId,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'attendanceHistoryProvider';
}

/// See also [AttendanceHistory].
class AttendanceHistoryProvider extends AutoDisposeAsyncNotifierProviderImpl<
    AttendanceHistory, List<AttendanceEntity>> {
  /// See also [AttendanceHistory].
  AttendanceHistoryProvider(
    String classId,
  ) : this._internal(
          () => AttendanceHistory()..classId = classId,
          from: attendanceHistoryProvider,
          name: r'attendanceHistoryProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$attendanceHistoryHash,
          dependencies: AttendanceHistoryFamily._dependencies,
          allTransitiveDependencies:
              AttendanceHistoryFamily._allTransitiveDependencies,
          classId: classId,
        );

  AttendanceHistoryProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.classId,
  }) : super.internal();

  final String classId;

  @override
  FutureOr<List<AttendanceEntity>> runNotifierBuild(
    covariant AttendanceHistory notifier,
  ) {
    return notifier.build(
      classId,
    );
  }

  @override
  Override overrideWith(AttendanceHistory Function() create) {
    return ProviderOverride(
      origin: this,
      override: AttendanceHistoryProvider._internal(
        () => create()..classId = classId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        classId: classId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<AttendanceHistory,
      List<AttendanceEntity>> createElement() {
    return _AttendanceHistoryProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is AttendanceHistoryProvider && other.classId == classId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, classId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin AttendanceHistoryRef
    on AutoDisposeAsyncNotifierProviderRef<List<AttendanceEntity>> {
  /// The parameter `classId` of this provider.
  String get classId;
}

class _AttendanceHistoryProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<AttendanceHistory,
        List<AttendanceEntity>> with AttendanceHistoryRef {
  _AttendanceHistoryProviderElement(super.provider);

  @override
  String get classId => (origin as AttendanceHistoryProvider).classId;
}

String _$classInfoHash() => r'46abf2f478250e85d0ee747ec3a55f0a92e869af';

abstract class _$ClassInfo
    extends BuildlessAutoDisposeAsyncNotifier<ClassInfoEntity> {
  late final String classId;

  FutureOr<ClassInfoEntity> build(
    String classId,
  );
}

/// See also [ClassInfo].
@ProviderFor(ClassInfo)
const classInfoProvider = ClassInfoFamily();

/// See also [ClassInfo].
class ClassInfoFamily extends Family<AsyncValue<ClassInfoEntity>> {
  /// See also [ClassInfo].
  const ClassInfoFamily();

  /// See also [ClassInfo].
  ClassInfoProvider call(
    String classId,
  ) {
    return ClassInfoProvider(
      classId,
    );
  }

  @override
  ClassInfoProvider getProviderOverride(
    covariant ClassInfoProvider provider,
  ) {
    return call(
      provider.classId,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'classInfoProvider';
}

/// See also [ClassInfo].
class ClassInfoProvider
    extends AutoDisposeAsyncNotifierProviderImpl<ClassInfo, ClassInfoEntity> {
  /// See also [ClassInfo].
  ClassInfoProvider(
    String classId,
  ) : this._internal(
          () => ClassInfo()..classId = classId,
          from: classInfoProvider,
          name: r'classInfoProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$classInfoHash,
          dependencies: ClassInfoFamily._dependencies,
          allTransitiveDependencies: ClassInfoFamily._allTransitiveDependencies,
          classId: classId,
        );

  ClassInfoProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.classId,
  }) : super.internal();

  final String classId;

  @override
  FutureOr<ClassInfoEntity> runNotifierBuild(
    covariant ClassInfo notifier,
  ) {
    return notifier.build(
      classId,
    );
  }

  @override
  Override overrideWith(ClassInfo Function() create) {
    return ProviderOverride(
      origin: this,
      override: ClassInfoProvider._internal(
        () => create()..classId = classId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        classId: classId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<ClassInfo, ClassInfoEntity>
      createElement() {
    return _ClassInfoProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ClassInfoProvider && other.classId == classId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, classId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ClassInfoRef on AutoDisposeAsyncNotifierProviderRef<ClassInfoEntity> {
  /// The parameter `classId` of this provider.
  String get classId;
}

class _ClassInfoProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<ClassInfo, ClassInfoEntity>
    with ClassInfoRef {
  _ClassInfoProviderElement(super.provider);

  @override
  String get classId => (origin as ClassInfoProvider).classId;
}

String _$activeSessionsHash() => r'3d50fa7bad66406c3e38369b3d9ff92f1f6c3729';

/// See also [ActiveSessions].
@ProviderFor(ActiveSessions)
final activeSessionsProvider = AutoDisposeAsyncNotifierProvider<ActiveSessions,
    List<AttendanceSessionEntity>>.internal(
  ActiveSessions.new,
  name: r'activeSessionsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$activeSessionsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ActiveSessions
    = AutoDisposeAsyncNotifier<List<AttendanceSessionEntity>>;
String _$studentAttendanceStatusHash() =>
    r'b47957d09c56d7e9205469cc922851aae444f9e9';

abstract class _$StudentAttendanceStatus
    extends BuildlessAutoDisposeAsyncNotifier<StudentAttendanceStatusEntity> {
  late final String classId;
  late final String studentId;

  FutureOr<StudentAttendanceStatusEntity> build(
    String classId,
    String studentId,
  );
}

/// See also [StudentAttendanceStatus].
@ProviderFor(StudentAttendanceStatus)
const studentAttendanceStatusProvider = StudentAttendanceStatusFamily();

/// See also [StudentAttendanceStatus].
class StudentAttendanceStatusFamily
    extends Family<AsyncValue<StudentAttendanceStatusEntity>> {
  /// See also [StudentAttendanceStatus].
  const StudentAttendanceStatusFamily();

  /// See also [StudentAttendanceStatus].
  StudentAttendanceStatusProvider call(
    String classId,
    String studentId,
  ) {
    return StudentAttendanceStatusProvider(
      classId,
      studentId,
    );
  }

  @override
  StudentAttendanceStatusProvider getProviderOverride(
    covariant StudentAttendanceStatusProvider provider,
  ) {
    return call(
      provider.classId,
      provider.studentId,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'studentAttendanceStatusProvider';
}

/// See also [StudentAttendanceStatus].
class StudentAttendanceStatusProvider
    extends AutoDisposeAsyncNotifierProviderImpl<StudentAttendanceStatus,
        StudentAttendanceStatusEntity> {
  /// See also [StudentAttendanceStatus].
  StudentAttendanceStatusProvider(
    String classId,
    String studentId,
  ) : this._internal(
          () => StudentAttendanceStatus()
            ..classId = classId
            ..studentId = studentId,
          from: studentAttendanceStatusProvider,
          name: r'studentAttendanceStatusProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$studentAttendanceStatusHash,
          dependencies: StudentAttendanceStatusFamily._dependencies,
          allTransitiveDependencies:
              StudentAttendanceStatusFamily._allTransitiveDependencies,
          classId: classId,
          studentId: studentId,
        );

  StudentAttendanceStatusProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.classId,
    required this.studentId,
  }) : super.internal();

  final String classId;
  final String studentId;

  @override
  FutureOr<StudentAttendanceStatusEntity> runNotifierBuild(
    covariant StudentAttendanceStatus notifier,
  ) {
    return notifier.build(
      classId,
      studentId,
    );
  }

  @override
  Override overrideWith(StudentAttendanceStatus Function() create) {
    return ProviderOverride(
      origin: this,
      override: StudentAttendanceStatusProvider._internal(
        () => create()
          ..classId = classId
          ..studentId = studentId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        classId: classId,
        studentId: studentId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<StudentAttendanceStatus,
      StudentAttendanceStatusEntity> createElement() {
    return _StudentAttendanceStatusProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is StudentAttendanceStatusProvider &&
        other.classId == classId &&
        other.studentId == studentId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, classId.hashCode);
    hash = _SystemHash.combine(hash, studentId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin StudentAttendanceStatusRef
    on AutoDisposeAsyncNotifierProviderRef<StudentAttendanceStatusEntity> {
  /// The parameter `classId` of this provider.
  String get classId;

  /// The parameter `studentId` of this provider.
  String get studentId;
}

class _StudentAttendanceStatusProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<StudentAttendanceStatus,
        StudentAttendanceStatusEntity> with StudentAttendanceStatusRef {
  _StudentAttendanceStatusProviderElement(super.provider);

  @override
  String get classId => (origin as StudentAttendanceStatusProvider).classId;
  @override
  String get studentId => (origin as StudentAttendanceStatusProvider).studentId;
}

String _$classScheduleHash() => r'024550c5f86b286a62d38e2a6d30b5be894a5320';

abstract class _$ClassSchedule
    extends BuildlessAutoDisposeAsyncNotifier<List<Map<String, dynamic>>> {
  late final String classId;

  FutureOr<List<Map<String, dynamic>>> build(
    String classId,
  );
}

/// See also [ClassSchedule].
@ProviderFor(ClassSchedule)
const classScheduleProvider = ClassScheduleFamily();

/// See also [ClassSchedule].
class ClassScheduleFamily
    extends Family<AsyncValue<List<Map<String, dynamic>>>> {
  /// See also [ClassSchedule].
  const ClassScheduleFamily();

  /// See also [ClassSchedule].
  ClassScheduleProvider call(
    String classId,
  ) {
    return ClassScheduleProvider(
      classId,
    );
  }

  @override
  ClassScheduleProvider getProviderOverride(
    covariant ClassScheduleProvider provider,
  ) {
    return call(
      provider.classId,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'classScheduleProvider';
}

/// See also [ClassSchedule].
class ClassScheduleProvider extends AutoDisposeAsyncNotifierProviderImpl<
    ClassSchedule, List<Map<String, dynamic>>> {
  /// See also [ClassSchedule].
  ClassScheduleProvider(
    String classId,
  ) : this._internal(
          () => ClassSchedule()..classId = classId,
          from: classScheduleProvider,
          name: r'classScheduleProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$classScheduleHash,
          dependencies: ClassScheduleFamily._dependencies,
          allTransitiveDependencies:
              ClassScheduleFamily._allTransitiveDependencies,
          classId: classId,
        );

  ClassScheduleProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.classId,
  }) : super.internal();

  final String classId;

  @override
  FutureOr<List<Map<String, dynamic>>> runNotifierBuild(
    covariant ClassSchedule notifier,
  ) {
    return notifier.build(
      classId,
    );
  }

  @override
  Override overrideWith(ClassSchedule Function() create) {
    return ProviderOverride(
      origin: this,
      override: ClassScheduleProvider._internal(
        () => create()..classId = classId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        classId: classId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<ClassSchedule,
      List<Map<String, dynamic>>> createElement() {
    return _ClassScheduleProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ClassScheduleProvider && other.classId == classId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, classId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ClassScheduleRef
    on AutoDisposeAsyncNotifierProviderRef<List<Map<String, dynamic>>> {
  /// The parameter `classId` of this provider.
  String get classId;
}

class _ClassScheduleProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<ClassSchedule,
        List<Map<String, dynamic>>> with ClassScheduleRef {
  _ClassScheduleProviderElement(super.provider);

  @override
  String get classId => (origin as ClassScheduleProvider).classId;
}

String _$activeSessionHash() => r'1fe879b3a1307e6f8c3c4b0ef677f8d32c6318f7';

abstract class _$ActiveSession
    extends BuildlessAutoDisposeAsyncNotifier<AttendanceSessionEntity?> {
  late final String classId;

  FutureOr<AttendanceSessionEntity?> build(
    String classId,
  );
}

/// See also [ActiveSession].
@ProviderFor(ActiveSession)
const activeSessionProvider = ActiveSessionFamily();

/// See also [ActiveSession].
class ActiveSessionFamily extends Family<AsyncValue<AttendanceSessionEntity?>> {
  /// See also [ActiveSession].
  const ActiveSessionFamily();

  /// See also [ActiveSession].
  ActiveSessionProvider call(
    String classId,
  ) {
    return ActiveSessionProvider(
      classId,
    );
  }

  @override
  ActiveSessionProvider getProviderOverride(
    covariant ActiveSessionProvider provider,
  ) {
    return call(
      provider.classId,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'activeSessionProvider';
}

/// See also [ActiveSession].
class ActiveSessionProvider extends AutoDisposeAsyncNotifierProviderImpl<
    ActiveSession, AttendanceSessionEntity?> {
  /// See also [ActiveSession].
  ActiveSessionProvider(
    String classId,
  ) : this._internal(
          () => ActiveSession()..classId = classId,
          from: activeSessionProvider,
          name: r'activeSessionProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$activeSessionHash,
          dependencies: ActiveSessionFamily._dependencies,
          allTransitiveDependencies:
              ActiveSessionFamily._allTransitiveDependencies,
          classId: classId,
        );

  ActiveSessionProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.classId,
  }) : super.internal();

  final String classId;

  @override
  FutureOr<AttendanceSessionEntity?> runNotifierBuild(
    covariant ActiveSession notifier,
  ) {
    return notifier.build(
      classId,
    );
  }

  @override
  Override overrideWith(ActiveSession Function() create) {
    return ProviderOverride(
      origin: this,
      override: ActiveSessionProvider._internal(
        () => create()..classId = classId,
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        classId: classId,
      ),
    );
  }

  @override
  AutoDisposeAsyncNotifierProviderElement<ActiveSession,
      AttendanceSessionEntity?> createElement() {
    return _ActiveSessionProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ActiveSessionProvider && other.classId == classId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, classId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ActiveSessionRef
    on AutoDisposeAsyncNotifierProviderRef<AttendanceSessionEntity?> {
  /// The parameter `classId` of this provider.
  String get classId;
}

class _ActiveSessionProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<ActiveSession,
        AttendanceSessionEntity?> with ActiveSessionRef {
  _ActiveSessionProviderElement(super.provider);

  @override
  String get classId => (origin as ActiveSessionProvider).classId;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
