import 'package:firebase_messaging/firebase_messaging.dart';
import '../utils/logger.dart';

class FCMService {
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

  Future<void> initialize() async {
    // Request notification permissions
    await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // Get FCM token
    final token = await _firebaseMessaging.getToken();
    if (token != null) {
      AppLogger.info('FCM Token: $token');
      // You can send this token to your server
    }

    // Listen for FCM token refresh
    _firebaseMessaging.onTokenRefresh.listen((token) {
      AppLogger.info('FCM Token refreshed: $token');
      // You can send the new token to your server
    });
  }

  Future<void> onMessageReceived(RemoteMessage message) async {
    // The notification will be shown automatically by Firebase
    AppLogger.info('Handling foreground message: ${message.messageId}');
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

  Future<String?> getToken() async {
    final token = await _firebaseMessaging.getToken();
    AppLogger.info('FCM Token: $token');
    return token;
  }

  Future<void> onTokenRefresh() async {
    _firebaseMessaging.onTokenRefresh.listen((token) {
      AppLogger.info('FCM Token refreshed: $token');
    });
  }

  Future<void> onMessage() async {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      AppLogger.info('Handling foreground message: ${message.messageId}');
      // Handle foreground messages
    });
  }
}
