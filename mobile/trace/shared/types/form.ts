import { AppError } from "../errors/AppError";

export interface ValidationRule {
    validate: (value: any) => boolean;
    message: string;
}

export interface FormField<T> {
    value: T;
    error: string | null;
    rules?: ValidationRule[];
}

export type FormState<T> = {
    [K in keyof T]: FormField<T[K]>;
};

export interface UseFormOptions<T, S> {
    store: S;
    action: (store: S, values: T) => Promise<void>;
    initialValues: T;
    validationRules?: {
        [K in keyof T]?: ValidationRule[];
    };
    onSuccess?: () => void;
    onError?: (error: AppError) => void;
}
