import 'package:flutter/material.dart';
import '../styles/app_styles.dart';

class RoleAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;
  final bool showBackButton;
  final Widget? leading;
  final PreferredSizeWidget? bottom;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double elevation;
  final bool centerTitle;

  const RoleAppBar({
    super.key,
    required this.title,
    this.actions,
    this.showBackButton = true,
    this.leading,
    this.bottom,
    this.backgroundColor,
    this.foregroundColor,
    this.elevation = 0,
    this.centerTitle = true,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(
        title,
        style: AppStyles.titleLarge.copyWith(
          color: foregroundColor ?? Colors.white,
        ),
      ),
      centerTitle: centerTitle,
      backgroundColor: backgroundColor ?? Theme.of(context).colorScheme.primary,
      foregroundColor: foregroundColor ?? Colors.white,
      elevation: elevation,
      leading: leading ?? (showBackButton ? const BackButton() : null),
      actions: actions,
      bottom: bottom,
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(bottom?.preferredSize.height ?? kToolbarHeight);
}

class AdminAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;
  final bool showBackButton;
  final Widget? leading;
  final PreferredSizeWidget? bottom;
  final VoidCallback? onLogout;

  const AdminAppBar({
    super.key,
    required this.title,
    this.actions,
    this.showBackButton = true,
    this.leading,
    this.bottom,
    this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    final List<Widget> appBarActions = [
      if (onLogout != null)
        IconButton(
          icon: const Icon(Icons.logout),
          onPressed: onLogout,
          tooltip: 'Logout',
        ),
      if (actions != null) ...actions!,
    ];

    return RoleAppBar(
      title: title,
      actions: appBarActions,
      showBackButton: showBackButton,
      leading: leading,
      bottom: bottom,
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(bottom?.preferredSize.height ?? kToolbarHeight);
}

class LecturerAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;
  final bool showBackButton;
  final Widget? leading;
  final PreferredSizeWidget? bottom;
  final VoidCallback? onLogout;

  const LecturerAppBar({
    super.key,
    required this.title,
    this.actions,
    this.showBackButton = true,
    this.leading,
    this.bottom,
    this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    final List<Widget> appBarActions = [
      if (onLogout != null)
        IconButton(
          icon: const Icon(Icons.logout),
          onPressed: onLogout,
          tooltip: 'Logout',
        ),
      if (actions != null) ...actions!,
    ];

    return RoleAppBar(
      title: title,
      actions: appBarActions,
      showBackButton: showBackButton,
      leading: leading,
      bottom: bottom,
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(bottom?.preferredSize.height ?? kToolbarHeight);
}

class StudentAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;
  final bool showBackButton;
  final Widget? leading;
  final PreferredSizeWidget? bottom;
  final VoidCallback? onLogout;

  const StudentAppBar({
    super.key,
    required this.title,
    this.actions,
    this.showBackButton = true,
    this.leading,
    this.bottom,
    this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    final List<Widget> appBarActions = [
      if (onLogout != null)
        IconButton(
          icon: const Icon(Icons.logout),
          onPressed: onLogout,
          tooltip: 'Logout',
        ),
      if (actions != null) ...actions!,
    ];

    return RoleAppBar(
      title: title,
      actions: appBarActions,
      showBackButton: showBackButton,
      leading: leading,
      bottom: bottom,
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(bottom?.preferredSize.height ?? kToolbarHeight);
} 