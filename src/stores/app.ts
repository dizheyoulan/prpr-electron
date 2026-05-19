import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    activeModule: 'booru',
    sidebarCollapsed: false,
    imageViewerVisible: false,
    imageViewerUrl: ''
  }),

  actions: {
    setModule(module: 'booru') {
      this.activeModule = module
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    openImageViewer(url: string) {
      this.imageViewerUrl = url
      this.imageViewerVisible = true
    },
    closeImageViewer() {
      this.imageViewerVisible = false
      this.imageViewerUrl = ''
    }
  }
})
