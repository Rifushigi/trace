import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trace/features/notifications/domain/entities/notification.dart';

final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  throw UnimplementedError('Provider must be overridden in the data layer');
});

abstract class NotificationRepository {
  Future<void> initialize();
  Future<void> requestPermission();
  Future<String?> getToken();
  Future<void> subscribeToTopic(String topic);
  Future<void> unsubscribeFromTopic(String topic);
  Future<void> onMessageReceived(RemoteMessage message);
  Future<void> onMessageOpenedApp(RemoteMessage message);
  Future<void> onBackgroundMessage(RemoteMessage message);
  Future<void> handleNotificationTap(RemoteMessage message);
  Future<void> sendNotification({
    required String title,
    required String body,
    required String topic,
    Map<String, dynamic>? data,
  });
  Future<List<NotificationEntity>> getNotifications();
  Future<void> markAsRead(String notificationId);
  Future<void> markAllAsRead();
  Future<void> deleteNotification(String notificationId);
  Future<void> deleteAllNotifications();
  Future<void> saveNotification(NotificationEntity notification);
}
