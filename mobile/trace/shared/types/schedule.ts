export type FilterType = 'date' | 'lecturer' | 'location';

export interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    selectedFilter: FilterType | null;
    uniqueValues: {
        dates: string[];
        lecturers: string[];
        locations: string[];
    };
    tempFilters: {
        date: string[];
        lecturer: string[];
        location: string[];
    };
    onFilterSelect: (type: FilterType, value: string) => void;
    onDone: () => void;
    onClear: () => void;
}