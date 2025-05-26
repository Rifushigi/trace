import React from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';

export default observer(function SystemSettingsScreen() {
    const { settingsStore } = useStores();

    return (
        <View>
            <Text>System Settings</Text>
        </View>
    );
}); 