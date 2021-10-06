import { string2Seconds } from '../mapper';

let defaultDomain: string = '';
if (typeof location === 'object') {
    defaultDomain = location.hostname || '';
}

interface ISetOptions {
    domain?: string,
    expires?: string,
}

class Cookie {
    protected __cookie__: string;
    protected __defaultOptions__: ISetOptions;

    constructor(cookie?: string) {
        this.__cookie__ = '';
        this.__defaultOptions__ = {
            expires: 'd7',
            domain: defaultDomain,
        }
        if (typeof cookie === 'string') {
            this.__cookie__ = cookie || ''
        }
    }

    setDefaultOptions(options: ISetOptions = {}) {
        this.__defaultOptions__ = Object.assign(this.__defaultOptions__, options);
    }

    get(name: string): null | string {
        const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        const arr = this.__cookie__.match(reg);
        if (arr) return unescape(arr[2]);
        return null;
    }

    set(name: string, value: string, { domain, expires }: ISetOptions): string {
        expires = expires === undefined ? 'd7' : expires;
        domain = domain ? domain : this.__defaultOptions__.domain;
        let second = string2Seconds(expires);
        let expire = new Date();
        expire.setTime(expire.getTime() + second);
        this.__cookie__ = `${name}=${encodeURIComponent(value)};expires=${expire.toUTCString()};path=/;domain=${domain}`;
        return this.__cookie__;
    }

    del(name: string): string {
        const val = this.get(name);
        if (val !== null) {
            const exp = new Date();
            exp.setTime(exp.getTime() - 1);
            this.__cookie__ = `${name}=${val};expires=${exp.toUTCString()};path=/;domain=${this.__defaultOptions__.domain}`;
        }
        return this.__cookie__;
    }
}

export default Cookie;
