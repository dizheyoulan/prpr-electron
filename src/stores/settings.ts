import { defineStore } from 'pinia'
import type { AppSettings } from '@/types/ipc'

export const useSettingsStore = defineStore('settings', {
  state: (): AppSettings => ({
    theme: 'system',
    language: 'zh-CN',
    booruHost: 'https://yande.re',
    booruUsername: '',
    booruUserId: '',
    booruSafeMode: false,
    booruRatingFilter: [],
    wallpaperTags: '',
    wallpaperCropMethod: 'center',
    wallpaperQuality: 'sample',
    wallpaperAutoUpdate: false,
    wallpaperUpdateInterval: 60,
    wallpaperMinScore: 0,
    wallpaperRatings: ['s'],
    wallpaperLandscapeOnly: false,
    lockscreenTags: '',
    lockscreenAutoUpdate: false,
    lockscreenUpdateInterval: 60,
    downloadPath: '',
    browseMinScore: 0,
    browseRatings: ['s'],
    browseLandscapeOnly: false,
    browseExcludeTags: []
  }),

  actions: {
    async loadAll() {
      const all = await window.api.settings.getAll() as Partial<AppSettings>
      Object.assign(this.$state, all)
    },

    async save<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
      this.$state[key] = value
      // 序列化数组和对象以便通过 IPC 传递
      const serializedValue = Array.isArray(value) ? JSON.parse(JSON.stringify(value)) : value
      await window.api.settings.set(key, serializedValue)
    }
  }
})
