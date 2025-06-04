import { useState, useCallback } from 'react';
import { AppError, ValidationError } from '@/shared/errors/AppError';
import { FormState, UseFormOptions } from '@/shared/types/form';

export const useForm = <T extends Record<string, any>, S>({
    store,
    action,
    initialValues,
    validationRules = {},
    onSuccess,
    onError,
}: UseFormOptions<T, S>) => {
    const [formState, setFormState] = useState<FormState<T>>(() => {
        const state: Partial<FormState<T>> = {};
        Object.keys(initialValues).forEach((key) => {
            state[key as keyof T] = {
                value: initialValues[key],
                error: null,
                rules: validationRules[key as keyof T],
            };
        });
        return state as FormState<T>;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const validateField = useCallback((key: keyof T, value: T[keyof T]) => {
        const field = formState[key];
        if (!field.rules) return null;

        for (const rule of field.rules) {
            if (!rule.validate(value)) {
                return rule.message;
            }
        }
        return null;
    }, [formState]);

    const setFieldValue = useCallback((key: keyof T, value: T[keyof T]) => {
        setFormState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                value,
                error: validateField(key, value),
            },
        }));
        // Clear form-level error when user starts typing
        setFormError(null);
    }, [validateField]);

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true);
        setFormError(null);

        try {
            // Validate all fields
            const values: Partial<T> = {};
            let hasErrors = false;

            Object.keys(formState).forEach((key) => {
                const field = formState[key as keyof T];
                const error = validateField(key as keyof T, field.value);
                values[key as keyof T] = field.value;

                if (error) {
                    hasErrors = true;
                    setFormState((prev) => ({
                        ...prev,
                        [key]: {
                            ...prev[key as keyof T],
                            error,
                        },
                    }));
                }
            });

            if (!hasErrors) {
                await action(store, values as T);
                onSuccess?.();
            }
        } catch (error) {
            const appError = error as AppError;

            // Handle validation errors
            if (appError instanceof ValidationError) {
                // If the error has details, it might contain field-specific errors
                if (appError.originalError && typeof appError.originalError === 'object') {
                    const details = appError.originalError as Record<string, string>;
                    Object.entries(details).forEach(([field, message]) => {
                        if (field in formState) {
                            setFormState((prev) => ({
                                ...prev,
                                [field]: {
                                    ...prev[field as keyof T],
                                    error: message,
                                },
                            }));
                        }
                    });
                }
            }

            // Set form-level error
            setFormError(appError.message);
            onError?.(appError);
        } finally {
            setIsSubmitting(false);
        }
    }, [formState, validateField, store, action, onSuccess, onError]);

    const resetForm = useCallback(() => {
        setFormState((prev) => {
            const newState: Partial<FormState<T>> = {};
            Object.keys(prev).forEach((key) => {
                newState[key as keyof T] = {
                    ...prev[key as keyof T],
                    value: initialValues[key as keyof T],
                    error: null,
                };
            });
            return newState as FormState<T>;
        });
        setFormError(null);
    }, [initialValues]);

    return {
        formState,
        setFieldValue,
        handleSubmit,
        resetForm,
        isSubmitting,
        formError,
    };
}; 