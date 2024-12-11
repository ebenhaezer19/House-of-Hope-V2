import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { storageConfig } from '../config/storage.config'

export class FileService {
  private s3Client: S3Client

  constructor() {
    this.s3Client = new S3Client({
      region: storageConfig.region,
      credentials: {
        accessKeyId: storageConfig.accessKeyId || '',
        secretAccessKey: storageConfig.secretAccessKey || ''
      }
    })
  }

  async uploadFile(file: Express.Multer.File) {
    if (!storageConfig.bucket) {
      throw new Error('AWS bucket is not configured')
    }

    // Upload ke S3 menggunakan multipart upload
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: storageConfig.bucket,
        Key: `documents/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      }
    })

    const result = await upload.done()

    return {
      url: `https://${storageConfig.bucket}.s3.${storageConfig.region}.amazonaws.com/${result.Key}`,
      key: result.Key
    }
  }

  async deleteFile(key: string) {
    if (!storageConfig.bucket) {
      throw new Error('AWS bucket is not configured')
    }

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: storageConfig.bucket,
        Key: key
      })
    )
  }
} 