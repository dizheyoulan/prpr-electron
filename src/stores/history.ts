import { defineStore } from 'pinia'

export interface HistoryItem {
  id: number
  preview_url: string
  sample_url: string
  timestamp: number
}

export const useHistoryStore = defineStore('history', {
  state: () => ({
    wallpaperHistory: [] as HistoryItem[]
  }),

  actions: {
    async loadHistory() {
      const history = await window.api.settings.get('wallpaperHistory')
      if (history && Array.isArray(history)) {
        this.wallpaperHistory = history
      }
    },

    async addHistory(item: Omit<HistoryItem, 'timestamp'>) {
      const newItem: HistoryItem = {
        ...item,
        timestamp: Date.now()
      }

      // 移除已存在的相同 ID
      this.wallpaperHistory = this.wallpaperHistory.filter(h => h.id !== item.id)
      
      // 添加到最前面
      this.wallpaperHistory.unshift(newItem)

      // 保留 20 条
      if (this.wallpaperHistory.length > 20) {
        this.wallpaperHistory = this.wallpaperHistory.slice(0, 20)
      }

      // 保存到本地存储
      await window.api.settings.set('wallpaperHistory', JSON.parse(JSON.stringify(this.wallpaperHistory)))
    },

    isDuplicate(id: number): boolean {
      return this.wallpaperHistory.some(h => h.id === id)
    }
  }
})
