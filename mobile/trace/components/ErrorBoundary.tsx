import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppError, ServerError } from '../domain/errors/AppError';
import { handleError } from '../utils/errorHandler';

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

    render() {
        if (this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Oops! Something went wrong</Text>
                    <Text style={styles.message}>{this.state.error.message}</Text>
                    {this.state.error instanceof ServerError && (
                        <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    )}
                </View>
            );
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
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 