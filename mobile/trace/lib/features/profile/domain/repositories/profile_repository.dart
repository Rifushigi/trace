import '../entities/profile_entity.dart';

abstract class ProfileRepository {
  Future<ProfileEntity?> getProfile();
  Future<void> updateProfile(ProfileEntity profile);
  Future<String> uploadAvatar(String filePath);
}
