import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'core/routes/app_router.dart';
import 'core/services/notification_service.dart';
import 'common/theme/theme_provider.dart';
import 'common/theme/app_theme.dart';

/// Handles background messages from Firebase Cloud Messaging.
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint('Handling a background message: ${message.messageId}');
}

/// The main entry point of the application.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize SharedPreferences
  await SharedPreferences.getInstance();

  // Initialize Firebase
  await Firebase.initializeApp();

  // Set up background message handler
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // Initialize notification service
  final notificationService = NotificationService();
  await notificationService.initialize();

  runApp(
    const ProviderScope(
      child: TraceApp(),
    ),
  );
}

/// The root widget of the application.
class TraceApp extends ConsumerWidget {
  /// Creates a new instance of [TraceApp].
  const TraceApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appThemeMode = ref.watch(themeProvider);
    final themeMode = ThemeMode.values[appThemeMode.index];

    return MaterialApp(
      title: 'Trace',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      onGenerateRoute: (settings) => AppRouter.generateRoute(settings, ref),
      initialRoute: '/',
    );
  }
}
