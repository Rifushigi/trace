class ClassInfoEntity {
  final String id;
  final String name;
  final String code;
  final String lecturerId;
  final Map<String, dynamic> schedule;

  ClassInfoEntity({
    required this.id,
    required this.name,
    required this.code,
    required this.lecturerId,
    required this.schedule,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'code': code,
      'lecturerId': lecturerId,
      'schedule': schedule,
    };
  }

  factory ClassInfoEntity.fromJson(Map<String, dynamic> json) {
    return ClassInfoEntity(
      id: json['id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      lecturerId: json['lecturerId'] as String,
      schedule: json['schedule'] as Map<String, dynamic>,
    );
  }
}
