/// Entity representing a class in the admin dashboard.
class ClassEntity {
  /// Creates a new instance of [ClassEntity].
  const ClassEntity({
    required this.id,
    required this.name,
    required this.code,
    required this.lecturerId,
    required this.lecturerName,
    this.description,
    this.isArchived = false,
    this.archivedAt,
    this.createdAt,
    this.updatedAt,
  });

  /// The unique identifier of the class.
  final String id;

  /// The name of the class.
  final String name;

  /// The code of the class.
  final String code;

  /// The ID of the lecturer teaching the class.
  final String lecturerId;

  /// The name of the lecturer teaching the class.
  final String lecturerName;

  /// The description of the class.
  final String? description;

  /// Whether the class is archived.
  final bool isArchived;

  /// The date when the class was archived.
  final DateTime? archivedAt;

  /// The date when the class was created.
  final DateTime? createdAt;

  /// The date when the class was last updated.
  final DateTime? updatedAt;

  /// Creates a [ClassEntity] from a JSON map.
  factory ClassEntity.fromJson(Map<String, dynamic> json) {
    return ClassEntity(
      id: json['_id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      lecturerId: json['lecturerId'] as String,
      lecturerName: json['lecturerName'] as String,
      description: json['description'] as String?,
      isArchived: json['isArchived'] as bool? ?? false,
      archivedAt: json['archivedAt'] != null
          ? DateTime.parse(json['archivedAt'] as String)
          : null,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : null,
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
    );
  }

  /// Converts the [ClassEntity] to a JSON map.
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'code': code,
      'lecturerId': lecturerId,
      'lecturerName': lecturerName,
      'description': description,
      'isArchived': isArchived,
      'archivedAt': archivedAt?.toIso8601String(),
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }
}
