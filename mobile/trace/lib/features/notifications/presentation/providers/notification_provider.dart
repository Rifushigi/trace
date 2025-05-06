import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/notification_model.dart';
import '../../data/repositories/notification_repository.dart';

final notificationsProvider = StateNotifierProvider<NotificationsNotifier, AsyncValue<List<NotificationModel>>>((ref) {
  final repository = ref.watch(notificationRepositoryProvider);
  return NotificationsNotifier(repository);
});

class NotificationsNotifier extends StateNotifier<AsyncValue<List<NotificationModel>>> {
  final NotificationRepository _repository;

  NotificationsNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadNotifications();
  }

  Future<void> loadNotifications() async {
    try {
      state = const AsyncValue.loading();
      final notifications = await _repository.getNotifications();
      state = AsyncValue.data(notifications);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> markAsRead(String notificationId) async {
    try {
      await _repository.markAsRead(notificationId);
      state.whenData((notifications) {
        final updatedNotifications = notifications.map((notification) {
          if (notification.id == notificationId) {
            return notification.copyWith(isRead: true);
          }
          return notification;
        }).toList();
        state = AsyncValue.data(updatedNotifications);
      });
    } catch (e) {
      // Handle error
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _repository.markAllAsRead();
      state.whenData((notifications) {
        final updatedNotifications = notifications.map((notification) {
          return notification.copyWith(isRead: true);
        }).toList();
        state = AsyncValue.data(updatedNotifications);
      });
    } catch (e) {
      // Handle error
    }
  }

  Future<void> deleteNotification(String notificationId) async {
    try {
      await _repository.deleteNotification(notificationId);
      state.whenData((notifications) {
        final updatedNotifications = notifications.where((notification) {
          return notification.id != notificationId;
        }).toList();
        state = AsyncValue.data(updatedNotifications);
      });
    } catch (e) {
      // Handle error
    }
  }
} 