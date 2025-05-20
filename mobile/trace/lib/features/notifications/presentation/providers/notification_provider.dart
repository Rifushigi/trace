import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/notification.dart';
import '../../domain/repositories/notification_repository.dart';

final notificationProvider = StateNotifierProvider<NotificationNotifier,
    AsyncValue<List<NotificationEntity>>>((ref) {
  return NotificationNotifier(ref.watch(notificationRepositoryProvider));
});

class NotificationNotifier
    extends StateNotifier<AsyncValue<List<NotificationEntity>>> {
  final NotificationRepository _repository;

  NotificationNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadNotifications();
  }

  Future<void> loadNotifications() async {
    state = const AsyncValue.loading();
    try {
      final notifications = await _repository.getNotifications();
      state = AsyncValue.data(notifications);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> saveNotification(NotificationEntity notification) async {
    await _repository.saveNotification(notification);
    await loadNotifications();
  }

  Future<void> markAsRead(String notificationId) async {
    await _repository.markAsRead(notificationId);
    await loadNotifications();
  }

  Future<void> markAllAsRead() async {
    await _repository.markAllAsRead();
    await loadNotifications();
  }

  Future<void> deleteNotification(String notificationId) async {
    await _repository.deleteNotification(notificationId);
    await loadNotifications();
  }

  Future<void> deleteAllNotifications() async {
    await _repository.deleteAllNotifications();
    await loadNotifications();
  }
}
