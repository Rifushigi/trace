# TRACE Mobile App Screens Documentation

## Common Screens (All Users)

### Authentication Flow
1. **Welcome Screen** (`screens/auth/WelcomeScreen.tsx`)
   - App logo and branding
   - Login button
   - Register button
   - Version information

2. **Login Screen** (`screens/auth/LoginScreen.tsx`)
   - Email input field
   - Password input field
   - "Remember me" toggle
   - Forgot password link
   - Login button
   - Error message display

3. **Forgot Password Screen** (`screens/auth/ForgotPasswordScreen.tsx`)
   - Email input
   - Submit button
   - Back to login link

4. **Reset Password Screen** (`screens/auth/ResetPasswordScreen.tsx`)
   - OTP input fields
   - New password input
   - Confirm password input
   - Reset button

### Profile Management
1. **Profile Screen** (`screens/profile/ProfileScreen.tsx`)
   - Profile picture
   - User information display
   - Edit profile button
   - Settings button
   - Logout button

2. **Edit Profile Screen** (`screens/profile/EditProfileScreen.tsx`)
   - Profile picture upload
   - First name input
   - Last name input
   - Email display (non-editable)
   - Save changes button

3. **Settings Screen** (`screens/settings/SettingsScreen.tsx`)
   - Notification preferences
   - Theme selection
   - Language selection
   - Privacy settings
   - About section
   - Version information

## Student-Specific Screens

### Main Flow
1. **Student Dashboard** (`screens/student/DashboardScreen.tsx`)
   - Today's schedule
   - Current class status
   - Attendance statistics
   - Quick access to upcoming classes
   - Notifications center

2. **Attendance Status** (`screens/student/AttendanceStatusScreen.tsx`)
   - Real-time attendance verification status
   - Face recognition status indicator
   - NFC status indicator
   - BLE connection status
   - Location verification status
   - Troubleshooting tips

3. **Schedule View** (`screens/student/ScheduleScreen.tsx`)
   - Weekly calendar view
   - Daily schedule list
   - Class details:
     - Course name
     - Lecturer name
     - Room number
     - Time slot
   - Filter options

4. **Class Details** (`screens/student/ClassDetailsScreen.tsx`)
   - Course information
   - Lecturer details
   - Schedule information
   - Attendance history for this class
   - Course materials section

5. **Attendance History** (`screens/student/AttendanceHistoryScreen.tsx`)
   - List of all classes
   - Attendance percentage
   - Filter by:
     - Date range
     - Course
     - Status
   - Detailed attendance records

6. **Student Profile** (`screens/student/StudentProfileScreen.tsx`)
   - Student-specific information:
     - Matric number
     - Program
     - Level
     - Academic status
   - Face ID registration status
   - Device registration status

### Settings & Configuration
1. **Device Setup** (`screens/student/DeviceSetupScreen.tsx`)
   - Face ID registration
   - NFC setup
   - BLE configuration
   - Location services setup
   - Permissions management

2. **Student Settings** (`screens/student/StudentSettingsScreen.tsx`)
   - Attendance notification preferences
   - Device configurations
   - Privacy settings
   - Help & support

## Lecturer-Specific Screens

### Main Flow
1. **Lecturer Dashboard** (`screens/lecturer/DashboardScreen.tsx`)
   - Today's classes
   - Active sessions
   - Quick actions
   - Recent activities
   - Class statistics

2. **Class Management** (`screens/lecturer/ClassManagementScreen.tsx`)
   - List of all classes
   - Class status indicators
   - Quick actions:
     - Start session
     - End session
     - View attendance

3. **Session Control** (`screens/lecturer/SessionControlScreen.tsx`)
   - Active session information
   - Real-time attendance count
   - Student list with status
   - Manual override options
   - Session settings
   - End session button

4. **Attendance Management** (`screens/lecturer/AttendanceManagementScreen.tsx`)
   - Student list
   - Attendance status indicators
   - Manual marking interface
   - Bulk actions
   - Search and filter options

5. **Class Details** (`screens/lecturer/ClassDetailsScreen.tsx`)
   - Course information
   - Student list
   - Attendance statistics
   - Session history
   - Export options

### Reports & Analytics
1. **Reports Dashboard** (`screens/lecturer/ReportsDashboardScreen.tsx`)
   - Overview statistics
   - Quick reports
   - Export options
   - Date range selection

2. **Detailed Reports** (`screens/lecturer/DetailedReportsScreen.tsx`)
   - Attendance patterns
   - Student performance
   - Custom report generation
   - Export functionality

3. **Student Analytics** (`screens/lecturer/StudentAnalyticsScreen.tsx`)
   - Individual student attendance
   - Performance metrics
   - Attendance patterns
   - Historical data

### Settings & Configuration
1. **Lecturer Settings** (`screens/lecturer/LecturerSettingsScreen.tsx`)
   - Session preferences
   - Notification settings
   - Report configurations
   - Default behaviors

## Admin-Specific Screens
(Only if admin functionality is needed in mobile app)

1. **Admin Dashboard** (`screens/admin/AdminDashboardScreen.tsx`)
   - System status
   - User statistics
   - Quick actions
   - Recent activities

2. **User Management** (`screens/admin/UserManagementScreen.tsx`)
   - User list
   - Role management
   - Account actions
   - Search and filter

## Shared Components

### Navigation
- Bottom Tab Navigator
- Stack Navigator for each flow
- Drawer Navigator for settings and additional options

### Common Components
1. **Headers**
   - Main header with title
   - Back navigation
   - Action buttons

2. **Loading States**
   - Loading spinners
   - Skeleton screens
   - Progress indicators

3. **Error States**
   - Error messages
   - Retry options
   - Offline indicators

4. **Modals**
   - Confirmation dialogs
   - Action sheets
   - Permission requests

5. **Lists**
   - Refreshable lists
   - Infinite scroll
   - Search functionality

## File Structure
```
src/
├── screens/
│   ├── auth/
│   ├── student/
│   ├── lecturer/
│   ├── admin/
│   ├── profile/
│   └── settings/
├── components/
│   ├── common/
│   ├── student/
│   ├── lecturer/
│   └── admin/
├── navigation/
├── services/
├── utils/
└── constants/
```

## Implementation Notes

1. **Navigation Flow**
   - Role-based navigation setup
   - Deep linking support
   - Screen transitions
   - Navigation guards

2. **State Management**
   - Authentication state
   - User preferences
   - App settings
   - Cache management

3. **API Integration**
   - Backend service integration
   - Real-time updates
   - Error handling
   - Offline support

4. **Security**
   - Biometric authentication
   - Secure storage
   - Token management
   - Session handling

5. **Performance**
   - Lazy loading
   - Image optimization
   - Cache strategies
   - Background processes 