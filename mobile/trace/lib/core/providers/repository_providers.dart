import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/authentication/data/repositories/auth_repository.dart';
import '../../features/profile/data/repositories/profile_repository.dart';
import '../network/api_client.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthRepositoryImpl(apiClient);
});

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ProfileRepositoryImpl(apiClient);
});
