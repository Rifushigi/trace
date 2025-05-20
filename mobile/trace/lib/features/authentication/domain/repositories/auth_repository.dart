import 'package:trace/features/authentication/domain/entities/user_entity.dart';

abstract class AuthRepository {
  Future<UserEntity?> getCurrentUser();
  Future<UserEntity> signIn(String email, String password);
  Future<UserEntity> signUp({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String role,
    String? staffId,
    String? college,
    Map<String, dynamic>? additionalInfo,
  });
  Future<void> signOut();
  Future<void> sendOtp(String email);
  Future<void> verifyOtp(String email, String otp);
  Future<void> sendVerificationEmail(String email);
  Future<void> verifyEmail(String token);
  Future<UserEntity> updateProfile({
    String? name,
    String? email,
    String? avatar,
  });
}

// The abstract class should be in the domain while the implementation will be in the data directory
///
