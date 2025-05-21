import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/entities/user_entity.dart';
import '../../../../core/network/api_client.dart';
import '../../domain/repositories/auth_repository.dart';

part 'auth_provider.g.dart';

@riverpod
AuthRepository authRepository(Ref ref) {
  return AuthRepositoryImpl(ref.watch(apiClientProvider));
}

final authProvider = AsyncNotifierProvider<Auth, UserEntity?>(() {
  return Auth();
});

class Auth extends AsyncNotifier<UserEntity?> {
  late final AuthRepository _repository;

  @override
  FutureOr<UserEntity?> build() async {
    _repository = ref.watch(authRepositoryProvider);
    try {
      final user = await _repository.getCurrentUser();
      return user;
    } catch (e) {
      return null;
    }
  }

  Future<void> signIn(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final user = await _repository.signIn(email, password);
      state = AsyncValue.data(user);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String role,
    String? staffId,
    String? college,
    String? matricNo,
    String? program,
    String? level,
  }) async {
    state = const AsyncValue.loading();
    try {
      final user = await _repository.signUp(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
        staffId: staffId,
        college: college,
        matricNo: matricNo,
        program: program,
        level: level,
      );
      state = AsyncValue.data(user);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> signOut() async {
    state = const AsyncValue.loading();
    try {
      await _repository.signOut();
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> sendOtp(String email) async {
    state = const AsyncValue.loading();
    try {
      await _repository.sendOtp(email);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> verifyOtp(String email, String otp) async {
    state = const AsyncValue.loading();
    try {
      await _repository.verifyOtp(email, otp);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> sendVerificationEmail(String email) async {
    await _repository.sendVerificationEmail(email);
  }

  Future<void> verifyEmail(String token) async {
    await _repository.verifyEmail(token);
  }

  Future<void> updateProfile({
    String? name,
    String? email,
    String? avatar,
  }) async {
    state = const AsyncValue.loading();
    try {
      final user = await _repository.updateProfile(
        name: name,
        email: email,
        avatar: avatar,
      );
      state = AsyncValue.data(user);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
