import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/constants/validation_constants.dart';
import '../../providers/profile_provider.dart';
import '../../data/models/profile_model.dart';
import '../../../../common/shared_widgets/loading_overlay.dart';
import '../../../../common/shared_widgets/toast.dart';
import '../../../../common/shared_widgets/skeleton_loading.dart';

class LecturerProfileScreen extends ConsumerStatefulWidget {
  const LecturerProfileScreen({super.key});

  @override
  ConsumerState<LecturerProfileScreen> createState() => _LecturerProfileScreenState();
}

class _LecturerProfileScreenState extends ConsumerState<LecturerProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _staffIdController;
  late TextEditingController _collegeController;
  late TextEditingController _departmentController;
  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    _firstNameController = TextEditingController();
    _lastNameController = TextEditingController();
    _staffIdController = TextEditingController();
    _collegeController = TextEditingController();
    _departmentController = TextEditingController();
    _loadProfile();
  }

  void _loadProfile() {
    final profile = ref.read(profileProvider).value;
    if (profile != null) {
      _firstNameController.text = profile.firstName;
      _lastNameController.text = profile.lastName;
      _staffIdController.text = profile.staffId ?? '';
      _collegeController.text = profile.college ?? '';
      _departmentController.text = profile.department ?? '';
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _staffIdController.dispose();
    _collegeController.dispose();
    _departmentController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        await ref.read(profileProvider.notifier).uploadAvatar(pickedFile.path);
        if (mounted) {
          Toast.show(
            context,
            message: 'Profile picture updated successfully',
            type: ToastType.success,
          );
        }
      }
    } catch (e) {
      if (mounted) {
        Toast.show(
          context,
          message: 'Failed to update profile picture: $e',
          type: ToastType.error,
        );
      }
    }
  }

  Future<void> _saveProfile() async {
    if (_formKey.currentState?.validate() ?? false) {
      try {
        final currentProfile = ref.read(profileProvider).value;
        if (currentProfile != null) {
          final updatedProfile = currentProfile.copyWith(
            firstName: _firstNameController.text,
            lastName: _lastNameController.text,
            staffId: _staffIdController.text,
            college: _collegeController.text,
            department: _departmentController.text,
          );
          await ref.read(profileProvider.notifier).updateProfile(updatedProfile);
          setState(() => _isEditing = false);
          if (mounted) {
            Toast.show(
              context,
              message: 'Profile updated successfully',
              type: ToastType.success,
            );
          }
        }
      } catch (e) {
        if (mounted) {
          Toast.show(
            context,
            message: 'Failed to update profile: $e',
            type: ToastType.error,
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final profileState = ref.watch(profileProvider);

    return LoadingOverlay(
      isLoading: profileState.isLoading,
      message: _isEditing ? 'Saving profile...' : 'Loading profile...',
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Profile'),
          actions: [
            if (!_isEditing)
              IconButton(
                icon: const Icon(Icons.edit),
                onPressed: () => setState(() => _isEditing = true),
              )
            else
              IconButton(
                icon: const Icon(Icons.save),
                onPressed: _saveProfile,
              ),
          ],
        ),
        body: profileState.when(
          data: (profile) {
            if (profile == null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Profile not found'),
                    SizedBox(height: AppConstants.defaultPadding),
                    ElevatedButton(
                      onPressed: _loadProfile,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              );
            }
            return SingleChildScrollView(
              padding: EdgeInsets.all(AppConstants.defaultPadding),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundImage: profile.avatar != null
                              ? NetworkImage(profile.avatar!)
                              : null,
                          child: profile.avatar == null
                              ? const Icon(Icons.person, size: 50)
                              : null,
                        ),
                        if (_isEditing)
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: CircleAvatar(
                              backgroundColor: Theme.of(context).primaryColor,
                              child: IconButton(
                                icon: const Icon(Icons.camera_alt, color: Colors.white),
                                onPressed: _pickImage,
                              ),
                            ),
                          ),
                      ],
                    ),
                    SizedBox(height: AppConstants.defaultPadding * 2),
                    TextFormField(
                      controller: _firstNameController,
                      decoration: const InputDecoration(
                        labelText: 'First Name',
                        border: OutlineInputBorder(),
                      ),
                      enabled: _isEditing,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        if (!ValidationConstants.isValidName(value)) {
                          return ValidationConstants.invalidName;
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: AppConstants.defaultPadding),
                    TextFormField(
                      controller: _lastNameController,
                      decoration: const InputDecoration(
                        labelText: 'Last Name',
                        border: OutlineInputBorder(),
                      ),
                      enabled: _isEditing,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        if (!ValidationConstants.isValidName(value)) {
                          return ValidationConstants.invalidName;
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: AppConstants.defaultPadding),
                    TextFormField(
                      controller: _staffIdController,
                      decoration: const InputDecoration(
                        labelText: 'Staff ID',
                        border: OutlineInputBorder(),
                      ),
                      enabled: _isEditing,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        if (!ValidationConstants.isValidStaffId(value)) {
                          return ValidationConstants.invalidStaffId;
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: AppConstants.defaultPadding),
                    TextFormField(
                      controller: _collegeController,
                      decoration: const InputDecoration(
                        labelText: 'College',
                        border: OutlineInputBorder(),
                      ),
                      enabled: _isEditing,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: AppConstants.defaultPadding),
                    TextFormField(
                      controller: _departmentController,
                      decoration: const InputDecoration(
                        labelText: 'Department',
                        border: OutlineInputBorder(),
                      ),
                      enabled: _isEditing,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return ValidationConstants.requiredField;
                        }
                        return null;
                      },
                    ),
                  ],
                ),
              ),
            );
          },
          loading: () => SingleChildScrollView(
            padding: EdgeInsets.all(AppConstants.defaultPadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SkeletonLoading(
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                ),
                SizedBox(height: AppConstants.defaultPadding * 2),
                SkeletonList(
                  itemCount: 5,
                  itemHeight: 60,
                  spacing: AppConstants.defaultPadding,
                ),
              ],
            ),
          ),
          error: (error, stack) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Error: $error'),
                SizedBox(height: AppConstants.defaultPadding),
                ElevatedButton(
                  onPressed: _loadProfile,
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
} 