import path from 'path'
import { promises as fs } from 'fs'
import { existsSync, mkdirSync } from 'fs'
import { UploadedFile } from '../types/file.types'

export class FileService {
  private uploadDir: string

  constructor() {
    this.uploadDir = path.resolve(__dirname, '../../uploads')
    console.log('Upload directory:', this.uploadDir)

    if (!existsSync(this.uploadDir)) {
      console.log('Creating uploads directory...')
      mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadedFile> {
    try {
      if (!file.buffer) {
        throw new Error('No file buffer provided')
      }

      const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const filepath = path.join(this.uploadDir, filename)
      
      console.log('Saving file to:', filepath)
      await fs.writeFile(filepath, file.buffer)
      
      return {
        filename,
        path: `/uploads/${filename}`,
        mimetype: file.mimetype,
        originalname: file.originalname
      }
    } catch (error) {
      console.error('File upload failed:', error)
      throw new Error('Gagal mengupload file')
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const filepath = path.join(this.uploadDir, filename)
      await fs.unlink(filepath)
    } catch (error) {
      console.error('File deletion failed:', error)
      throw new Error('Gagal menghapus file')
    }
  }
} 