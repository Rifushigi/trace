/// Entity representing a user in the admin dashboard.
class UserEntity {
  /// Creates a new instance of [UserEntity].
  const UserEntity({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
    this.avatar,
    this.isDeleted = false,
    this.deletedAt,
  });

  /// The unique identifier of the user.
  final String id;

  /// The email address of the user.
  final String email;

  /// The first name of the user.
  final String firstName;

  /// The last name of the user.
  final String lastName;

  /// The role of the user (admin, lecturer, student).
  final String role;

  /// The avatar URL of the user.
  final String? avatar;

  /// Whether the user is deleted.
  final bool isDeleted;

  /// The date when the user was deleted.
  final DateTime? deletedAt;

  /// Creates a [UserEntity] from a JSON map.
  factory UserEntity.fromJson(Map<String, dynamic> json) {
    return UserEntity(
      id: json['_id'] as String,
      email: json['email'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      role: json['role'] as String,
      avatar: json['avatar'] as String?,
      isDeleted: json['isDeleted'] as bool? ?? false,
      deletedAt: json['deletedAt'] != null
          ? DateTime.parse(json['deletedAt'] as String)
          : null,
    );
  }

  /// Converts the [UserEntity] to a JSON map.
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'role': role,
      'avatar': avatar,
      'isDeleted': isDeleted,
      'deletedAt': deletedAt?.toIso8601String(),
    };
  }
}
