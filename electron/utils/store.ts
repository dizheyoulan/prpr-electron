import Store from 'electron-store'

interface AppStoreSchema {
  // 通用设置
  theme: 'system' | 'light' | 'dark'
  language: string
  downloadPath: string
  // Booru 设置
  booruHost: string
  booruUsername: string
  booruPasswordHash: string
  booruUserId: string
  booruApiKey: string
  booruSafeMode: boolean
  booruRatingFilter: string[]
  // 壁纸设置
  wallpaperTags: string
  wallpaperCropMethod: 'face' | 'center' | 'fill'
  wallpaperQuality: 'sample' | 'original'
  wallpaperAutoUpdate: boolean
  wallpaperUpdateInterval: number
  wallpaperCurrentId: string
  wallpaperMinScore: number
  wallpaperRatings: string[]
  wallpaperLandscapeOnly: boolean
  // 锁屏设置
  lockscreenTags: string
  lockscreenAutoUpdate: boolean
  lockscreenUpdateInterval: number
  // 浏览设置
  browseMinScore: number
  browseRatings: string[]
  browseLandscapeOnly: boolean
  browseExcludeTags: string[]
}

const defaults: AppStoreSchema = {
  theme: 'system',
  language: 'zh-CN',
  downloadPath: '',
  booruHost: 'https://yande.re',
  booruUsername: '',
  booruPasswordHash: '',
  booruUserId: '',
  booruApiKey: '',
  booruSafeMode: false,
  booruRatingFilter: [],
  wallpaperTags: '',
  wallpaperCropMethod: 'face',
  wallpaperQuality: 'sample',
  wallpaperAutoUpdate: false,
  wallpaperUpdateInterval: 60,
  wallpaperCurrentId: '',
  wallpaperMinScore: 0,
  wallpaperRatings: ['s'],
  wallpaperLandscapeOnly: false,
  lockscreenTags: '',
  lockscreenAutoUpdate: false,
  lockscreenUpdateInterval: 60,
  browseMinScore: 0,
  browseRatings: ['s'],
  browseLandscapeOnly: false,
  browseExcludeTags: []
}

export const appStore = new Store<AppStoreSchema>({ defaults })
