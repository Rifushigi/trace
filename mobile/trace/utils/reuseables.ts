import { colors } from "@/shared/constants/theme";

export const getStatusColor = (status: 'active' | 'upcoming' | 'completed'): string => {
    switch (status) {
        case 'active': return '#10B981';
        case 'upcoming': return colors.warning;
        default: return colors.textSecondary;
    }
};
