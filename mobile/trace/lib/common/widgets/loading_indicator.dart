import 'package:flutter/material.dart';
import '../animations/app_animations.dart';

class AppLoadingIndicator extends StatelessWidget {
  final double size;
  final Color? color;
  final String? message;
  final bool showMessage;

  const AppLoadingIndicator({
    Key? key,
    this.size = 40.0,
    this.color,
    this.message,
    this.showMessage = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AppAnimations.pulse(
            child: SizedBox(
              width: size,
              height: size,
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(
                  color ?? theme.colorScheme.primary,
                ),
                strokeWidth: 3.0,
              ),
            ),
          ),
          if (showMessage && message != null) ...[
            const SizedBox(height: 16),
            AppAnimations.fadeIn(
              child: Text(
                message!,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: isDark ? Colors.grey[400] : Colors.grey[600],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class AppShimmerLoading extends StatelessWidget {
  final double width;
  final double height;
  final BorderRadius? borderRadius;

  const AppShimmerLoading({
    Key? key,
    required this.width,
    required this.height,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return AppAnimations.shimmer(
      baseColor: isDark ? Colors.grey[800] : Colors.grey[300],
      highlightColor: isDark ? Colors.grey[700] : Colors.grey[100],
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: isDark ? Colors.grey[800] : Colors.grey[300],
          borderRadius: borderRadius ?? BorderRadius.circular(8),
        ),
      ),
    );
  }
}

class AppLoadingOverlay extends StatelessWidget {
  final Widget child;
  final bool isLoading;
  final String? message;
  final Color? barrierColor;

  const AppLoadingOverlay({
    Key? key,
    required this.child,
    required this.isLoading,
    this.message,
    this.barrierColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          AppAnimations.fadeIn(
            child: Container(
              color: barrierColor ?? Colors.black54,
              child: AppLoadingIndicator(message: message),
            ),
          ),
      ],
    );
  }
} 