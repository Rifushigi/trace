import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:trace/core/services/fcm_service.dart';
import 'package:trace/features/notifications/domain/entities/notification.dart';


class NotificationRepositoryImpl implements NotificationRepository {
  final FCMService _fcmService;
  final FirebaseMessaging _messaging;

  NotificationRepositoryImpl({
    FCMService? fcmService,
    FirebaseMessaging? messaging,
  })  : _fcmService = fcmService ?? FCMService(),
        _messaging = messaging ?? FirebaseMessaging.instance;

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
  }

  @override
  Future<void> onMessageOpenedApp(RemoteMessage message) async {
    await _fcmService.onMessageOpenedApp(message);
  }

  @override
  Future<void> onBackgroundMessage(RemoteMessage message) async {
    await _fcmService.onBackgroundMessage(message);
  }

  @override
  Future<void> handleNotificationTap(RemoteMessage message) async {
    await _fcmService.handleNotificationTap(message);
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
} 