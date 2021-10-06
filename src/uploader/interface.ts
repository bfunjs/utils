import { join } from 'path';
import * as fs from 'fs';

export interface IDefaultOptions {
    debug?: boolean,
    ACCESS_KEY: string,
    SECRET_KEY: string,
    bucket?: string,
    region?: string,
    endpoint?: string,
}

export class Uploader {
    options: IDefaultOptions;

    constructor(options: IDefaultOptions) {
        const target = { debug: false };
        this.options = Object.assign(target, options);
    }

    async uploadFile(localFile: string, cloudFile: string, options: any = {}): Promise<any> {
        console.error('uploadFile function must be rewrite');
    }

    async uploadDir(dirPath: string, cdnPath: string = '') {
        if (cdnPath && cdnPath.length > 0) {
            if (cdnPath.startsWith('/')) cdnPath = cdnPath.slice(1);
            if (cdnPath.length > 0 && cdnPath.endsWith('/')) cdnPath = cdnPath.slice(0, cdnPath.length - 1);
        }
        const fileArr = fs.readdirSync(dirPath);
        for (let i = 0, l = fileArr.length; i < l; i++) {
            const filename = fileArr[i];
            const filepath = join(dirPath, filename);
            const stat = fs.statSync(filepath);
            if (stat) {
                const cloudFile = `${cdnPath}/${filename}`;
                if (stat.isFile()) {
                    await this.uploadFile(filepath, cloudFile);
                } else if (stat.isDirectory()) {
                    await this.uploadDir(filepath, cloudFile);
                }
            }
        }
    }
}
