export interface UseRefreshOptions {
    onRefresh: () => Promise<void>;
    initialRefreshing?: boolean;
}
