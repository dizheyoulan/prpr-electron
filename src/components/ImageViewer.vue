<template>
  <teleport to="body">
    <div class="image-viewer" @click.self="emit('close')">
      <div class="image-viewer__toolbar">
        <el-button-group>
          <el-button :icon="ZoomIn" circle @click="zoom(0.2)" />
          <el-button :icon="ZoomOut" circle @click="zoom(-0.2)" />
          <el-button :icon="RefreshLeft" circle @click="rotate(-90)" />
          <el-button :icon="RefreshRight" circle @click="rotate(90)" />
          <el-button :icon="Download" circle @click="download" />
        </el-button-group>
        <el-button :icon="Close" circle @click="emit('close')" />
      </div>
      <div class="image-viewer__stage" @wheel.prevent="onWheel">
        <img
          :src="url"
          :style="imgStyle"
          class="image-viewer__img"
          draggable="false"
        />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ZoomIn, ZoomOut, RefreshLeft, RefreshRight, Download, Close } from '@element-plus/icons-vue'

const props = defineProps<{ url: string }>()
const emit = defineEmits<{ close: [] }>()

const scale = ref(1)
const rotation = ref(0)

const imgStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotation.value}deg)`,
  transition: 'transform 0.2s ease'
}))

function zoom(delta: number) {
  scale.value = Math.max(0.1, Math.min(10, scale.value + delta))
}
function rotate(deg: number) {
  rotation.value = (rotation.value + deg) % 360
}
function onWheel(e: WheelEvent) {
  zoom(e.deltaY > 0 ? -0.1 : 0.1)
}
async function download() {
  const a = document.createElement('a')
  a.href = props.url
  a.download = props.url.split('/').pop() || 'image'
  a.click()
}
</script>

<style lang="scss" scoped>
.image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  flex-direction: column;

  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    flex-shrink: 0;
  }

  &__stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: zoom-in;
  }

  &__img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    user-select: none;
  }
}
</style>
