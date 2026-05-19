import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { appStore } from '../utils/store'
import { getDb, saveDb } from '../database'

const wallpaper = require('wallpaper')

export class WallpaperService {
  private static get wallpaperDir(): string {
    const dir = join(app.getPath('userData'), 'Wallpaper')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    return dir
  }

  static async setWallpaper(buffer: Buffer, postId: number, cropMethod: 'face' | 'center' | 'fill' = 'center'): Promise<string> {
    const filePath = join(this.wallpaperDir, `${postId}.jpg`)
    writeFileSync(filePath, buffer)

    await wallpaper.set(filePath)

    const old = appStore.get('wallpaperCurrentId') as string
    if (old) {
      const db = getDb()
      db.run('INSERT OR IGNORE INTO wallpaper_records (post_id, file_path, created_at) VALUES (?, ?, ?)', [
        old, join(this.wallpaperDir, `${old}.jpg`), new Date().toISOString()
      ])
      saveDb()
    }
    appStore.set('wallpaperCurrentId', String(postId))
    return String(postId)
  }

  static async undo(): Promise<boolean> {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM wallpaper_records ORDER BY created_at DESC LIMIT 1')
    const record = stmt.getAsObject() as any
    stmt.free()
    if (!record || !record.id || !existsSync(record.file_path)) return false
    await wallpaper.set(record.file_path)
    db.run('DELETE FROM wallpaper_records WHERE id = ?', [record.id])
    saveDb()
    appStore.set('wallpaperCurrentId', String(record.post_id))
    return true
  }

  static getHistory(): unknown[] {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM wallpaper_records ORDER BY created_at DESC LIMIT 20')
    const rows: unknown[] = []
    while (stmt.step()) rows.push(stmt.getAsObject())
    stmt.free()
    return rows
  }
}
