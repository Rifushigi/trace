import { TextInputProps, TextStyle, ViewStyle } from "react-native";


export interface InputProps extends TextInputProps {
    label?: string;
    error?: string | null;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
    errorStyle?: TextStyle;
}