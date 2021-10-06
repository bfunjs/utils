import { IDefaultOptions, Uploader } from './interface';

export class QCloud extends Uploader {
    constructor(options: IDefaultOptions) {
        super(options);
    }

    async uploadFile(localFile: string, cloudFile: string, options: any = {}): Promise<any> {
        return super.uploadFile(localFile, cloudFile, options);
    }
}
