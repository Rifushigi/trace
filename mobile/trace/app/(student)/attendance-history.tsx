import React from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';

export default observer(function AttendanceHistoryScreen() {
    const { attendanceStore } = useStores();

    return (
        <View>
            <Text>Attendance History</Text>
        </View>
    );
}); 