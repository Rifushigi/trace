import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_core/firebase_core.dart';
import '../network/endpoints.dart';
import 'package:flutter/material.dart';
import '../utils/logger.dart';

final navigatorKey = GlobalKey<NavigatorState>();

final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService();
});

class NotificationService {
  io.Socket? _socket;
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  bool _isSocketConnected = false;
  String? _currentUserId;

  Future<void> initialize() async {
    // Initialize Firebase
    await Firebase.initializeApp();

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

    _socket = io.io(Endpoints.baseUrl, <String, dynamic>{
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
    AppLogger.info('Handling foreground message: ${message.messageId}');
    // The notification will be shown automatically by Firebase
    // We can handle any additional logic here if needed
  }

  Future<void> _handleMessageOpenedApp(RemoteMessage message) async {
    // Handle notification tap when app is in background
    _handleNotificationTap(message.data);
  }

  void _handleNotificationTap(Map<String, dynamic> data) {
    final type = data['type'];
    final context = navigatorKey.currentContext;
    if (context == null) return;

    switch (type) {
      case 'session_start':
        Navigator.pushNamed(
          context,
          '/class/details',
          arguments: data['classId'],
        );
        break;
      case 'session_end':
        Navigator.pushNamed(
          context,
          '/class/details',
          arguments: data['classId'],
        );
        break;
      case 'check_in':
        Navigator.pushNamed(
          context,
          '/attendance/details',
          arguments: data['attendanceId'],
        );
        break;
      case 'anomaly':
        Navigator.pushNamed(
          context,
          '/attendance/anomaly',
          arguments: data['anomalyId'],
        );
        break;
    }
  }

  // Socket.IO event handlers
  Future<void> _handleSessionStart(dynamic data) async {
    AppLogger.info('Session started: $data');
    // The server will send FCM notifications directly
  }

  Future<void> _handleSessionEnd(dynamic data) async {
    AppLogger.info('Session ended: $data');
    // The server will send FCM notifications directly
  }

  Future<void> _handleCheckIn(dynamic data) async {
    AppLogger.info('Check-in received: $data');
    // The server will send FCM notifications directly
  }

  Future<void> _handleCheckInConfirmation(dynamic data) async {
    AppLogger.info('Check-in confirmed: $data');
    // The server will send FCM notifications directly
  }

  Future<void> _handleAnomaly(dynamic data) async {
    AppLogger.info('Anomaly detected: $data');
    // The server will send FCM notifications directly
  }
}
