import 'dart:convert';
import 'package:shared_preferences.dart';
import '../models/attendance_model.dart';

class AttendanceLocalStorage {
  final SharedPreferences _prefs;
  static const String _offlineSessionsKey = 'offline_sessions';
  static const String _pendingCheckInsKey = 'pending_check_ins';
  static const String _syncQueueKey = 'sync_queue';
  static const String _lastSyncTimestampKey = 'last_sync_timestamp';
  static const String _offlineDataKey = 'offline_data';

  // Empty state constants
  static const Map<String, dynamic> emptySession = {
    'id': '',
    'classId': '',
    'startTime': '',
    'endTime': null,
    'status': 'inactive',
    'checkIns': [],
    'isOffline': true,
    'isEmpty': true,
  };

  static const Map<String, dynamic> emptyCheckIn = {
    'sessionId': '',
    'studentId': '',
    'timestamp': '',
    'retryCount': 0,
    'lastAttempt': null,
    'isOffline': true,
    'isEmpty': true,
  };

  static const Map<String, dynamic> emptySyncOperation = {
    'operation': '',
    'data': {},
    'timestamp': '',
    'retryCount': 0,
    'isOffline': true,
    'isEmpty': true,
  };

  static const Map<String, dynamic> emptyOfflineData = {
    'data': null,
    'timestamp': '',
    'isOffline': true,
    'isEmpty': true,
  };

  AttendanceLocalStorage(this._prefs);

  // Offline Session Management
  Future<void> storeOfflineSession(String sessionId, Map<String, dynamic> sessionData) async {
    final offlineSessions = await getOfflineSessions();
    offlineSessions[sessionId] = {
      ...sessionData,
      'lastUpdated': DateTime.now().toIso8601String(),
      'isOffline': true,
      'isEmpty': false,
    };
    await _prefs.setString(_offlineSessionsKey, jsonEncode(offlineSessions));
  }

  Future<Map<String, Map<String, dynamic>>> getOfflineSessions() async {
    final sessionsJson = _prefs.getString(_offlineSessionsKey);
    if (sessionsJson == null) return {};

    final Map<String, dynamic> decoded = jsonDecode(sessionsJson);
    return decoded.map((key, value) => MapEntry(key, Map<String, dynamic>.from(value)));
  }

  Future<Map<String, dynamic>> getOfflineSession(String sessionId) async {
    final sessions = await getOfflineSessions();
    return sessions[sessionId] ?? {...emptySession, 'id': sessionId};
  }

  // Pending Check-ins with Retry Count
  Future<void> storePendingCheckIn(String sessionId, String studentId) async {
    final pendingCheckIns = await getPendingCheckIns();
    pendingCheckIns.add({
      'sessionId': sessionId,
      'studentId': studentId,
      'timestamp': DateTime.now().toIso8601String(),
      'retryCount': 0,
      'lastAttempt': null,
      'isOffline': true,
      'isEmpty': false,
    });
    await _prefs.setString(_pendingCheckInsKey, jsonEncode(pendingCheckIns));
  }

  Future<List<Map<String, dynamic>>> getPendingCheckIns() async {
    final checkInsJson = _prefs.getString(_pendingCheckInsKey);
    if (checkInsJson == null) return [];

    final List<dynamic> decoded = jsonDecode(checkInsJson);
    return decoded.map((item) => Map<String, dynamic>.from(item)).toList();
  }

  Future<Map<String, dynamic>> getPendingCheckIn(String sessionId, String studentId) async {
    final pendingCheckIns = await getPendingCheckIns();
    return pendingCheckIns.firstWhere(
      (checkIn) => checkIn['sessionId'] == sessionId && checkIn['studentId'] == studentId,
      orElse: () => {...emptyCheckIn, 'sessionId': sessionId, 'studentId': studentId},
    );
  }

  Future<void> updatePendingCheckInRetry(String sessionId, String studentId, {bool incrementRetry = true}) async {
    final pendingCheckIns = await getPendingCheckIns();
    final index = pendingCheckIns.indexWhere(
      (checkIn) => checkIn['sessionId'] == sessionId && checkIn['studentId'] == studentId,
    );
    
    if (index != -1) {
      if (incrementRetry) {
        pendingCheckIns[index]['retryCount'] = (pendingCheckIns[index]['retryCount'] ?? 0) + 1;
      }
      pendingCheckIns[index]['lastAttempt'] = DateTime.now().toIso8601String();
      await _prefs.setString(_pendingCheckInsKey, jsonEncode(pendingCheckIns));
    }
  }

  Future<void> removePendingCheckIn(String sessionId, String studentId) async {
    final pendingCheckIns = await getPendingCheckIns();
    pendingCheckIns.removeWhere(
      (checkIn) => checkIn['sessionId'] == sessionId && checkIn['studentId'] == studentId,
    );
    await _prefs.setString(_pendingCheckInsKey, jsonEncode(pendingCheckIns));
  }

