// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attendance_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$attendanceActionsHash() => r'ded1b4aab45dba8fcc3a7a758bf758091d642555';

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
String _$attendanceSyncHash() => r'5a69becf79068392ed1ac44a2b2a97a5ef41d513';

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
String _$attendanceHistoryHash() => r'fa98bdf909ec68ad22543237c5f4c207a1719bdc';

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
    extends BuildlessAutoDisposeAsyncNotifier<List<dynamic>> {
  late final String classId;

  FutureOr<List<dynamic>> build(
    String classId,
  );
}

/// See also [AttendanceHistory].
@ProviderFor(AttendanceHistory)
const attendanceHistoryProvider = AttendanceHistoryFamily();

/// See also [AttendanceHistory].
class AttendanceHistoryFamily extends Family<AsyncValue<List<dynamic>>> {
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
    AttendanceHistory, List<dynamic>> {
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
  FutureOr<List<dynamic>> runNotifierBuild(
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
  AutoDisposeAsyncNotifierProviderElement<AttendanceHistory, List<dynamic>>
      createElement() {
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
    on AutoDisposeAsyncNotifierProviderRef<List<dynamic>> {
  /// The parameter `classId` of this provider.
  String get classId;
}

class _AttendanceHistoryProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<AttendanceHistory,
        List<dynamic>> with AttendanceHistoryRef {
  _AttendanceHistoryProviderElement(super.provider);

  @override
  String get classId => (origin as AttendanceHistoryProvider).classId;
}

String _$classInfoHash() => r'c5fc88f3a53ad9855a5cac1e5a97287cf8d6d042';

abstract class _$ClassInfo
    extends BuildlessAutoDisposeAsyncNotifier<Map<String, dynamic>> {
  late final String classId;

  FutureOr<Map<String, dynamic>> build(
    String classId,
  );
}

/// See also [ClassInfo].
@ProviderFor(ClassInfo)
const classInfoProvider = ClassInfoFamily();

/// See also [ClassInfo].
class ClassInfoFamily extends Family<AsyncValue<Map<String, dynamic>>> {
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
class ClassInfoProvider extends AutoDisposeAsyncNotifierProviderImpl<ClassInfo,
    Map<String, dynamic>> {
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
  FutureOr<Map<String, dynamic>> runNotifierBuild(
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
  AutoDisposeAsyncNotifierProviderElement<ClassInfo, Map<String, dynamic>>
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
mixin ClassInfoRef
    on AutoDisposeAsyncNotifierProviderRef<Map<String, dynamic>> {
  /// The parameter `classId` of this provider.
  String get classId;
}

class _ClassInfoProviderElement extends AutoDisposeAsyncNotifierProviderElement<
    ClassInfo, Map<String, dynamic>> with ClassInfoRef {
  _ClassInfoProviderElement(super.provider);

  @override
  String get classId => (origin as ClassInfoProvider).classId;
}

String _$activeSessionsHash() => r'dc82fbab2e6e44a790ebf5078b01db3b8ff45467';

/// See also [ActiveSessions].
@ProviderFor(ActiveSessions)
final activeSessionsProvider = AutoDisposeAsyncNotifierProvider<ActiveSessions,
    List<AttendanceModel>>.internal(
  ActiveSessions.new,
  name: r'activeSessionsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$activeSessionsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ActiveSessions = AutoDisposeAsyncNotifier<List<AttendanceModel>>;
String _$studentAttendanceStatusHash() =>
    r'a1ea42bee47933fad3e8a1bbe385a778e6b6a6aa';

abstract class _$StudentAttendanceStatus
    extends BuildlessAutoDisposeAsyncNotifier<Map<String, dynamic>> {
  late final String classId;
  late final String studentId;

  FutureOr<Map<String, dynamic>> build(
    String classId,
    String studentId,
  );
}

/// See also [StudentAttendanceStatus].
@ProviderFor(StudentAttendanceStatus)
const studentAttendanceStatusProvider = StudentAttendanceStatusFamily();

/// See also [StudentAttendanceStatus].
class StudentAttendanceStatusFamily
    extends Family<AsyncValue<Map<String, dynamic>>> {
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
        Map<String, dynamic>> {
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
  FutureOr<Map<String, dynamic>> runNotifierBuild(
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
      Map<String, dynamic>> createElement() {
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
    on AutoDisposeAsyncNotifierProviderRef<Map<String, dynamic>> {
  /// The parameter `classId` of this provider.
  String get classId;

  /// The parameter `studentId` of this provider.
  String get studentId;
}

class _StudentAttendanceStatusProviderElement
    extends AutoDisposeAsyncNotifierProviderElement<StudentAttendanceStatus,
        Map<String, dynamic>> with StudentAttendanceStatusRef {
  _StudentAttendanceStatusProviderElement(super.provider);

  @override
  String get classId => (origin as StudentAttendanceStatusProvider).classId;
  @override
  String get studentId => (origin as StudentAttendanceStatusProvider).studentId;
}

String _$classScheduleHash() => r'b14d826cef33ade02c38039297741fc5ea222d0a';

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

String _$classStatsHash() => r'2edb67ea3123e1f792d1c5d3982469229ab553b4';

abstract class _$ClassStats
    extends BuildlessAsyncNotifier<Map<String, dynamic>> {
  late final String classId;

  FutureOr<Map<String, dynamic>> build(
    String classId,
  );
}

/// See also [ClassStats].
@ProviderFor(ClassStats)
const classStatsProvider = ClassStatsFamily();

/// See also [ClassStats].
class ClassStatsFamily extends Family<AsyncValue<Map<String, dynamic>>> {
  /// See also [ClassStats].
  const ClassStatsFamily();

  /// See also [ClassStats].
  ClassStatsProvider call(
    String classId,
  ) {
    return ClassStatsProvider(
      classId,
    );
  }

  @override
  ClassStatsProvider getProviderOverride(
    covariant ClassStatsProvider provider,
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
  String? get name => r'classStatsProvider';
}

/// See also [ClassStats].
class ClassStatsProvider
    extends AsyncNotifierProviderImpl<ClassStats, Map<String, dynamic>> {
  /// See also [ClassStats].
  ClassStatsProvider(
    String classId,
  ) : this._internal(
          () => ClassStats()..classId = classId,
          from: classStatsProvider,
          name: r'classStatsProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$classStatsHash,
          dependencies: ClassStatsFamily._dependencies,
          allTransitiveDependencies:
              ClassStatsFamily._allTransitiveDependencies,
          classId: classId,
        );

  ClassStatsProvider._internal(
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
  FutureOr<Map<String, dynamic>> runNotifierBuild(
    covariant ClassStats notifier,
  ) {
    return notifier.build(
      classId,
    );
  }

  @override
  Override overrideWith(ClassStats Function() create) {
    return ProviderOverride(
      origin: this,
      override: ClassStatsProvider._internal(
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
  AsyncNotifierProviderElement<ClassStats, Map<String, dynamic>>
      createElement() {
    return _ClassStatsProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ClassStatsProvider && other.classId == classId;
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
mixin ClassStatsRef on AsyncNotifierProviderRef<Map<String, dynamic>> {
  /// The parameter `classId` of this provider.
  String get classId;
}

class _ClassStatsProviderElement
    extends AsyncNotifierProviderElement<ClassStats, Map<String, dynamic>>
    with ClassStatsRef {
  _ClassStatsProviderElement(super.provider);

  @override
  String get classId => (origin as ClassStatsProvider).classId;
}
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
