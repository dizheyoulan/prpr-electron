import { searchPosts, downloadImage } from '@/lib/booru'
import { useSettingsStore } from '@/stores/settings'
import { useHistoryStore } from '@/stores/history'

export class WallpaperManager {
  static async applyWallpaper() {
    const settings = useSettingsStore()
    const historyStore = useHistoryStore()
    const {
      wallpaperTags,
      wallpaperMinScore,
      wallpaperRatings,
      wallpaperLandscapeOnly,
      wallpaperCropMethod
    } = settings

    if (!wallpaperTags) return

    try {
      console.log('[WallpaperManager] 开始执行壁纸更新...')
      const posts = await searchPosts(wallpaperTags, 1)
      if (posts.length === 0) {
        console.log('[WallpaperManager] 未找到图片')
        return
      }

      // 应用过滤条件，并排除历史记录中的 ID
      const filteredPosts = posts.filter(p => {
        if (p.score < wallpaperMinScore) return false
        if (!wallpaperRatings.includes(p.rating)) return false
        if (wallpaperLandscapeOnly && p.width <= p.height) return false
        if (historyStore.isDuplicate(p.id)) return false
        return true
      })

      if (filteredPosts.length === 0) {
        console.log('[WallpaperManager] 没有符合过滤条件或非重复的图片')
        return
      }

      const randomPost = filteredPosts[Math.floor(Math.random() * filteredPosts.length)]
      console.log(`[WallpaperManager] 选择图片 ID: ${randomPost.id}, 评分: ${randomPost.score}, 评级: ${randomPost.rating}`)

      // 下载并设置壁纸
      const buffer = await downloadImage(randomPost.sample_url)
      await window.api.wallpaper.set(buffer, randomPost.id, wallpaperCropMethod)
      
      // 保存到历史记录
      await historyStore.addHistory({
        id: randomPost.id,
        preview_url: randomPost.preview_url,
        sample_url: randomPost.sample_url
      })
      
      console.log('[WallpaperManager] 壁纸更新成功')
    } catch (err) {
      console.error('[WallpaperManager] Error:', err)
    }
  }

  static async applyLockscreen() {
    const settings = useSettingsStore()
    const historyStore = useHistoryStore()
    const {
      lockscreenTags
    } = settings

    if (!lockscreenTags) return

    try {
      console.log('[WallpaperManager] 开始执行锁屏更新...')
      const posts = await searchPosts(lockscreenTags, 1)
      if (posts.length === 0) {
        console.log('[WallpaperManager] 未找到图片')
        return
      }

      // 锁屏也建议过滤掉重复的（虽然需求主要针对壁纸，但统一逻辑更好）
      const filteredPosts = posts.filter(p => !historyStore.isDuplicate(p.id))
      const targetPosts = filteredPosts.length > 0 ? filteredPosts : posts

      const randomPost = targetPosts[Math.floor(Math.random() * targetPosts.length)]
      console.log(`[WallpaperManager] 选择图片 ID: ${randomPost.id}`)

      // 下载并设置锁屏
      const isWindows = navigator.userAgent.includes('Windows')
      if (isWindows) {
        const buffer = await downloadImage(randomPost.sample_url)
        await window.api.wallpaper.set(buffer, randomPost.id, 'center')
        
        // 锁屏也记录到历史？根据需求“无论是手动更换还是自动更换”，建议记录
        await historyStore.addHistory({
          id: randomPost.id,
          preview_url: randomPost.preview_url,
          sample_url: randomPost.sample_url
        })
        
        console.log('[WallpaperManager] 锁屏更新成功')
      }
    } catch (err) {
      console.error('[WallpaperManager] Error:', err)
    }
  }
}
