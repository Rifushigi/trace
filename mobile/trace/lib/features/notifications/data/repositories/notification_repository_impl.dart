import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trace/core/services/fcm_service.dart';
import 'package:trace/features/notifications/domain/entities/notification.dart';
import 'package:trace/features/notifications/domain/repositories/notification_repository.dart';
import 'package:trace/features/notifications/data/models/notification_model.dart';
import 'package:trace/core/utils/logger.dart';

@override
final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepositoryImpl();
});

class NotificationRepositoryImpl implements NotificationRepository {
  final FCMService _fcmService;
  final FirebaseMessaging _messaging;
  final List<NotificationModel> _notifications = [];

  NotificationRepositoryImpl({
    FCMService? fcmService,
    FirebaseMessaging? messaging,
  })  : _fcmService = fcmService ?? FCMService(),
        _messaging = messaging ?? FirebaseMessaging.instance;

  @override
  Future<void> initialize() async {
    try {
      await _fcmService.initialize();
      AppLogger.info('Notification service initialized successfully');
    } catch (e, stackTrace) {
      AppLogger.error(
          'Failed to initialize notification service', e, stackTrace);
      rethrow;
    }
  }

  @override
  Future<void> requestPermission() async {
    try {
      await _messaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );
      AppLogger.info('Notification permissions requested successfully');
    } catch (e, stackTrace) {
      AppLogger.error(
          'Failed to request notification permissions', e, stackTrace);
      rethrow;
    }
  }

  @override
  Future<String?> getToken() async {
    try {
      final token = await _messaging.getToken();
      AppLogger.info('FCM token retrieved successfully');
      return token;
    } catch (e, stackTrace) {
      AppLogger.error('Failed to get FCM token', e, stackTrace);
      rethrow;
    }
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
    try {
      await _fcmService.onMessageReceived(message);
      AppLogger.info('Handling foreground message: ${message.messageId}');

      final notification = NotificationModel(
        id: message.messageId ??
            DateTime.now().millisecondsSinceEpoch.toString(),
        title: message.notification?.title ?? 'New Notification',
        body: message.notification?.body ?? '',
        type: message.data['type'] ?? 'default',
        data: message.data,
        createdAt: DateTime.now(),
        isRead: false,
      );
      await saveNotification(
          NotificationEntity.fromJson(notification.toJson()));
    } catch (e, stackTrace) {
      AppLogger.error('Error handling foreground message', e, stackTrace);
      rethrow;
    }
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
    await saveNotification(NotificationEntity.fromJson(notification.toJson()));
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
  Future<List<NotificationEntity>> getNotifications() async {
    try {
      final notifications = _notifications
          .map((model) => NotificationEntity.fromJson(model.toJson()))
          .toList();
      AppLogger.info('Retrieved ${notifications.length} notifications');
      return notifications;
    } catch (e, stackTrace) {
      AppLogger.error('Failed to get notifications', e, stackTrace);
      rethrow;
    }
  }

  @override
  Future<void> saveNotification(NotificationEntity notification) async {
    try {
      _notifications.insert(
          0, NotificationModel.fromJson(notification.toJson()));
      AppLogger.info('Saved new notification: ${notification.id}');
    } catch (e, stackTrace) {
      AppLogger.error('Failed to save notification', e, stackTrace);
      rethrow;
    }
  }

  @override
  Future<void> markAllAsRead() async {
    try {
      for (var i = 0; i < _notifications.length; i++) {
        _notifications[i] = NotificationModel.fromJson(
          _notifications[i].toJson()..['isRead'] = true,
        );
      }
      AppLogger.info('Marked all notifications as read');
    } catch (e, stackTrace) {
      AppLogger.error(
          'Failed to mark all notifications as read', e, stackTrace);
      rethrow;
    }
  }

  @override
  Future<void> markAsRead(String notificationId) async {
    try {
      final index = _notifications.indexWhere((n) => n.id == notificationId);
      if (index != -1) {
        _notifications[index] = NotificationModel.fromJson(
          _notifications[index].toJson()..['isRead'] = true,
        );
        AppLogger.info('Marked notification as read: $notificationId');
      } else {
        AppLogger.warning('Notification not found: $notificationId');
      }
    } catch (e, stackTrace) {
      AppLogger.error('Failed to mark notification as read: $notificationId', e,
          stackTrace);
      rethrow;
    }
  }

  @override
  Future<void> deleteNotification(String notificationId) async {
    try {
      final initialLength = _notifications.length;
      _notifications.removeWhere((n) => n.id == notificationId);
      if (_notifications.length < initialLength) {
        AppLogger.info('Deleted notification: $notificationId');
      } else {
        AppLogger.warning(
            'Notification not found for deletion: $notificationId');
      }
    } catch (e, stackTrace) {
      AppLogger.error(
          'Failed to delete notification: $notificationId', e, stackTrace);
      rethrow;
    }
  }

  @override
  Future<void> deleteAllNotifications() async {
    try {
      final count = _notifications.length;
      _notifications.clear();
      AppLogger.info('Deleted all notifications ($count)');
    } catch (e, stackTrace) {
      AppLogger.error('Failed to delete all notifications', e, stackTrace);
      rethrow;
    }
  }
}
