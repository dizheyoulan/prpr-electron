import { defineStore } from 'pinia'
import type { Post } from '@/types/post'
import * as booruApi from '@/lib/booru'
import { useSettingsStore } from './settings'

interface BooruState {
  posts: Post[]
  loading: boolean
  hasMore: boolean
  page: number
  searchTags: string
  currentPost: Post | null
  isLoggedIn: boolean
  username: string
}

export const useBooruStore = defineStore('booru', {
  state: (): BooruState => ({
    posts: [],
    loading: false,
    hasMore: true,
    page: 1,
    searchTags: '',
    currentPost: null,
    isLoggedIn: false,
    username: ''
  }),

  getters: {
    filteredPosts: (state): Post[] => {
      const settingsStore = useSettingsStore()
      return state.posts.filter(p => {
        // 评分过滤
        if (p.score < settingsStore.browseMinScore) return false
        
        // 评级过滤
        if (!settingsStore.browseRatings.includes(p.rating)) return false
        
        // 横图过滤：宽度必须大于高度，且比例至少为 1.1 (稍微宽一点，避免正方形)
        if (settingsStore.browseLandscapeOnly) {
          const w = Number(p.width)
          const h = Number(p.height)
          if (w <= h * 1.1) return false
        }
        
        // 标签排除
        if (settingsStore.browseExcludeTags.some(t => p.tags.includes(t))) return false
        
        return true
      })
    }
  },

  actions: {
    async search(tags: string) {
      this.searchTags = tags
      this.posts = []
      this.page = 1
      this.hasMore = true
      this.loading = false
      await this.loadMore()
    },

    async loadMore() {
      if (this.loading || !this.hasMore) return
      this.loading = true
      try {
        let attempts = 0
        const maxAttempts = 20 
        const targetIncrement = 50
        const initialFilteredCount = this.filteredPosts.length

        // 循环直到本次加载新增了至少 50 条过滤后的数据，或者没有更多数据，或者达到最大尝试次数
        while (
          (this.filteredPosts.length - initialFilteredCount) < targetIncrement && 
          this.hasMore && 
          attempts < maxAttempts
        ) {
          attempts++
          const pages = 5
          const requests = Array.from({ length: pages }, (_, i) =>
            booruApi.searchPosts(this.searchTags, this.page + i)
          )
          const results = await Promise.all(requests)
          
          let gotData = false
          for (const result of results) {
            if (result.length === 0) {
              this.hasMore = false
              break
            }
            this.posts.push(...result)
            gotData = true
          }
          
          if (gotData) {
            this.page += pages
          } else {
            this.hasMore = false
          }
        }
      } finally {
        this.loading = false
      }
    },

    async getPostDetail(id: number) {
      this.currentPost = await booruApi.getPostDetail(id)
    },

    async login(username: string, password: string): Promise<boolean> {
      const res = await booruApi.login(username, password)
      if (res.success) {
        this.isLoggedIn = true
        this.username = username
      }
      return res.success
    },

    logout() {
      booruApi.logout()
      this.isLoggedIn = false
      this.username = ''
    },

    async favorite(postId: number): Promise<boolean> {
      return booruApi.favorite(postId)
    }
  }
})
