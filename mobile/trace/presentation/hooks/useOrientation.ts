import { OrientationState } from '@/shared/types/orientation';
import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';


export const useOrientation = () => {
    const [state, setState] = useState<OrientationState>(() => {
        const dimensions = Dimensions.get('window');
        const orientation = dimensions.width < dimensions.height ? 'portrait' : 'landscape';

        return {
            orientation,
            isPortrait: orientation === 'portrait',
            isLandscape: orientation === 'landscape',
            dimensions,
        };
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            const orientation = window.width < window.height ? 'portrait' : 'landscape';

            setState({
                orientation,
                isPortrait: orientation === 'portrait',
                isLandscape: orientation === 'landscape',
                dimensions: window,
            });
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return {
        // State
        orientation: state.orientation,
        isPortrait: state.isPortrait,
        isLandscape: state.isLandscape,
        dimensions: state.dimensions,
    };
}; 