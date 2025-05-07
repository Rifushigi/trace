import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class FCMService {
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  Future<void> initialize() async {
    const initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const initializationSettingsIOS = DarwinInitializationSettings();
    const initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
    );

    await _localNotifications.initialize(initializationSettings);
  }

  Future<void> onMessageReceived(RemoteMessage message) async {
    await _showNotification(
      title: message.notification?.title ?? 'New Notification',
      body: message.notification?.body ?? '',
      payload: message.data.toString(),
    );
  }

  Future<void> onMessageOpenedApp(RemoteMessage message) async {
    // Handle notification tap when app is in background
    await handleNotificationTap(message);
  }

  Future<void> onBackgroundMessage(RemoteMessage message) async {
    // Handle notification when app is terminated
    await handleNotificationTap(message);
  }

  Future<void> handleNotificationTap(RemoteMessage message) async {
    // Handle notification tap based on the data in the message
    final data = message.data;
    if (data.containsKey('route')) {
      // Navigate to the specified route
      // This will be implemented in the navigation service
    }
  }

  Future<void> sendNotification({
    required String title,
    required String body,
    required String topic,
    Map<String, dynamic>? data,
  }) async {
    // This will be implemented to send notifications through Firebase Cloud Messaging
    // The actual implementation will depend on your backend setup
  }

  Future<void> _showNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'default_channel',
      'Default Channel',
      channelDescription: 'Default notification channel',
      importance: Importance.high,
      priority: Priority.high,
    );

    const iosDetails = DarwinNotificationDetails();

    const notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(
      0,
      title,
      body,
      notificationDetails,
      payload: payload,
    );
  }
}
