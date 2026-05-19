<template>
  <div class="waterfall" ref="containerRef">
    <div class="waterfall__grid">
      <div
        v-for="(col, ci) in columns"
        :key="ci"
        class="waterfall__col"
      >
        <slot v-for="item in col" :item="item" :key="(item as any).id" />
      </div>
    </div>
    <div ref="sentinelRef" class="waterfall__sentinel" />
  </div>
</template>

<script setup lang="ts" generic="T extends { id: number | string; width: number; height: number }">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  items: T[]
  columnCount?: number
  gap?: number
  loading?: boolean
  hasMore?: boolean
}>(), {
  columnCount: 4,
  gap: 8,
  loading: false,
  hasMore: true
})

const emit = defineEmits<{ loadMore: [] }>()

const containerRef = ref<HTMLElement>()
const sentinelRef = ref<HTMLElement>()

// 将 items 分配到列中（贪心算法，每次放入最短列）
const columns = computed<T[][]>(() => {
  const cols: T[][] = Array.from({ length: props.columnCount }, () => [])
  const heights = new Array(props.columnCount).fill(0)

  for (const item of props.items) {
    const minIdx = heights.indexOf(Math.min(...heights))
    cols[minIdx].push(item)
    heights[minIdx] += item.height / item.width // 归一化高度
  }
  return cols
})

// IntersectionObserver 实现无限滚动
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !props.loading && props.hasMore) {
        emit('loadMore')
      }
    },
    { threshold: 0.1 }
  )
  if (sentinelRef.value) observer.observe(sentinelRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
.waterfall {
  padding: v-bind('`${gap}px`');

  &__grid {
    display: flex;
    gap: v-bind('`${gap}px`');
    align-items: flex-start;
  }

  &__col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: v-bind('`${gap}px`');
  }

  &__sentinel {
    height: 1px;
  }
}
</style>
