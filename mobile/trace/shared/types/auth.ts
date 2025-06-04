import { User } from "@/domain/entities/User";

export type RoutePath =
    | '/login'
    | '/'
    | '/student/(tabs)/dashboard'
    | '/(lecturer)/dashboard'
    | '/(admin)/dashboard';

export interface UseAuthGuardOptions {
    redirectTo?: RoutePath;
    requireAuth?: boolean;
}

export interface UseRoleGuardOptions {
    allowedRoles: User['role'][];
    redirectTo?: RoutePath;
}