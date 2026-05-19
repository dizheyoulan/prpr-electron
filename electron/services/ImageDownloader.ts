import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, createWriteStream } from 'fs'
import { appStore } from '../utils/store'

export class ImageDownloader {
  private static get downloadDir(): string {
    const customPath = appStore.get('downloadPath')
    const dir = customPath || join(app.getPath('downloads'))
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    return dir
  }

  static async save(buffer: Buffer, filename: string): Promise<string> {
    const filePath = join(this.downloadDir, filename)
    const writer = createWriteStream(filePath)
    return new Promise((resolve, reject) => {
      writer.write(buffer)
      writer.end()
      writer.on('finish', () => resolve(filePath))
      writer.on('error', reject)
    })
  }
}


