import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/user_model.dart';
import '../../data/repositories/auth_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../../../core/providers/repository_providers.dart';
import '../../../profile/data/repositories/profile_repository.dart';

part 'auth_provider.g.dart';

@riverpod
class Auth extends _$Auth {
  @override
  FutureOr<UserModel?> build() async {
    try {
      final authRepository = ref.read(authRepositoryProvider);
      final profileRepository = ref.read(profileRepositoryProvider);
      // Check if we have a valid session by attempting to refresh the token
      await authRepository.refreshToken();
      // If refresh succeeds, we have a valid session
      return await profileRepository.getProfile();
    } catch (e) {
      // If refresh fails, we don't have a valid session
      return null;
    }
  }

  Future<void> signIn(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(authRepositoryProvider);
      return await repository.signIn(email, password);
    });
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String role,
    String? matricNo,
    String? program,
    String? level,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(authRepositoryProvider);
      return await repository.signUp(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
        matricNo: matricNo,
        program: program,
        level: level,
      );
    });
  }

  Future<void> signOut() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(authRepositoryProvider);
      await repository.signOut();
      return null;
    });
  }

  Future<void> sendOTP(String email) async {
    final repository = ref.read(authRepositoryProvider);
    await repository.sendOtp(email);
  }

  Future<void> verifyOTP(String email, String otp) async {
    final repository = ref.read(authRepositoryProvider);
    await repository.verifyOtp(email, otp);
  }

  Future<void> sendVerificationEmail(String email) async {
    final repository = ref.read(authRepositoryProvider);
    await repository.sendVerificationEmail(email);
  }

  Future<void> verifyEmail(String token) async {
    final repository = ref.read(authRepositoryProvider);
    await repository.verifyEmail(token);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<void>>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  return AuthNotifier(authRepository);
});

class AuthNotifier extends StateNotifier<AsyncValue<void>> {
  final AuthRepository _authRepository;

  AuthNotifier(this._authRepository) : super(const AsyncValue.data(null));

  Future<void> signIn(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      await _authRepository.signIn(email, password);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> signOut() async {
    state = const AsyncValue.loading();
    try {
      await _authRepository.signOut();
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> sendOTP(String email) async {
    state = const AsyncValue.loading();
    try {
      await _authRepository.sendOTP(email);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> verifyOTP(String email, String otp) async {
    state = const AsyncValue.loading();
    try {
      await _authRepository.verifyOTP(email, otp);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
} 