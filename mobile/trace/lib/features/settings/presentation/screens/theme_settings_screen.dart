import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../common/theme/theme_provider.dart';

class ThemeSettingsScreen extends ConsumerWidget {
  const ThemeSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentTheme = ref.watch(themeProvider);
    final themeNotifier = ref.read(themeProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Theme Settings'),
      ),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.brightness_auto),
            title: const Text('System Theme'),
            subtitle: const Text('Follow system theme settings'),
            trailing: Radio<AppThemeMode>(
              value: AppThemeMode.system,
              groupValue: currentTheme,
              onChanged: (AppThemeMode? value) {
                if (value != null) {
                  themeNotifier.setThemeMode(value);
                }
              },
            ),
          ),
          ListTile(
            leading: const Icon(Icons.light_mode),
            title: const Text('Light Theme'),
            subtitle: const Text('Always use light theme'),
            trailing: Radio<AppThemeMode>(
              value: AppThemeMode.light,
              groupValue: currentTheme,
              onChanged: (AppThemeMode? value) {
                if (value != null) {
                  themeNotifier.setThemeMode(value);
                }
              },
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dark_mode),
            title: const Text('Dark Theme'),
            subtitle: const Text('Always use dark theme'),
            trailing: Radio<AppThemeMode>(
              value: AppThemeMode.dark,
              groupValue: currentTheme,
              onChanged: (AppThemeMode? value) {
                if (value != null) {
                  themeNotifier.setThemeMode(value);
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
