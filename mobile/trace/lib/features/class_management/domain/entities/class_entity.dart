import 'package:freezed_annotation/freezed_annotation.dart';

part 'class_entity.freezed.dart';
part 'class_entity.g.dart';

@freezed
class ClassEntity with _$ClassEntity {
  const factory ClassEntity({
    required String id,
    required String name,
    required String code,
    required String lecturerId,
    required Map<String, dynamic> schedule,
    @Default([]) List<String> students,
  }) = _ClassEntity;

  factory ClassEntity.fromJson(Map<String, dynamic> json) =>
      _$ClassEntityFromJson(json);

  const ClassEntity._();

  bool get isValid {
    return id.isNotEmpty &&
        name.isNotEmpty &&
        code.isNotEmpty &&
        lecturerId.isNotEmpty &&
        schedule.isNotEmpty;
  }
}
