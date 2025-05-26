import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: {
        token: string;
    };
};

export type MainStackParamList = {
    Home: undefined;
    Profile: undefined;
    EditProfile: undefined;
    Settings: undefined;
    Student: {
        screen?: keyof StudentStackParamList;
        params?: any;
    };
    DeviceSetup: undefined;
    ClassManagement: undefined;
    UserManagement: undefined;
};

export type StudentStackParamList = {
    Dashboard: undefined;
    AttendanceStatus: undefined;
    Schedule: undefined;
    ClassDetails: { classId: string };
    AttendanceHistory: undefined;
    StudentProfile: undefined;
    DeviceSetup: undefined;
    StudentSettings: undefined;
};

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainNavigationProp = NativeStackNavigationProp<MainStackParamList>;
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
    AuthStackParamList,
    T
>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = NativeStackScreenProps<
    MainStackParamList,
    T
>;

export type StudentStackScreenProps<T extends keyof StudentStackParamList> = NativeStackScreenProps<
    StudentStackParamList,
    T
>; 