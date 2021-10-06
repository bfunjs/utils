export function log(...args: any[]) {
    if (process.env.DEBUG) {
        console.log.apply(this, arguments);
    }
}

export function error(...args: any[]) {
    if (process.env.DEBUG) {
        console.error.apply(this, arguments);
    }
}

export function report() {
    // todo
}
