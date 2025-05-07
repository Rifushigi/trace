import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/auth_repository.dart';
import '../../domain/models/user_model.dart';
import '../../../../core/network/api_client.dart';

part 'auth_provider.g.dart';

@riverpod
AuthRepository authRepository(Ref ref) {
  return AuthRepositoryImpl(ref.watch(apiClientProvider));
}

@riverpod
class Auth extends _$Auth {
  @override
  FutureOr<UserModel?> build() async {
    return null;
  }

  Future<void> signIn(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final auth =
          await ref.read(authRepositoryProvider).signIn(email, password);
      state = AsyncValue.data(UserModel(
        id: auth.id,
        email: email,
        role: auth.role,
        isVerified: auth.isVerified,
      ));
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> signOut() async {
    state = const AsyncValue.loading();
    try {
      await ref.read(authRepositoryProvider).signOut();
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> sendOTP(String email) async {
    state = const AsyncValue.loading();
    try {
      await ref.read(authRepositoryProvider).sendOtp(email);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> verifyOTP(String email, String otp) async {
    state = const AsyncValue.loading();
    try {
      await ref.read(authRepositoryProvider).verifyOtp(email, otp);
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> sendVerificationEmail(String email) async {
    await ref.read(authRepositoryProvider).sendVerificationEmail(email);
  }

  Future<void> verifyEmail(String token) async {
    await ref.read(authRepositoryProvider).verifyEmail(token);
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String role,
    String? staffId,
    String? college,
    Map<String, dynamic>? additionalInfo,
  }) async {
    state = const AsyncValue.loading();
    try {
      final auth = await ref.read(authRepositoryProvider).signUp(
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            role: role,
            staffId: staffId,
            college: college,
            additionalInfo: additionalInfo,
          );
      state = AsyncValue.data(UserModel(
        id: auth.id,
        email: email,
        role: role,
        isVerified: auth.isVerified,
      ));
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}
