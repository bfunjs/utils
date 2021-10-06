export function string2Seconds(exp: string): number {
    let num: number = parseInt(exp.substring(1, exp.length));
    let str: string = exp.substring(0, 1);
    if (isNaN(num)) return 0;
    switch (str) {
        case 's':
            return num * 1000;
        case 'h':
            return num * 60 * 60 * 1000;
        case 'd':
            return num * 24 * 60 * 60 * 1000;
        default:
            return 0;
    }
}
