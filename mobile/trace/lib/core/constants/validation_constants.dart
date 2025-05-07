/// Constants used for input validation throughout the app
class ValidationConstants {
  // Regular Expressions
  static final RegExp emailRegex = RegExp(
    r'^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+',
  );

  static final RegExp passwordRegex = RegExp(
    r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$',
  );

  static final RegExp matricNumberRegex = RegExp(
    r'^BU\d{2}[A-Z]{3}\d{4}$',
  );

  static final RegExp staffIdRegex = RegExp(
    r'^[A-Z]{2}\d{6}$',
  );

  static final RegExp nameRegex = RegExp(
    r'^[a-zA-Z\s]{2,50}$',
  );

  // Error Messages
  static const String invalidEmail = 'Please enter a valid email address';
  static const String invalidPassword =
      'Password must be at least 8 characters long';
  static const String invalidMatricNumber =
      'Please enter a valid matric number (e.g., BU20CSC1001)';
  static const String invalidStaffId = 'Please enter a valid staff ID';
  static const String invalidName = 'Please enter a valid name';
  static const String requiredField = 'This field is required';
  static const String passwordMismatch = 'Passwords do not match';
  static const String invalidOtp = 'Please enter a valid 6-digit OTP';

  // Length Constraints
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 50;
  static const int minNameLength = 2;
  static const int maxNameLength = 50;
  static const int otpLength = 6;
  static const int maxEmailLength = 100;

  // Helper method to validate email
  static bool isValidEmail(String email) {
    return emailRegex.hasMatch(email);
  }

  // Helper method to validate password
  static bool isValidPassword(String password) {
    return password.length >= 8;
  }

  // Helper method to validate matric number
  static bool isValidMatricNumber(String matricNumber) {
    return matricNumberRegex.hasMatch(matricNumber);
  }

  // Helper method to validate staff ID
  static bool isValidStaffId(String staffId) {
    return staffId.length >= 4;
  }

  // Helper method to validate name
  static bool isValidName(String name) {
    return name.length >= 2 && nameRegex.hasMatch(name);
  }
}
