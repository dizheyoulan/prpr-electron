import { defineStore } from 'pinia'
import { useSettingsStore } from './settings'
import { WallpaperManager } from '@/services/WallpaperManager'

export const useTaskStore = defineStore('task', {
  state: () => ({
    wallpaperTimer: null as number | null,
    lockscreenTimer: null as number | null
  }),

  actions: {
    init() {
      const settings = useSettingsStore()
      
      // 初始化时根据设置决定是否启动
      if (settings.wallpaperAutoUpdate) {
        this.startWallpaperTask()
      }
      
      if (settings.lockscreenAutoUpdate) {
        this.startLockscreenTask()
      }
    },

    startWallpaperTask() {
      this.stopWallpaperTask()
      const settings = useSettingsStore()
      const interval = settings.wallpaperUpdateInterval * 60 * 1000
      
      console.log(`[TaskStore] 启动壁纸更新任务，间隔: ${settings.wallpaperUpdateInterval} 分钟`)
      this.wallpaperTimer = window.setInterval(async () => {
        await WallpaperManager.applyWallpaper()
      }, interval)
    },

    stopWallpaperTask() {
      if (this.wallpaperTimer) {
        window.clearInterval(this.wallpaperTimer)
        this.wallpaperTimer = null
        console.log('[TaskStore] 壁纸更新任务已停止')
      }
    },

    startLockscreenTask() {
      this.stopLockscreenTask()
      const settings = useSettingsStore()
      const interval = settings.lockscreenUpdateInterval * 60 * 1000
      
      console.log(`[TaskStore] 启动锁屏更新任务，间隔: ${settings.lockscreenUpdateInterval} 分钟`)
      this.lockscreenTimer = window.setInterval(async () => {
        await WallpaperManager.applyLockscreen()
      }, interval)
    },

    stopLockscreenTask() {
      if (this.lockscreenTimer) {
        window.clearInterval(this.lockscreenTimer)
        this.lockscreenTimer = null
        console.log('[TaskStore] 锁屏更新任务已停止')
      }
    }
  }
})
