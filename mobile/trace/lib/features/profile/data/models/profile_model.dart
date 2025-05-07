import 'package:freezed_annotation/freezed_annotation.dart';

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

  factory ProfileModel.fromJson(Map<String, dynamic> json) =>
      _$ProfileModelFromJson(json);
}
