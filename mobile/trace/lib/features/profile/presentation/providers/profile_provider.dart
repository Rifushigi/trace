import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/profile_model.dart';
import '../../data/repositories/profile_repository.dart';

part 'profile_provider.g.dart';

@riverpod
class Profile extends _$Profile {
  @override
  FutureOr<ProfileModel?> build() async {
    return _loadProfile();
  }

  Future<ProfileModel?> _loadProfile() async {
    try {
      final repository = ref.read(profileRepositoryProvider);
      return await repository.getProfile();
    } catch (e) {
      return null;
    }
  }

  Future<ProfileModel?> updateProfile(ProfileModel profile) async {
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
