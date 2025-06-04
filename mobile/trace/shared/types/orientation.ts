import { ScaledSize } from "react-native";

export type Orientation = 'portrait' | 'landscape';

export interface OrientationState {
    orientation: Orientation;
    isPortrait: boolean;
    isLandscape: boolean;
    dimensions: ScaledSize;
}