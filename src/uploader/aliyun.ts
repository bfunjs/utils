// @ts-ignore
import * as AliOss from 'ali-oss';
import { IDefaultOptions, Uploader } from './interface';

export class AliYun extends Uploader {
    client: any;

    constructor(options: IDefaultOptions) {
        super(options);
        const { ACCESS_KEY, SECRET_KEY, bucket, region = 'oss-cn-shanghai', endpoint } = this.options;

        this.client = new AliOss({
            accessKeyId: ACCESS_KEY,
            accessKeySecret: SECRET_KEY,
            region,
            bucket,
            endpoint,
        });
    }

    async uploadFile(localFile: string, cloudFile: string, options: any = {}): Promise<any> {
        const { debug } = this.options;
        const result = {
            status: false,
            data: { key: undefined, hash: undefined },
            error: null,
            response: null,
        };
        try {
            const ret = await this.client.put(cloudFile, localFile);
            const { res } = ret || {};
            result.status = res.status === 200 && res.statusCode === 200;
            result.response = res;
            if (result.status) {
                // @ts-ignore
                result.data.key = cloudFile;
                result.data.hash = res.headers['content-md5'];
            }

            if (debug) {
                if (result.status) console.log('upload', localFile, '->', cloudFile, 'succeed');
                else console.error('upload', localFile, '->', cloudFile, 'failed');
            }
        } catch (e) {
            console.log(e);
        }
        return result;
    }
}
