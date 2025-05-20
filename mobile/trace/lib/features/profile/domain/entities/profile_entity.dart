import 'package:freezed_annotation/freezed_annotation.dart';

part 'profile_entity.freezed.dart';
part 'profile_entity.g.dart';

@freezed
class ProfileEntity with _$ProfileEntity {
  const factory ProfileEntity({
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
  }) = _ProfileEntity;

  factory ProfileEntity.fromJson(Map<String, dynamic> json) =>
      _$ProfileEntityFromJson(json);
}
