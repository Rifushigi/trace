import 'package:flutter/material.dart';
import 'dart:ui';

class LoadingOverlay extends StatelessWidget {
  final bool isLoading;
  final Widget child;
  final String? message;

  const LoadingOverlay({
    super.key,
    required this.isLoading,
    required this.child,
    this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          TweenAnimationBuilder<double>(
            duration: const Duration(milliseconds: 200),
            tween: Tween(begin: 0.0, end: 1.0),
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: child,
              );
            },
            child: Container(
              color: Colors.black.withAlpha(102),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 3, sigmaY: 3),
                child: Center(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 32),
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor.withAlpha(230),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withAlpha(26),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: 40,
                          height: 40,
                          child: CircularProgressIndicator(
                            strokeWidth: 3,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Theme.of(context).primaryColor,
                            ),
                          ),
                        ),
                        if (message != null) ...[
                          const SizedBox(height: 16),
                          Text(
                            message!,
                            style:
                                Theme.of(context).textTheme.bodyLarge?.copyWith(
                                      color: Theme.of(context)
                                          .textTheme
                                          .bodyLarge
                                          ?.color
                                          ?.withAlpha(204),
                                      fontWeight: FontWeight.w500,
                                    ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
