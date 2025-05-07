import 'dart:async';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/attendance_model.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

part 'attendance_cache_service.g.dart';

class _CacheEntry {
  final dynamic data;
  final DateTime timestamp;
  final String type;

  _CacheEntry(this.data, this.type) : timestamp = DateTime.now();

  bool get isValid =>
      DateTime.now().difference(timestamp) < const Duration(hours: 24);
}

@riverpod
Future<AttendanceCacheService> attendanceCacheService(Ref ref) async {
  final prefs = await SharedPreferences.getInstance();
  return AttendanceCacheService(prefs);
}

class AttendanceCacheService {
  final SharedPreferences _prefs;
  static const String _cacheKey = 'attendance_cache';

  // In-memory cache
  final Map<String, _CacheEntry> _memoryCache = {};

  AttendanceCacheService(this._prefs);

  // Cache frequently accessed data
  Future<void> cacheData(String key, dynamic data, String type) async {
    // Update memory cache
    _memoryCache[key] = _CacheEntry(data, type);

    // Update disk cache
    final diskCache = await _getDiskCache();
    diskCache[key] = {
      'data': data,
      'timestamp': DateTime.now().toIso8601String(),
      'type': type,
    };
    await _saveDiskCache(diskCache);
  }

  // Get cached data with type checking
  Future<T?> getCachedData<T>(String key, String type) async {
    // Try memory cache first
    final memoryEntry = _memoryCache[key];
    if (memoryEntry != null &&
        memoryEntry.isValid &&
        memoryEntry.type == type) {
      return memoryEntry.data as T;
    }

    // Try disk cache
    final diskCache = await _getDiskCache();
    final diskEntry = diskCache[key];
    if (diskEntry != null) {
      final timestamp = DateTime.parse(diskEntry['timestamp']);
      if (DateTime.now().difference(timestamp) < const Duration(hours: 24) &&
          diskEntry['type'] == type) {
        // Update memory cache
        _memoryCache[key] = _CacheEntry(diskEntry['data'], type);
        return diskEntry['data'] as T;
      }
    }

    return null;
  }

  // Cache class schedule
  Future<void> cacheClassSchedule(
      String classId, List<Map<String, dynamic>> schedule) async {
    await cacheData('schedule_$classId', schedule, 'schedule');
  }

  Future<List<Map<String, dynamic>>?> getCachedClassSchedule(
      String classId) async {
    return await getCachedData<List<Map<String, dynamic>>>(
        'schedule_$classId', 'schedule');
  }

  // Cache student attendance status
  Future<void> cacheStudentAttendanceStatus(
      String classId, String studentId, Map<String, dynamic> status) async {
    await cacheData('status_${classId}_$studentId', status, 'status');
  }

  Future<Map<String, dynamic>?> getCachedStudentAttendanceStatus(
      String classId, String studentId) async {
    return await getCachedData<Map<String, dynamic>>(
        'status_${classId}_$studentId', 'status');
  }

  // Cache active sessions
  Future<void> cacheActiveSessions(List<AttendanceModel> sessions) async {
    await cacheData('active_sessions', sessions.map((s) => s.toJson()).toList(),
        'sessions');
  }

  Future<List<AttendanceModel>?> getCachedActiveSessions() async {
    final sessions = await getCachedData<List<Map<String, dynamic>>>(
        'active_sessions', 'sessions');
    return sessions?.map((s) => AttendanceModel.fromJson(s)).toList();
  }

  // Cache student attendance history
  Future<void> cacheStudentHistory(
      String studentId, String classId, List<AttendanceModel> history) async {
    await cacheData('history_${studentId}_$classId',
        history.map((h) => h.toJson()).toList(), 'history');
  }

  Future<List<AttendanceModel>?> getCachedStudentHistory(
      String studentId, String classId) async {
    final history = await getCachedData<List<Map<String, dynamic>>>(
        'history_${studentId}_$classId', 'history');
    return history?.map((h) => AttendanceModel.fromJson(h)).toList();
  }

  // Cache class statistics
  Future<void> cacheClassStats(
      String classId, Map<String, dynamic> stats) async {
    await cacheData('stats_$classId', stats, 'stats');
  }

  Future<Map<String, dynamic>?> getCachedClassStats(String classId) async {
    return await getCachedData<Map<String, dynamic>>('stats_$classId', 'stats');
  }

  // Clear expired cache entries
  Future<void> clearExpiredCache() async {
    // Clear memory cache
    _memoryCache.removeWhere((_, entry) => !entry.isValid);

    // Clear disk cache
    final diskCache = await _getDiskCache();
    final now = DateTime.now();
    diskCache.removeWhere((_, entry) {
      final timestamp = DateTime.parse(entry['timestamp']);
      return now.difference(timestamp) >= const Duration(hours: 24);
    });
    await _saveDiskCache(diskCache);
  }

  // Clear specific cache entry
  Future<void> clearCacheEntry(String key) async {
    _memoryCache.remove(key);
    final diskCache = await _getDiskCache();
    diskCache.remove(key);
    await _saveDiskCache(diskCache);
  }

  // Clear all cache
  Future<void> clearAllCache() async {
    _memoryCache.clear();
    await _prefs.remove(_cacheKey);
  }

  // Helper methods for disk cache
  Future<Map<String, dynamic>> _getDiskCache() async {
    final cacheJson = _prefs.getString(_cacheKey);
    if (cacheJson == null) return {};
    return jsonDecode(cacheJson);
  }

  Future<void> _saveDiskCache(Map<String, dynamic> cache) async {
    await _prefs.setString(_cacheKey, jsonEncode(cache));
  }
}
