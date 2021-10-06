export function isEmpty(v: any): boolean {
    return [null, undefined].indexOf(v) !== -1;
}

export function toKvp(query: { [key: string]: any } = {}): string {
    return Object
        .keys(query)
        .filter(key => !isEmpty(query[key]))
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&');
}

export function encodeUrl(url: string = '', query: { [key: string]: any } = {}) {
    if (!url) return '';
    const search = toKvp(query);
    if (!search) return url;
    return url.indexOf('?') !== -1 ? `${url}&${search}` : `${url}?${search}`;
}
