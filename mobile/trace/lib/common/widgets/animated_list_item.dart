import 'package:flutter/material.dart';
import '../animations/app_animations.dart';

class AnimatedListItem extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final bool showDivider;
  final bool animate;

  const AnimatedListItem({
    super.key,
    required this.child,
    this.onTap,
    this.padding,
    this.margin,
    this.borderRadius,
    this.showDivider = true,
    this.animate = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    Widget content = Container(
      padding: padding ?? const EdgeInsets.all(16),
      margin: margin,
      decoration: BoxDecoration(
        borderRadius: borderRadius ?? BorderRadius.circular(12),
      ),
      child: AppAnimations.animatedContainer(
        context: context,
        child: child,
      ),
    );

    if (onTap != null) {
      content = InkWell(
        onTap: onTap,
        borderRadius: borderRadius ?? BorderRadius.circular(12),
        child: content,
      );
    }

    if (animate) {
      content = AppAnimations.slideIn(
        child: content,
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        content,
        if (showDivider)
          Divider(
            height: 1,
            thickness: 1,
            color: isDark ? Colors.grey[800] : Colors.grey[200],
          ),
      ],
    );
  }
}

class AnimatedListSection extends StatelessWidget {
  final String title;
  final List<Widget> children;
  final EdgeInsetsGeometry? padding;
  final bool animate;

  const AnimatedListSection({
    super.key,
    required this.title,
    required this.children,
    this.padding,
    this.animate = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: padding ?? const EdgeInsets.all(16),
          child: AppAnimations.fadeIn(
            child: Text(
              title,
              style: theme.textTheme.titleMedium?.copyWith(
                color: isDark ? Colors.grey[400] : Colors.grey[600],
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
        if (animate)
          AppAnimations.staggeredList(
            children: children,
          )
        else
          ...children,
      ],
    );
  }
}

class AnimatedCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius? borderRadius;
  final bool animate;

  const AnimatedCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding,
    this.margin,
    this.borderRadius,
    this.animate = true,
  });

  @override
  Widget build(BuildContext context) {
    Widget content = Container(
      padding: padding ?? const EdgeInsets.all(16),
      margin: margin,
      decoration: BoxDecoration(
        borderRadius: borderRadius ?? BorderRadius.circular(12),
      ),
      child: AppAnimations.animatedContainer(
        context: context,
        child: child,
      ),
    );

    if (onTap != null) {
      content = InkWell(
        onTap: onTap,
        borderRadius: borderRadius ?? BorderRadius.circular(12),
        child: content,
      );
    }

    if (animate) {
      content = AppAnimations.scaleIn(
        child: content,
      );
    }

    return content;
  }
}
