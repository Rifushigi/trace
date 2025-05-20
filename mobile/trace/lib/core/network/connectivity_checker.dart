import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'connectivity_checker.g.dart';

@riverpod
class ConnectivityChecker extends _$ConnectivityChecker {
  @override
  Future<bool> build() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    return connectivityResult != ConnectivityResult.none;
  }

  Future<void> checkConnectivity() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    state = AsyncData(connectivityResult != ConnectivityResult.none);
  }
}
