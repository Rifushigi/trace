import 'package:flutter/material.dart';

enum ToastType { success, error, info, warning }

class Toast {
  static void show(
    BuildContext context, {
    required String message,
    ToastType type = ToastType.info,
    Duration duration = const Duration(seconds: 3),
  }) {
    final scaffold = ScaffoldMessenger.of(context);
    final theme = Theme.of(context);

    Color backgroundColor;
    Color textColor = Colors.white;
    IconData icon;

    switch (type) {
      case ToastType.success:
        backgroundColor = theme.colorScheme.tertiary;
        icon = Icons.check_circle;
        break;
      case ToastType.error:
        backgroundColor = theme.colorScheme.error;
        icon = Icons.error;
        break;
      case ToastType.warning:
        backgroundColor = theme.colorScheme.tertiaryContainer;
        icon = Icons.warning;
        break;
      case ToastType.info:
        backgroundColor = theme.colorScheme.primary;
        icon = Icons.info;
        break;
    }

    scaffold.showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(icon, color: textColor),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: TextStyle(color: textColor),
              ),
            ),
          ],
        ),
        backgroundColor: backgroundColor,
        duration: duration,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
}
