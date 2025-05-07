import '../models/user_model.dart';

abstract class AuthRepository {
  Future<UserModel?> signIn(String email, String password);
  Future<UserModel?> signUp(String email, String password, String role);
  Future<void> signOut();
  Future<UserModel?> getCurrentUser();
}

class AuthRepositoryImpl implements AuthRepository {
  @override
  Future<UserModel?> signIn(String email, String password) async {
    // TODO: Implement actual sign in logic
    return null;
  }

  @override
  Future<UserModel?> signUp(String email, String password, String role) async {
    // TODO: Implement actual sign up logic
    return null;
  }

  @override
  Future<void> signOut() async {
    // TODO: Implement actual sign out logic
  }

  @override
  Future<UserModel?> getCurrentUser() async {
    // TODO: Implement actual get current user logic
    return null;
  }
}
