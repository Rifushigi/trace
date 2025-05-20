class ClassSchedule {
  final String day;
  final String startTime;
  final String endTime;
  final bool isRecurring;
  final List<String> recurringDays;
  final String? endDate;

  ClassSchedule({
    required this.day,
    required this.startTime,
    required this.endTime,
    required this.isRecurring,
    required this.recurringDays,
    this.endDate,
  });

  factory ClassSchedule.fromJson(Map<String, dynamic> json) {
    return ClassSchedule(
      day: json['day'] as String,
      startTime: json['startTime'] as String,
      endTime: json['endTime'] as String,
      isRecurring: json['isRecurring'] as bool,
      recurringDays: (json['recurringDays'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      endDate: json['endDate'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'startTime': startTime,
      'endTime': endTime,
      'isRecurring': isRecurring,
      'recurringDays': recurringDays,
      'endDate': endDate,
    };
  }

  bool get isValid =>
      day.isNotEmpty && startTime.isNotEmpty && endTime.isNotEmpty;

  bool hasConflict(ClassSchedule other) {
    // Simple conflict check: same day and overlapping time
    if (isRecurring != other.isRecurring) return false;
    if (isRecurring) {
      for (final day in recurringDays) {
        if (other.recurringDays.contains(day) && _timeOverlap(other)) {
          return true;
        }
      }
      return false;
    } else {
      return day == other.day && _timeOverlap(other);
    }
  }

  bool _timeOverlap(ClassSchedule other) {
    // Assumes time format is HH:mm
    final startA = _parseTime(startTime);
    final endA = _parseTime(endTime);
    final startB = _parseTime(other.startTime);
    final endB = _parseTime(other.endTime);
    return startA.isBefore(endB) && startB.isBefore(endA);
  }

  DateTime _parseTime(String time) {
    final parts = time.split(':');
    return DateTime(0, 1, 1, int.parse(parts[0]), int.parse(parts[1]));
  }
}
