export interface IHealthCheckResponse {
    status: 'ok' | 'error';
    timestamp: string;
    uptime: number;
    environment: string;
    version: string;
    services: {
        database: boolean;
        redis?: boolean;
        email?: boolean;
    };
} 