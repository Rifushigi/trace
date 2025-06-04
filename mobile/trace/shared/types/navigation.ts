// Define route types based on the actual routes in the app
export type RoutePath =
    | '/'
    | '/login'
    | '/register'
    | '/student/(tabs)/dashboard'
    | '/(lecturer)/dashboard'
    | '/(admin)/dashboard'
    | '/dashboard'
    | '/(auth)/login'
    | '/(auth)/register'
    | '/(profile)'
    | '/(settings)'
    | '/student/dashboard';

// Define route params types that match expo-router's expected types
export interface RouteParams {
    [key: string]: string | number | (string | number)[] | null | undefined;
}

export interface DeepLinkConfig {
    path: RoutePath;
    params?: Record<string, string>;
}

export interface DeepLinkHandler {
    pattern: string | RegExp;
    handler: (url: string) => DeepLinkConfig | null;
}
