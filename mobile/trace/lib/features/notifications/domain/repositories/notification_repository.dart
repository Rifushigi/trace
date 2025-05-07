import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trace/core/services/fcm_service.dart';
import 'package:trace/features/notifications/data/models/notification_model.dart';

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

  // New methods for handling notification data
  Future<List<NotificationModel>> getNotifications();
  Future<void> markAsRead(String notificationId);
  Future<void> deleteNotification(String notificationId);
  Future<void> clearAllNotifications();
  Future<void> saveNotification(NotificationModel notification);
}

class NotificationRepositoryImpl implements NotificationRepository {
  final FCMService _fcmService;
  final FirebaseMessaging _messaging;
  final List<NotificationModel> _notifications;

  NotificationRepositoryImpl({
    FCMService? fcmService,
    FirebaseMessaging? messaging,
    List<NotificationModel>? notifications,
  })  : _fcmService = fcmService ?? FCMService(),
        _messaging = messaging ?? FirebaseMessaging.instance,
        _notifications = notifications ?? [];

  @override
  Future<void> initialize() async {
    await _fcmService.initialize();
  }

  @override
  Future<void> requestPermission() async {
    await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
  }

  @override
  Future<String?> getToken() async {
    return await _messaging.getToken();
  }

  @override
  Future<void> subscribeToTopic(String topic) async {
    await _messaging.subscribeToTopic(topic);
  }

  @override
  Future<void> unsubscribeFromTopic(String topic) async {
    await _messaging.unsubscribeFromTopic(topic);
  }

  @override
  Future<void> onMessageReceived(RemoteMessage message) async {
    await _fcmService.onMessageReceived(message);
    // Convert RemoteMessage to NotificationModel and save it
    final notification = NotificationModel(
      id: message.messageId ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: message.notification?.title ?? 'New Notification',
      body: message.notification?.body ?? '',
      type: message.data['type'] ?? 'default',
      data: message.data,
      createdAt: DateTime.now(),
      isRead: false,
    );
    await saveNotification(notification);
  }

  @override
  Future<void> onMessageOpenedApp(RemoteMessage message) async {
    await _fcmService.onMessageOpenedApp(message);
    // Mark notification as read when opened
    if (message.messageId != null) {
      await markAsRead(message.messageId!);
    }
  }

  @override
  Future<void> onBackgroundMessage(RemoteMessage message) async {
    await _fcmService.onBackgroundMessage(message);
    // Convert RemoteMessage to NotificationModel and save it
    final notification = NotificationModel(
      id: message.messageId ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: message.notification?.title ?? 'New Notification',
      body: message.notification?.body ?? '',
      type: message.data['type'] ?? 'default',
      data: message.data,
      createdAt: DateTime.now(),
      isRead: false,
    );
    await saveNotification(notification);
  }

  @override
  Future<void> handleNotificationTap(RemoteMessage message) async {
    await _fcmService.handleNotificationTap(message);
    // Mark notification as read when tapped
    if (message.messageId != null) {
      await markAsRead(message.messageId!);
    }
  }

  @override
  Future<void> sendNotification({
    required String title,
    required String body,
    required String topic,
    Map<String, dynamic>? data,
  }) async {
    await _fcmService.sendNotification(
      title: title,
      body: body,
      topic: topic,
      data: data,
    );
  }

  @override
  Future<List<NotificationModel>> getNotifications() async {
    return List.unmodifiable(_notifications);
  }

  @override
  Future<void> markAsRead(String notificationId) async {
    final index = _notifications.indexWhere((n) => n.id == notificationId);
    if (index != -1) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
    }
  }

  @override
  Future<void> deleteNotification(String notificationId) async {
    _notifications.removeWhere((n) => n.id == notificationId);
  }

  @override
  Future<void> clearAllNotifications() async {
    _notifications.clear();
  }

  @override
  Future<void> saveNotification(NotificationModel notification) async {
    _notifications.insert(
        0, notification); // Add new notifications at the beginning
  }
}
