import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
    AppError, 
    ServerError, 
    NetworkError, 
    AuthError, 
    ValidationError,
    NotFoundError,
    RepositoryError 
} from '@/shared/errors/AppError';
import { handleError } from '@/shared/errors/errorHandler';
import { colors } from '@/shared/constants/theme';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: AppError) => void;
}

interface State {
    error: AppError | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: unknown): State {
        return { error: handleError(error) };
    }

    componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
        const appError = handleError(error);
        console.error('Error caught by boundary:', appError, errorInfo);
        this.props.onError?.(appError);
    }

    handleRetry = () => {
        this.setState({ error: null });
    };

    renderErrorContent() {
        const { error } = this.state;
        if (!error) return null;

        let actionButton = null;
        let errorColor = colors.error;

        // Handle different error types
        if (error instanceof NetworkError) {
            actionButton = (
                <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                    <Text style={styles.buttonText}>Check Connection</Text>
                </TouchableOpacity>
            );
            errorColor = colors.warning;
        } else if (error instanceof AuthError) {
            actionButton = (
                <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                    <Text style={styles.buttonText}>Login Again</Text>
                </TouchableOpacity>
            );
        } else if (error instanceof ServerError || error instanceof RepositoryError) {
            actionButton = (
                <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                    <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.container}>
                <Text style={[styles.title, { color: errorColor }]}>
                    {this.getErrorTitle(error)}
                </Text>
                <Text style={styles.message}>{error.message}</Text>
                {error instanceof RepositoryError && (
                    <Text style={styles.details}>
                        Repository: {error.repository}
                        {'\n'}
                        Operation: {error.operation}
                    </Text>
                )}
                {actionButton}
            </View>
        );
    }

    getErrorTitle(error: AppError): string {
        if (error instanceof NetworkError) return 'Connection Error';
        if (error instanceof AuthError) return 'Authentication Error';
        if (error instanceof ValidationError) return 'Validation Error';
        if (error instanceof NotFoundError) return 'Not Found';
        if (error instanceof ServerError) return 'Server Error';
        if (error instanceof RepositoryError) return 'Data Error';
        return 'Something Went Wrong';
    }

    render() {
        if (this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return this.renderErrorContent();
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: colors.text,
    },
    details: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        color: colors.textSecondary,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
}); 