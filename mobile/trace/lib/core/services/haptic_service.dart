import 'package:flutter/services.dart';

class HapticService {
  static Future<void> lightImpact() async {
    await HapticFeedback.lightImpact();
  }

  static Future<void> mediumImpact() async {
    await HapticFeedback.mediumImpact();
  }

  static Future<void> heavyImpact() async {
    await HapticFeedback.heavyImpact();
  }

  static Future<void> selectionClick() async {
    await HapticFeedback.selectionClick();
  }

  static Future<void> vibrate() async {
    await HapticFeedback.vibrate();
  }

  // Custom feedback for specific actions
  static Future<void> successFeedback() async {
    await Future.wait([
      HapticFeedback.mediumImpact(),
      Future.delayed(const Duration(milliseconds: 100), () => HapticFeedback.lightImpact()),
    ]);
  }

  static Future<void> errorFeedback() async {
    await Future.wait([
      HapticFeedback.heavyImpact(),
      Future.delayed(const Duration(milliseconds: 100), () => HapticFeedback.mediumImpact()),
    ]);
  }

  static Future<void> navigationFeedback() async {
    await HapticFeedback.selectionClick();
  }

  static Future<void> actionFeedback() async {
    await HapticFeedback.mediumImpact();
  }
} 