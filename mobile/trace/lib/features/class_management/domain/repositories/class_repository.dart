import '../entities/class_entity.dart';
import '../entities/class_statistics.dart';
import '../../../authentication/domain/entities/user_entity.dart';

abstract class ClassRepository {
  Future<List<ClassEntity>> getLecturerClasses();
  Future<List<ClassEntity>> getEnrolledClasses();
  Future<List<ClassEntity>> searchClasses(String query);
  Future<ClassEntity?> getClassDetails(String classId);
  Future<ClassStatistics?> getClassStatistics(String classId, UserEntity user);
  Future<void> createClass(ClassEntity classModel);
  Future<void> updateClass(String classId, ClassEntity classModel);
  Future<void> deleteClass(String classId);
  Future<void> enrollStudent(String classId, String studentId);
  Future<void> unenrollStudent(String classId, String studentId);
}
