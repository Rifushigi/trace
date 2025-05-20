import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:trace/features/notifications/domain/entities/notification.dart';

part 'notification_model.freezed.dart';
part 'notification_model.g.dart';

@freezed
class NotificationModel with _$NotificationModel {
  const factory NotificationModel({
    required String id,
    required String title,
    required String body,
    required String type,
    required DateTime createdAt,
    required bool isRead,
    String? route,
    Map<String, dynamic>? data,
  }) = _NotificationModel;

  factory NotificationModel.fromEntity(NotificationEntity entity) {
    return NotificationModel(
      id: entity.id,
      title: entity.title,
      body: entity.body,
      type: entity.type,
      createdAt: entity.createdAt,
      isRead: entity.isRead,
      route: entity.route,
      data: entity.data,
    );
  }

  factory NotificationModel.fromJson(Map<String, dynamic> json) =>
      _$NotificationModelFromJson(json);
}
