export function isWithinDays(dateToCheck: Date, days: number): boolean {
    const currentDate = new Date();
    const targetDate = new Date(currentDate);
    targetDate.setDate(currentDate.getDate() + days);
    return dateToCheck <= targetDate;
}