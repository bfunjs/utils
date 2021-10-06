// @ts-ignore
import { conf, rs, form_up, auth, zone } from 'qiniu';
import { IDefaultOptions, Uploader } from './interface';

export class QiNiu extends Uploader {
    mac: any;
    client: any;

    constructor(options: IDefaultOptions) {
        super(options);
        const { ACCESS_KEY, SECRET_KEY, region = 'Zone_z0' } = this.options;
        this.mac = new auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
        const config: any = new conf.Config();
        // @ts-ignore
        config.zone = zone[region];
        this.client = new form_up.FormUploader(config);
    }

    generateToken(key: string) {
        const { bucket } = this.options
        let putPolicy = new rs.PutPolicy({
            scope: bucket + ':' + key
        });
        return putPolicy.uploadToken(this.mac);
    }

    async uploadFile(localFile: string, cloudFile: string, options: any = {}): Promise<any> {
        const extra = new form_up.PutExtra();
        const token = options.token ? options.token : this.generateToken(cloudFile);

        return new Promise(resolve => {
            const { debug } = this.options;
            this.client.putFile(token, cloudFile, localFile, extra, function (err: any, ret: any = {}) {
                if (ret == null) ret = {};
                const result: any = {
                    status: !err,
                    data: {
                        key: ret.key,
                        hash: ret.hash
                    },
                    error: err,
                    response: ret,
                };

                if (debug) {
                    if (result.status) console.log('upload', localFile, '->', cloudFile, 'succeed');
                    else console.error('upload', localFile, '->', cloudFile, 'failed');
                }
                resolve(result);
            });
        });
    }
}
