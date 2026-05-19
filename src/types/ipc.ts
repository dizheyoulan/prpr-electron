import type { ElectronAPI } from '../../electron/preload'

declare global {
  interface Window {
    api: ElectronAPI
  }
}

export type AppSettings = {
  theme: 'system' | 'light' | 'dark'
  language: string
  booruHost: string
  booruUsername: string
  booruUserId: string
  booruSafeMode: boolean
  booruRatingFilter: string[]
  wallpaperTags: string
  wallpaperCropMethod: 'face' | 'center' | 'fill'
  wallpaperQuality: 'sample' | 'original'
  wallpaperAutoUpdate: boolean
  wallpaperUpdateInterval: number
  wallpaperMinScore: number
  wallpaperRatings: Array<'s' | 'q' | 'e'>
  wallpaperLandscapeOnly: boolean
  lockscreenTags: string
  lockscreenAutoUpdate: boolean
  lockscreenUpdateInterval: number
  downloadPath: string
  // 浏览页面过滤器
  browseMinScore: number
  browseRatings: Array<'s' | 'q' | 'e'>
  browseLandscapeOnly: boolean
  browseExcludeTags: string[]
}