  // Sync Queue Management
  Future<void> addToSyncQueue(String operation, Map<String, dynamic> data) async {
    final queue = await getSyncQueue();
    queue.add({
      'operation': operation,
      'data': data,
      'timestamp': DateTime.now().toIso8601String(),
      'retryCount': 0,
      'isOffline': true,
      'isEmpty': false,
    });
    await _prefs.setString(_syncQueueKey, jsonEncode(queue));
  }

  Future<List<Map<String, dynamic>>> getSyncQueue() async {
    final queueJson = _prefs.getString(_syncQueueKey);
    if (queueJson == null) return [];

    final List<dynamic> decoded = jsonDecode(queueJson);
    return decoded.map((item) => Map<String, dynamic>.from(item)).toList();
  }

  Future<Map<String, dynamic>> getSyncOperation(int index) async {
    final queue = await getSyncQueue();
    if (index >= 0 && index < queue.length) {
      return queue[index];
    }
    return {...emptySyncOperation};
  }

  Future<void> removeFromSyncQueue(int index) async {
    final queue = await getSyncQueue();
    if (index >= 0 && index < queue.length) {
      queue.removeAt(index);
      await _prefs.setString(_syncQueueKey, jsonEncode(queue));
    }
  }

  // Offline Data Management
  Future<void> storeOfflineData(String key, dynamic data) async {
    final offlineData = await getOfflineData();
    offlineData[key] = {
      'data': data,
      'timestamp': DateTime.now().toIso8601String(),
      'isOffline': true,
      'isEmpty': false,
    };
    await _prefs.setString(_offlineDataKey, jsonEncode(offlineData));
  }

  Future<Map<String, dynamic>> getOfflineData() async {
    final dataJson = _prefs.getString(_offlineDataKey);
    if (dataJson == null) return {};

    final Map<String, dynamic> decoded = jsonDecode(dataJson);
    return decoded.map((key, value) => MapEntry(key, Map<String, dynamic>.from(value)));
  }

  Future<T?> getOfflineDataItem<T>(String key) async {
    final offlineData = await getOfflineData();
    final item = offlineData[key];
    if (item != null && !item['isEmpty']) {
      return item['data'] as T;
    }
    return null;
  }

  Future<Map<String, dynamic>> getOfflineDataItemWithMetadata(String key) async {
    final offlineData = await getOfflineData();
    return offlineData[key] ?? {...emptyOfflineData};
  }

  // Sync Timestamp Management
  Future<void> updateLastSyncTimestamp() async {
    await _prefs.setString(_lastSyncTimestampKey, DateTime.now().toIso8601String());
  }

  Future<DateTime?> getLastSyncTimestamp() async {
    final timestamp = _prefs.getString(_lastSyncTimestampKey);
    return timestamp != null ? DateTime.parse(timestamp) : null;
  }

  // Data Cleanup
  Future<void> clearOfflineData() async {
    await _prefs.remove(_offlineSessionsKey);
    await _prefs.remove(_pendingCheckInsKey);
    await _prefs.remove(_syncQueueKey);
    await _prefs.remove(_lastSyncTimestampKey);
    await _prefs.remove(_offlineDataKey);
  }

  // Data Validation
  Future<bool> validateOfflineData() async {
    try {
      final sessions = await getOfflineSessions();
      final checkIns = await getPendingCheckIns();
      final queue = await getSyncQueue();
      final offlineData = await getOfflineData();

      // Validate data structure
      return sessions is Map &&
          checkIns is List &&
          queue is List &&
          offlineData is Map;
    } catch (e) {
      return false;
    }
  }

  // Check if there's any pending offline data
  Future<bool> hasPendingOfflineData() async {
    final pendingCheckIns = await getPendingCheckIns();
    final syncQueue = await getSyncQueue();
    final offlineSessions = await getOfflineSessions();
    
    return pendingCheckIns.isNotEmpty || 
           syncQueue.isNotEmpty || 
           offlineSessions.isNotEmpty;
  }

  // Check if specific data is empty
  Future<bool> isSessionEmpty(String sessionId) async {
    final session = await getOfflineSession(sessionId);
    return session['isEmpty'] ?? true;
  }

  Future<bool> isCheckInEmpty(String sessionId, String studentId) async {
    final checkIn = await getPendingCheckIn(sessionId, studentId);
    return checkIn['isEmpty'] ?? true;
  }

  Future<bool> isSyncOperationEmpty(int index) async {
    final operation = await getSyncOperation(index);
    return operation['isEmpty'] ?? true;
  }

  Future<bool> isOfflineDataEmpty(String key) async {
    final data = await getOfflineDataItemWithMetadata(key);
    return data['isEmpty'] ?? true;
  }
} 