import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/entities/profile_entity.dart';
import '../../data/repositories/profile_repository_impl.dart';

part 'profile_provider.g.dart';

@riverpod
class Profile extends _$Profile {
  @override
  FutureOr<ProfileEntity?> build() async {
    return await _loadProfile();
  }

  Future<ProfileEntity?> _loadProfile() async {
    try {
      final repository = ref.read(profileRepositoryProvider);
      return await repository.getProfile();
    } catch (e) {
      return null;
    }
  }

  Future<ProfileEntity?> updateProfile(ProfileEntity profile) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(profileRepositoryProvider);
      await repository.updateProfile(profile);
      return profile;
    });
    return state.value;
  }

  Future<void> uploadAvatar(String filePath) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(profileRepositoryProvider);
      final avatarUrl = await repository.uploadAvatar(filePath);
      final currentProfile = state.value;
      if (currentProfile != null) {
        return currentProfile.copyWith(avatar: avatarUrl);
      }
      return null;
    });
  }

  Future<void> refreshProfile() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _loadProfile());
  }
}
