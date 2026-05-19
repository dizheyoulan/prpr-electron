<template>
  <div class="title-bar" @dblclick="toggleMaximize">
    <div class="title-bar__drag" />
    <span class="title-bar__title">PRPR</span>
    <div class="title-bar__controls">
      <button class="ctrl-btn" @click="minimize">─</button>
      <button class="ctrl-btn" @click="toggleMaximize">□</button>
      <button class="ctrl-btn ctrl-btn--close" @click="close">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
function minimize() { window.api.window.minimize() }
function toggleMaximize() { window.api.window.maximize() }
function close() { window.api.window.close() }
</script>

<style lang="scss" scoped>
.title-bar {
  display: flex;
  align-items: center;
  height: 32px;
  background: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-lighter);
  -webkit-app-region: drag;
  user-select: none;
  flex-shrink: 0;

  &__drag { flex: 1; height: 100%; }

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  &__controls {
    display: flex;
    -webkit-app-region: no-drag;
  }
}

.ctrl-btn {
  width: 46px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--el-text-color-regular);
  cursor: pointer;
  font-size: 12px;
  transition: background 0.15s;

  &:hover { background: var(--el-fill-color-light); }
  &--close:hover { background: #e81123; color: #fff; }
}
</style>
