import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppThemeMode {
  system,
  light,
  dark,
}

final themeProvider = StateNotifierProvider<ThemeNotifier, AppThemeMode>((ref) {
  return ThemeNotifier();
});

class ThemeNotifier extends StateNotifier<AppThemeMode> {
  static const _themeKey = 'theme_mode';
  late SharedPreferences _prefs;

  ThemeNotifier() : super(AppThemeMode.system) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    _prefs = await SharedPreferences.getInstance();
    final savedTheme = _prefs.getString(_themeKey);
    if (savedTheme != null) {
      state = AppThemeMode.values.firstWhere(
        (mode) => mode.toString() == savedTheme,
        orElse: () => AppThemeMode.system,
      );
    }
  }

  Future<void> setThemeMode(AppThemeMode mode) async {
    state = mode;
    await _prefs.setString(_themeKey, mode.toString());
  }

  Future<void> toggleTheme() async {
    final newMode =
        state == AppThemeMode.light ? AppThemeMode.dark : AppThemeMode.light;
    await setThemeMode(newMode);
  }

  Future<void> setSystemTheme() async {
    await setThemeMode(AppThemeMode.system);
  }
}
