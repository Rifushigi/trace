import 'package:freezed_annotation/freezed_annotation.dart';

part 'class_model.freezed.dart';
part 'class_model.g.dart';

@freezed
class ClassSchedule with _$ClassSchedule {
  const factory ClassSchedule({
    required String day,
    required String startTime,
    required String endTime,
    @Default(false) bool isRecurring,
    @Default([]) List<String> recurringDays,
    String? endDate,
  }) = _ClassSchedule;

  factory ClassSchedule.fromJson(Map<String, dynamic> json) => _$ClassScheduleFromJson(json);

  bool get isValid {
    if (startTime.isEmpty || endTime.isEmpty) return false;
    
    final start = DateTime.parse('2000-01-01 $startTime');
    final end = DateTime.parse('2000-01-01 $endTime');
    
    if (end.isBefore(start)) return false;
    
    if (isRecurring) {
      if (recurringDays.isEmpty) return false;
      if (endDate != null) {
        final endDateObj = DateTime.parse(endDate!);
        if (endDateObj.isBefore(DateTime.now())) return false;
      }
    }
    
    return true;
  }

  bool hasConflict(ClassSchedule other) {
    if (day != other.day) return false;
    
    final thisStart = DateTime.parse('2000-01-01 $startTime');
    final thisEnd = DateTime.parse('2000-01-01 $endTime');
    final otherStart = DateTime.parse('2000-01-01 ${other.startTime}');
    final otherEnd = DateTime.parse('2000-01-01 ${other.endTime}');
    
    return (thisStart.isBefore(otherEnd) && thisEnd.isAfter(otherStart));
  }
}

@freezed
class ClassModel with _$ClassModel {
  const factory ClassModel({
    required String id,
    required String name,
    required String code,
    required String lecturerId,
    required ClassSchedule schedule,
  }) = _ClassModel;

  factory ClassModel.fromJson(Map<String, dynamic> json) => _$ClassModelFromJson(json);
}
