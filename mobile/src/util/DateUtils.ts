export function datesEqual(date: Date, date2: Date): boolean {
    return date.getDay() === date2.getDay() && date.getMonth() === date2.getMonth() && date.getFullYear() === date2.getFullYear();
}