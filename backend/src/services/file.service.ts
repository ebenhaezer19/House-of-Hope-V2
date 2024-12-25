import path from 'path'
import fs from 'fs'
import { UploadedFile } from '../types/file.types'

export class FileService {
  private uploadDir: string

  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads')
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadedFile> {
    try {
      const filename = `${Date.now()}-${file.originalname}`
      const filepath = path.join(this.uploadDir, filename)
      
      // Write file
      await fs.promises.writeFile(filepath, file.buffer)
      
      return {
        originalname: file.originalname,
        filename,
        path: `/uploads/${filename}`,
        mimetype: file.mimetype
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Gagal mengupload file')
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const filepath = path.join(this.uploadDir, filename)
      if (fs.existsSync(filepath)) {
        await fs.promises.unlink(filepath)
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      throw new Error('Gagal menghapus file')
    }
  }
} 