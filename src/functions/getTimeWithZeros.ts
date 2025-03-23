export function getTimeWithZeros(time: Date): string {
    return `${("0" + (time?.getHours())).slice(-2)}:${("0" + time?.getMinutes()).slice(-2)}`
}