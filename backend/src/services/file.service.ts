import multer from 'multer'
import path from 'path'
import fs from 'fs'

export class FileService {
  private uploadDir: string

  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
    }
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const filename = `${Date.now()}-${file.originalname}`
      const filepath = path.join(this.uploadDir, filename)
      
      await fs.promises.writeFile(filepath, file.buffer)
      
      return {
        filename,
        url: `/uploads/${filename}`,
        mimetype: file.mimetype
      }
    } catch (error) {
      console.error('File upload failed:', error)
      throw error
    }
  }
} 