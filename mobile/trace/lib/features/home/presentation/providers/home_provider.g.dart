// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'home_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$dashboardItemsHash() => r'a87e203fb0af932aa4ae4325ece33732f52a5570';

/// See also [dashboardItems].
@ProviderFor(dashboardItems)
final dashboardItemsProvider =
    AutoDisposeFutureProvider<List<DashboardItem>>.internal(
  dashboardItems,
  name: r'dashboardItemsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$dashboardItemsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef DashboardItemsRef = AutoDisposeFutureProviderRef<List<DashboardItem>>;
String _$dashboardStatsHash() => r'e448f77a9245e3a0a77d8a4c00dfe86b5f50be1c';

/// See also [dashboardStats].
@ProviderFor(dashboardStats)
final dashboardStatsProvider =
    AutoDisposeFutureProvider<Map<String, dynamic>>.internal(
  dashboardStats,
  name: r'dashboardStatsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$dashboardStatsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef DashboardStatsRef = AutoDisposeFutureProviderRef<Map<String, dynamic>>;
String _$homePreferencesHash() => r'e383697fe6dc93fe38501460efe1f57818cede67';

/// See also [HomePreferences].
@ProviderFor(HomePreferences)
final homePreferencesProvider =
    AutoDisposeNotifierProvider<HomePreferences, Map<String, dynamic>>.internal(
  HomePreferences.new,
  name: r'homePreferencesProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$homePreferencesHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$HomePreferences = AutoDisposeNotifier<Map<String, dynamic>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
