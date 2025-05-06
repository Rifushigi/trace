# Attendance System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Session Management](#session-management)
3. [Check-in Process](#check-in-process)
4. [Offline Support](#offline-support)
5. [Location Services](#location-services)
6. [Data Synchronization](#data-synchronization)
7. [Error Handling](#error-handling)
8. [User Scenarios](#user-scenarios)

## Overview

The attendance system is a core feature of the Trace mobile app, designed to handle both online and offline attendance tracking. It supports automatic and manual check-ins, location-based verification, and real-time synchronization.

## Session Management

### Session States
1. **Not Started**
   - Default state
   - Can be started by lecturer
   - No check-ins possible

2. **Active**
   - Started by lecturer
   - Accepts check-ins
   - Real-time updates
   - Location verification active

3. **Ended**
   - Manually ended by lecturer
   - No new check-ins
   - Final attendance report generated
   - Data ready for export

### Session Configuration
```dart
class SessionConfig {
  final String classId;
  final DateTime startTime;
  final DateTime endTime;
  final LocationConfig location;
  final bool requireLocation;
  final bool allowManualCheckIn;
  final int lateThreshold; // minutes
}
```

## Check-in Process

### Automatic Check-in
1. **Location Verification**
   ```dart
   Future<bool> verifyLocation(Location userLocation, Location sessionLocation) async {
     final distance = calculateDistance(userLocation, sessionLocation);
     return distance <= sessionLocation.radius;
   }
   ```

2. **Time Verification**
   ```dart
   bool isWithinTimeWindow(DateTime checkInTime, Session session) {
     final lateThreshold = session.lateThreshold;
     return checkInTime.isBefore(session.endTime.add(Duration(minutes: lateThreshold)));
   }
   ```

### Manual Check-in
1. **Lecturer Initiated**
   - Lecturer selects student
   - Verifies student identity
   - Records reason for manual check-in
   - Confirms check-in

2. **Student Requested**
   - Student requests manual check-in
   - Lecturer receives notification
   - Lecturer approves/rejects
   - Student notified of result

## Offline Support

### Local Storage
```dart
class AttendanceLocalStorage {
  Future<void> storeOfflineCheckIn(CheckIn checkIn);
  Future<void> storeOfflineSession(Session session);
  Future<List<CheckIn>> getPendingCheckIns();
  Future<void> clearPendingCheckIns();
}
```

### Sync Queue
```dart
class SyncQueue {
  Future<void> addToQueue(SyncOperation operation);
  Future<void> processQueue();
  Future<void> handleConflict(Conflict conflict);
}
```

## Location Services

### Location Configuration
```dart
class LocationConfig {
  final double latitude;
  final double longitude;
  final double radius; // meters
  final bool isRequired;
  final int accuracy; // meters
}
```

### Location Verification
1. **GPS Accuracy**
   - Minimum accuracy: 10 meters
   - Maximum radius: 100 meters
   - Fallback to manual check-in if accuracy insufficient

2. **Indoor Location**
   - WiFi-based location when GPS unavailable
   - Bluetooth beacons support
   - Manual override option

## Data Synchronization

### Sync Process
1. **Initial Sync**
   ```dart
   Future<void> performInitialSync() async {
     await syncClasses();
     await syncSessions();
     await syncCheckIns();
   }
   ```

2. **Incremental Sync**
   ```dart
   Future<void> performIncrementalSync() async {
     final lastSync = await getLastSyncTime();
     await syncNewData(lastSync);
   }
   ```

### Conflict Resolution
1. **Check-in Conflicts**
   - Server timestamp takes precedence
   - Manual resolution for same-timestamp conflicts
   - Logging of all conflicts

2. **Session Conflicts**
   - Lecturer's device takes precedence
   - Automatic merge for non-conflicting changes
   - Manual resolution for conflicting changes

## Error Handling

### Common Errors
1. **Location Errors**
   ```dart
   class LocationError extends Error {
     final String message;
     final LocationErrorType type;
     final Location? lastKnownLocation;
   }
   ```

2. **Network Errors**
   ```dart
   class NetworkError extends Error {
     final String message;
     final NetworkErrorType type;
     final bool isRetryable;
   }
   ```

### Recovery Strategies
1. **Automatic Recovery**
   - Retry failed operations
   - Fallback to cached data
   - Queue for later sync

2. **Manual Recovery**
   - Clear corrupted data
   - Force sync
   - Reset session

## User Scenarios

### Student Scenarios

1. **Normal Check-in**
   ```
   Given: Student is in class
   When: Student opens app during active session
   Then: Student can check in automatically
   And: Location is verified
   And: Check-in is recorded
   ```

2. **Late Check-in**
   ```
   Given: Student arrives late
   When: Student attempts to check in
   Then: System marks check-in as late
   And: Lecturer is notified
   And: Student receives confirmation
   ```

3. **Offline Check-in**
   ```
   Given: No internet connection
   When: Student attempts to check in
   Then: Check-in is stored locally
   And: Student receives offline confirmation
   And: Data syncs when online
   ```

### Lecturer Scenarios

1. **Starting Session**
   ```
   Given: Lecturer is in classroom
   When: Lecturer starts session
   Then: Location is set
   And: Students are notified
   And: Session becomes active
   ```

2. **Manual Check-in**
   ```
   Given: Student requests manual check-in
   When: Lecturer verifies student
   Then: Lecturer can approve check-in
   And: Student is marked present
   And: Reason is recorded
   ```

3. **Ending Session**
   ```
   Given: Session is active
   When: Lecturer ends session
   Then: No new check-ins allowed
   And: Final report is generated
   And: Students are notified
   ```

### Admin Scenarios

1. **Viewing Reports**
   ```
   Given: Admin needs attendance data
   When: Admin generates report
   Then: Report includes all sessions
   And: Data can be exported
   And: Statistics are calculated
   ```

2. **Managing Sessions**
   ```
   Given: Session needs modification
   When: Admin edits session
   Then: Changes are applied
   And: Affected users are notified
   And: History is maintained
   ``` 