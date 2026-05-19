<template>
  <nav class="sidebar" :class="{ 'sidebar--collapsed': appStore.sidebarCollapsed }">
    <div class="sidebar__logo" @click="appStore.toggleSidebar()">
      <span class="logo-icon">🐱</span>
      <span v-if="!appStore.sidebarCollapsed" class="logo-text">PRPR</span>
    </div>

    <el-menu
      :default-active="route.path"
      :collapse="appStore.sidebarCollapsed"
      router
      class="sidebar__menu"
    >
      <el-menu-item-group title="Booru">
        <el-menu-item index="/booru">
          <el-icon><Picture /></el-icon>
          <template #title>浏览</template>
        </el-menu-item>
        <el-menu-item index="/booru/popular-tags">
          <el-icon><CollectionTag /></el-icon>
          <template #title>热门标签</template>
        </el-menu-item>
        <!-- <el-menu-item index="/booru/account">
          <el-icon><User /></el-icon>
          <template #title>账户</template>
        </el-menu-item> -->
        <el-menu-item index="/booru/settings">
          <el-icon><Setting /></el-icon>
          <template #title>设置</template>
        </el-menu-item>
      </el-menu-item-group>

      <el-menu-item-group title="系统">
        <el-menu-item index="/settings/wallpaper">
          <el-icon><Monitor /></el-icon>
          <template #title>壁纸</template>
        </el-menu-item>
        <el-menu-item index="/settings/lockscreen">
          <el-icon><Lock /></el-icon>
          <template #title>锁屏</template>
        </el-menu-item>
        <el-menu-item index="/settings/about">
          <el-icon><InfoFilled /></el-icon>
          <template #title>关于</template>
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Picture, CollectionTag, Setting, Monitor, Lock, InfoFilled } from '@element-plus/icons-vue'

const route = useRoute()
const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
  height: 100%;
  background: var(--el-bg-color-overlay);
  border-right: 1px solid var(--el-border-color-lighter);
  transition: width 0.2s ease;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  &--collapsed { width: 64px; }

  &__logo {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .logo-icon { font-size: 20px; }
    .logo-text { font-weight: 700; font-size: 16px; color: var(--el-color-primary); }
  }

  &__menu {
    flex: 1;
    border-right: none;
    overflow-y: auto;
  }
}
</style>
