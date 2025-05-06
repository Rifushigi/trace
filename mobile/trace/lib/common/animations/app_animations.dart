import 'package:flutter/material.dart';

class AppAnimations {
  // Fade animation for widgets
  static Widget fadeIn({
    required Widget child,
    Duration duration = const Duration(milliseconds: 300),
    Curve curve = Curves.easeInOut,
  }) {
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: 0.0, end: 1.0),
      builder: (context, value, child) {
        return Opacity(
          opacity: value,
          child: child,
        );
      },
      child: child,
    );
  }

  // Scale animation for widgets
  static Widget scaleIn({
    required Widget child,
    Duration duration = const Duration(milliseconds: 300),
    Curve curve = Curves.easeInOut,
    double begin = 0.8,
    double end = 1.0,
  }) {
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: begin, end: end),
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: child,
        );
      },
      child: child,
    );
  }

  // Slide animation for widgets
  static Widget slideIn({
    required Widget child,
    Duration duration = const Duration(milliseconds: 300),
    Curve curve = Curves.easeInOut,
    Offset begin = const Offset(0.0, 0.1),
    Offset end = Offset.zero,
  }) {
    return TweenAnimationBuilder<Offset>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: begin, end: end),
      builder: (context, value, child) {
        return Transform.translate(
          offset: value,
          child: child,
        );
      },
      child: child,
    );
  }

  // Bounce animation for widgets
  static Widget bounceIn({
    required Widget child,
    Duration duration = const Duration(milliseconds: 500),
    Curve curve = Curves.bounceOut,
    double begin = 0.0,
    double end = 1.0,
  }) {
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: begin, end: end),
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: child,
        );
      },
      child: child,
    );
  }

  // Rotate animation for widgets
  static Widget rotateIn({
    required Widget child,
    Duration duration = const Duration(milliseconds: 500),
    Curve curve = Curves.easeInOut,
    double begin = -0.1,
    double end = 0.0,
  }) {
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: begin, end: end),
      builder: (context, value, child) {
        return Transform.rotate(
          angle: value,
          child: child,
        );
      },
      child: child,
    );
  }

  // Flip animation for widgets
  static Widget flipIn({
    required Widget child,
    Duration duration = const Duration(milliseconds: 500),
    Curve curve = Curves.easeInOut,
    double begin = 0.5,
    double end = 1.0,
  }) {
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: begin, end: end),
      builder: (context, value, child) {
        return Transform(
          transform: Matrix4.identity()
            ..setEntry(3, 2, 0.001)
            ..rotateX(value * 2 * 3.14159),
          alignment: Alignment.center,
          child: child,
        );
      },
      child: child,
    );
  }

  // Staggered list animation
  static Widget staggeredList({
    required List<Widget> children,
    Duration itemDuration = const Duration(milliseconds: 300),
    Duration staggerDuration = const Duration(milliseconds: 50),
    Curve curve = Curves.easeInOut,
  }) {
    return ListView.builder(
      itemCount: children.length,
      itemBuilder: (context, index) {
        return TweenAnimationBuilder<double>(
          duration: itemDuration + (staggerDuration * index),
          curve: curve,
          tween: Tween(begin: 0.0, end: 1.0),
          builder: (context, value, child) {
            return Opacity(
              opacity: value,
              child: Transform.translate(
                offset: Offset(0, 20 * (1 - value)),
                child: child,
              ),
            );
          },
          child: children[index],
        );
      },
    );
  }

  // Pulse animation for buttons or interactive elements
  static Widget pulse({
    required Widget child,
    Duration duration = const Duration(milliseconds: 1500),
    Curve curve = Curves.easeInOut,
  }) {
    return TweenAnimationBuilder<double>(
      duration: duration,
      curve: curve,
      tween: Tween(begin: 1.0, end: 1.05),
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: child,
        );
      },
      child: child,
    );
  }

  // Shimmer loading animation
  static Widget shimmer({
    required Widget child,
    Duration duration = const Duration(milliseconds: 1500),
    Color? baseColor,
    Color? highlightColor,
  }) {
    return ShaderMask(
      shaderCallback: (bounds) {
        return LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            baseColor ?? Colors.grey[300]!,
            highlightColor ?? Colors.grey[100]!,
            baseColor ?? Colors.grey[300]!,
          ],
          stops: const [0.0, 0.5, 1.0],
        ).createShader(bounds);
      },
      child: child,
    );
  }

  // Hero animation wrapper
  static Widget hero({
    required String tag,
    required Widget child,
  }) {
    return Hero(
      tag: tag,
      child: child,
    );
  }

  // Animated container with theme-aware colors
  static Widget animatedContainer({
    required Widget child,
    required BuildContext context,
    Duration duration = const Duration(milliseconds: 300),
    Curve curve = Curves.easeInOut,
    EdgeInsetsGeometry? padding,
    EdgeInsetsGeometry? margin,
    BorderRadius? borderRadius,
    BoxBorder? border,
    Color? backgroundColor,
    List<BoxShadow>? boxShadow,
  }) {
    final theme = Theme.of(context);
    return AnimatedContainer(
      duration: duration,
      curve: curve,
      padding: padding,
      margin: margin,
      decoration: BoxDecoration(
        color: backgroundColor ?? theme.colorScheme.surface,
        borderRadius: borderRadius,
        border: border,
        boxShadow: boxShadow ?? [
          BoxShadow(
            color: theme.brightness == Brightness.dark
                ? Colors.black12
                : Colors.grey.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: child,
    );
  }

  // Combined animations
  static Widget combinedAnimation({
    required Widget child,
    Duration duration = const Duration(milliseconds: 500),
    Curve curve = Curves.easeInOut,
    bool useFade = true,
    bool useScale = true,
    bool useSlide = true,
    bool useRotate = true,
    bool useFlip = false,
  }) {
    Widget animatedChild = child;
    
    if (useFade) {
      animatedChild = fadeIn(child: animatedChild, duration: duration, curve: curve);
    }
    if (useScale) {
      animatedChild = scaleIn(child: animatedChild, duration: duration, curve: curve);
    }
    if (useSlide) {
      animatedChild = slideIn(child: animatedChild, duration: duration, curve: curve);
    }
    if (useRotate) {
      animatedChild = rotateIn(child: animatedChild, duration: duration, curve: curve);
    }
    if (useFlip) {
      animatedChild = flipIn(child: animatedChild, duration: duration, curve: curve);
    }
    
    return animatedChild;
  }
} 