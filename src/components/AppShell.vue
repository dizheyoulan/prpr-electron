<template>
  <div class="app-shell">
    <TitleBar />
    <div class="app-body">
      <Sidebar />
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
    <!-- 全局图片查看器 -->
    <ImageViewer
      v-if="appStore.imageViewerVisible"
      :url="appStore.imageViewerUrl"
      @close="appStore.closeImageViewer()"
    />
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue'
import Sidebar from './Sidebar.vue'
import ImageViewer from '@/components/ImageViewer.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--el-bg-color);
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
