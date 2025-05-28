import React from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../stores';
import { Student } from '../../../domain/entities/User';

export default observer(function DeviceSetupScreen() {
    const { authStore } = useStores();
    const { user } = authStore.state;
    const student = user as Student;

    return (
        <View>
            <Text>Device Setup</Text>
            {student && (
                <View>
                    <Text>Face ID Status: {student.faceModelId ? 'Registered' : 'Not Registered'}</Text>
                    <Text>NFC Status: {student.nfcUid ? 'Registered' : 'Not Registered'}</Text>
                </View>
            )}
        </View>
    );
}); 