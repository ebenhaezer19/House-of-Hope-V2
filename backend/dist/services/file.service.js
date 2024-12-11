"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_s3_2 = require("@aws-sdk/client-s3");
const storage_config_1 = require("../config/storage.config");
class FileService {
    constructor() {
        this.s3Client = new client_s3_1.S3Client({
            region: storage_config_1.storageConfig.region,
            credentials: {
                accessKeyId: storage_config_1.storageConfig.accessKeyId || '',
                secretAccessKey: storage_config_1.storageConfig.secretAccessKey || ''
            }
        });
    }
    async uploadFile(file) {
        if (!storage_config_1.storageConfig.bucket) {
            throw new Error('AWS bucket is not configured');
        }
        const upload = new lib_storage_1.Upload({
            client: this.s3Client,
            params: {
                Bucket: storage_config_1.storageConfig.bucket,
                Key: `documents/${Date.now()}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
            }
        });
        const result = await upload.done();
        return {
            url: `https://${storage_config_1.storageConfig.bucket}.s3.${storage_config_1.storageConfig.region}.amazonaws.com/${result.Key}`,
            key: result.Key
        };
    }
    async deleteFile(key) {
        if (!storage_config_1.storageConfig.bucket) {
            throw new Error('AWS bucket is not configured');
        }
        await this.s3Client.send(new client_s3_2.DeleteObjectCommand({
            Bucket: storage_config_1.storageConfig.bucket,
            Key: key
        }));
    }
}
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map