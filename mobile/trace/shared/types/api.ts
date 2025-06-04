export interface UseApiOptions<T, S> {
    store: S;
    action: (store: S) => (...args: any[]) => Promise<T>;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    showErrorAlert?: boolean;
}