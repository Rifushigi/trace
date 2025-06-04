export interface NetworkState {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    type: string;
    isWifi: boolean;
    isCellular: boolean;
    isEthernet: boolean;
    isBluetooth: boolean;
    isVpn: boolean;
    isOther: boolean;
}