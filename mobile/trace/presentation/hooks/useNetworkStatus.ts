import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';
import { NetworkState } from '@/shared/types/network';

export const useNetworkStatus = () => {
    const [state, setState] = useState<NetworkState>(() => ({
        isConnected: true,
        isInternetReachable: true,
        type: 'unknown',
        isWifi: false,
        isCellular: false,
        isEthernet: false,
        isBluetooth: false,
        isVpn: false,
        isOther: false,
    }));

    useEffect(() => {
        let subscription: NetInfoSubscription;

        const setupNetInfo = async () => {
            // Get initial state
            const initialState = await NetInfo.fetch();
            updateState(initialState);

            // Subscribe to changes
            subscription = NetInfo.addEventListener(updateState);
        };

        setupNetInfo();

        return () => {
            if (subscription) {
                subscription();
            }
        };
    }, []);

    const updateState = (netInfo: NetInfoState) => {
        const { isConnected, isInternetReachable, type } = netInfo;

        setState({
            isConnected: isConnected ?? false,
            isInternetReachable: isInternetReachable ?? false,
            type: type,
            isWifi: type === 'wifi',
            isCellular: type === 'cellular',
            isEthernet: type === 'ethernet',
            isBluetooth: type === 'bluetooth',
            isVpn: type === 'vpn',
            isOther: !['wifi', 'cellular', 'ethernet', 'bluetooth', 'vpn', 'unknown'].includes(type),
        });
    };

    return {
        // State
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isWifi: state.isWifi,
        isCellular: state.isCellular,
        isEthernet: state.isEthernet,
        isBluetooth: state.isBluetooth,
        isVpn: state.isVpn,
        isOther: state.isOther,
    };
}; 