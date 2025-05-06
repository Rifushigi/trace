import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_core/firebase_core.dart';
import 'dart:convert';
import '../network/api_client.dart';
import '../network/endpoints.dart';
import '../routes/app_router.dart';
import 'package:flutter/material.dart';

final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService();
});

class NotificationService {
  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();
  IO.Socket? _socket;
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  bool _isSocketConnected = false;
  String? _currentUserId;

  Future<void> initialize() async {
    // Initialize Firebase
    await Firebase.initializeApp();

    // Initialize local notifications
    const initializationSettingsAndroid = AndroidInitializationSettings('@mipmap/ic_launcher');
    const initializationSettingsIOS = DarwinInitializationSettings();
    const initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
    );
    await _localNotifications.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        if (response.payload != null) {
          _handleNotificationTap(json.decode(response.payload!));
        }
      },
    );

    // Request notification permissions
    await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    // Get FCM token
    final token = await _firebaseMessaging.getToken();
    if (token != null && _currentUserId != null) {
      _registerFCMToken(token);
    }

    // Listen for FCM token refresh
    _firebaseMessaging.onTokenRefresh.listen((token) {
      if (_currentUserId != null) {
        _registerFCMToken(token);
      }
    });

    // Handle FCM messages when app is in foreground
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // Handle FCM messages when app is in background and user taps notification
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessageOpenedApp);
  }

  void connectSocket(String userId) {
    if (_isSocketConnected) return;
    _currentUserId = userId;

    _socket = IO.io(ApiClient.baseUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
      'path': '/socket.io',
    });

    _socket!.onConnect((_) {
      _isSocketConnected = true;
      _socket!.emit('register:user', userId);
    });

    _socket!.onDisconnect((_) {
      _isSocketConnected = false;
    });

    // Listen for attendance events
    _socket!.on('attendance:session_start', _handleSessionStart);
    _socket!.on('attendance:session_end', _handleSessionEnd);
    _socket!.on('attendance:check_in', _handleCheckIn);
    _socket!.on('attendance:check_in_confirmation', _handleCheckInConfirmation);
    _socket!.on('attendance:anomaly', _handleAnomaly);
  }

  void disconnectSocket() {
    _socket?.disconnect();
    _socket?.dispose();
    _isSocketConnected = false;
    _currentUserId = null;
  }

  Future<void> _registerFCMToken(String token) async {
    if (_isSocketConnected && _currentUserId != null) {
      _socket!.emit('register:fcm_token', {
        'userId': _currentUserId,
        'token': token,
      });
    }
  }

  Future<void> _handleForegroundMessage(RemoteMessage message) async {
    // Show local notification for foreground messages
    await _showNotification(
      title: message.notification?.title ?? 'New Notification',
      body: message.notification?.body ?? '',
      payload: json.encode(message.data),
    );
  }

  Future<void> _handleMessageOpenedApp(RemoteMessage message) async {
    // Handle notification tap when app is in background
    _handleNotificationTap(message.data);
  }

  Future<void> _showNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'attendance_channel',
      'Attendance Notifications',
      channelDescription: 'Notifications for attendance events',
      importance: Importance.high,
      priority: Priority.high,
    );
    const iosDetails = DarwinNotificationDetails();
    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(
      DateTime.now().millisecond,
      title,
      body,
      details,
      payload: payload,
    );
  }

  void _handleNotificationTap(Map<String, dynamic> data) {
    final type = data['type'];
    final context = navigatorKey.currentContext;
    if (context == null) return;

    switch (type) {
      case 'session_start':
        Navigator.pushNamed(context, '/class/details', arguments: data['classId']);
        break;
      case 'session_end':
        Navigator.pushNamed(context, '/class/details', arguments: data['classId']);
        break;
      case 'check_in':
        Navigator.pushNamed(context, '/attendance/details', arguments: data['attendanceId']);
        break;
      case 'anomaly':
        Navigator.pushNamed(context, '/attendance/anomaly', arguments: data['anomalyId']);
        break;
    }
  }

  // Socket.IO event handlers
  void _handleSessionStart(dynamic data) {
    _showNotification(
      title: 'Attendance Session Started',
      body: 'A new attendance session has started',
      payload: json.encode(data),
    );
  }

  void _handleSessionEnd(dynamic data) {
    _showNotification(
      title: 'Attendance Session Ended',
      body: 'The attendance session has ended',
      payload: json.encode(data),
    );
  }

  void _handleCheckIn(dynamic data) {
    _showNotification(
      title: 'Student Checked In',
      body: 'A student has checked in to the class',
      payload: json.encode(data),
    );
  }

  void _handleCheckInConfirmation(dynamic data) {
    _showNotification(
      title: 'Check-in Confirmed',
      body: 'Your attendance has been recorded',
      payload: json.encode(data),
    );
  }

  void _handleAnomaly(dynamic data) {
    _showNotification(
      title: 'Anomaly Detected',
      body: 'An anomaly was detected during check-in',
      payload: json.encode(data),
    );
  }
} 