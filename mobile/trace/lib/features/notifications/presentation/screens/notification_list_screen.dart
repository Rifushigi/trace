import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/notification.dart';
import '../providers/notification_provider.dart';
import '../../../../core/constants/app_constants.dart';

class NotificationListScreen extends ConsumerWidget {
  const NotificationListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notificationsAsync = ref.watch(notificationProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all),
            onPressed: () {
              ref.read(notificationProvider.notifier).markAllAsRead();
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () {
              ref.read(notificationProvider.notifier).deleteAllNotifications();
            },
          ),
        ],
      ),
      body: notificationsAsync.when(
        data: (notifications) {
          if (notifications.isEmpty) {
            return const Center(
              child: Text('No notifications'),
            );
          }

          return ListView.builder(
            itemCount: notifications.length,
            itemBuilder: (context, index) {
              final notification = notifications[index];
              return _buildNotificationTile(context, ref, notification);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }

  Widget _buildNotificationTile(
      BuildContext context, WidgetRef ref, NotificationEntity notification) {
    return ListTile(
      leading: Icon(
        notification.isRead ? Icons.mark_email_read : Icons.mark_email_unread,
        color: notification.isRead ? Colors.grey : Colors.blue,
      ),
      title: Text(notification.title),
      subtitle: Text(notification.body),
      trailing: IconButton(
        icon: const Icon(Icons.delete),
        onPressed: () {
          ref
              .read(notificationProvider.notifier)
              .deleteNotification(notification.id);
        },
      ),
      onTap: () {
        if (!notification.isRead) {
          ref.read(notificationProvider.notifier).markAsRead(notification.id);
        }

        // Handle notification tap based on type and data
        switch (notification.type) {
          case 'attendance':
            if (notification.data != null) {
              final classId = notification.data!['classId'];
              final sessionId = notification.data!['sessionId'];
              if (classId != null && sessionId != null) {
                Navigator.pushNamed(
                  context,
                  AppConstants.attendanceManagementRoute,
                  arguments: {
                    'classId': classId,
                    'sessionId': sessionId,
                  },
                );
              }
            }
            break;
          case 'class':
            if (notification.data != null) {
              final classId = notification.data!['classId'];
              if (classId != null) {
                Navigator.pushNamed(
                  context,
                  AppConstants.attendanceDetailsRoute,
                  arguments: {'classId': classId},
                );
              }
            }
            break;
          case 'profile':
            Navigator.pushNamed(context, AppConstants.profileRoute);
            break;
          case 'settings':
            Navigator.pushNamed(context, AppConstants.settingsRoute);
            break;
          default:
            // If there's a specific route in the notification, use it
            if (notification.route != null) {
              Navigator.pushNamed(
                context,
                notification.route!,
                arguments: notification.data,
              );
            }
        }
      },
    );
  }
}
