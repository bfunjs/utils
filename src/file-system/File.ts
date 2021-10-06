import { resolve, join, dirname } from 'path';
import * as fs from 'fs';
import * as vfs from 'vinyl-fs';
// @ts-ignore
import * as map from 'map-stream';
import * as rimraf from 'rimraf';

export enum FileType {
    ALL,
    FILE,
    DIR,
}

export interface ICopyOptions {
    glob?: string;
    mode?: number | string;
    dot?: boolean;
    overwrite?: boolean;
}

export interface IFile {
    exists(): boolean;

    isFile(): boolean;

    isDirectory(): boolean;

    createIfNotExists(options: any): Promise<boolean>;

    moveTo(dist: string, options: ICopyOptions): Promise<boolean>;

    copyTo(dist: string, options: ICopyOptions): Promise<boolean>;

    delete(): Promise<boolean>;

    list(type: FileType): Promise<string[]>;

    each(glob: string | string[], fn: (file: any, cb: () => void) => any, args: { [key: string]: any }): Promise<any>;
}

function mkdir(path: string, mode: number, callback: any) {
    if (fs.existsSync(path)) {
        return callback(path);
    }
    mkdir(dirname(path), mode, function () {
        fs.mkdir(path, mode, callback);
    });
}

export class File implements IFile {
    path: string = '';
    stats: fs.Stats;

    constructor(filename: string = '') {
        this.path = resolve(filename);
    }

    getStats(): fs.Stats {
        if (!this.stats) {
            try {
                this.stats = fs.lstatSync(this.path);
            } catch (e) {
            }
        }
        return this.stats;
    }

    createIfNotExists(options = { mode: 0o777 }): Promise<boolean> {
        const { mode } = options;
        return new Promise((resolve) => {
            const OK = true;
            if (this.exists()) {
                resolve(OK);
                return true;
            }
            try {
                mkdir(this.path, mode, function () {
                    resolve(OK);
                });
            } catch (e) {
                resolve(!OK);
            }
        });
    }

    exists(): boolean {
        return fs.existsSync(this.path);
    }

    isDirectory(): boolean {
        try {
            return this.getStats().isDirectory();
        } catch (e) {
            return false;
        }
    }

    isFile(): boolean {
        try {
            return this.getStats().isFile();
        } catch (e) {
            return false;
        }
    }

    copyTo(dist: string, options: ICopyOptions): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const { glob = '**/*', ...args } = options || {};
            vfs.src(glob, { cwd: this.path, dot: true, ...args })
                .pipe(vfs.dest(dist, { ...args }))
                .on('end', () => {
                    resolve(true);
                })
                .on('error', (e: any) => {
                    reject(e);
                });
        });
    }

    moveTo(dist: string, options: ICopyOptions): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const { overwrite } = options || {};
            const file = new File(dist);
            if (file.exists()) {
                if (!overwrite) {
                    reject('directory already exists');
                    return;
                }
                await file.delete();
            }

            fs.rename(this.path, dist, function (e) {
                if (e) return reject(e);
                resolve(false);
            });
        });
    }

    list(type: FileType = FileType.ALL): Promise<string[]> {
        return new Promise(resolve => {
            const dirArr = fs.readdirSync(this.path);
            switch (type) {
                case FileType.DIR:
                    resolve(dirArr.filter(name => {
                        const stats = fs.lstatSync(join(this.path, name));
                        return stats && stats.isDirectory();
                    }));
                    break;
                case FileType.FILE:
                    resolve(dirArr.filter(name => {
                        const stats = fs.lstatSync(join(this.path, name));
                        return stats && stats.isFile();
                    }));
                    break;
                case FileType.ALL:
                default:
                    resolve(dirArr);
            }
        });
    }

    each(glob: string | string[] = '*', fn: (file: any, cb: () => void) => any, args: { [key: string]: any } = {}): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof fn === 'function' && this.isDirectory()) {
                vfs.src(glob, { dot: true, cwd: this.path, ...args })
                    .pipe(map(fn))
                    .on('end', () => {
                        resolve();
                    })
                    .on('error', (e: any) => {
                        reject(e);
                    });
            } else {
                resolve();
            }
        });
    }

    async delete(): Promise<boolean> {
        if (this.isFile()) {
            fs.unlinkSync(this.path);
            return true;
        }
        return new Promise((resolve, reject) => {
            try {
                rimraf(this.path, (e: Error) => {
                    if (e) reject(e);
                    resolve(true);
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}
