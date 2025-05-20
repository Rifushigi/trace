import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:trace/features/profile/domain/entities/profile_entity.dart';

part 'profile_model.freezed.dart';
part 'profile_model.g.dart';

@freezed
class ProfileModel with _$ProfileModel {
  const factory ProfileModel({
    required String id,
    required String firstName,
    required String lastName,
    required String email,
    required String role,
    required bool isVerified,
    String? avatar,
    String? matricNo,
    String? program,
    String? level,
    String? staffId,
    String? college,
    String? department,
  }) = _ProfileModel;

  factory ProfileModel.fromEntity(ProfileEntity entity) {
    return ProfileModel(
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      role: entity.role,
      isVerified: entity.isVerified,
      avatar: entity.avatar,
      matricNo: entity.matricNo,
      program: entity.program,
      level: entity.level,
      staffId: entity.staffId,
      college: entity.college,
      department: entity.department,
    );
  }

  factory ProfileModel.fromJson(Map<String, dynamic> json) =>
      _$ProfileModelFromJson(json);
}
