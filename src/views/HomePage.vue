<template>
  <div class="booru-home">
    <!-- 搜索栏 -->
    <div class="booru-home__search">
      <TagInput v-model="searchTags" class="search-input" />
      <el-button type="primary" @click="doSearch">
        搜索
      </el-button>
      <el-button :icon="Filter" @click="filterVisible = true" />
    </div>

    <!-- 瀑布流 -->
    <WaterfallGrid
      :items="booruStore.filteredPosts"
      :column-count="columnCount"
      :loading="booruStore.loading"
      :has-more="booruStore.hasMore"
      @load-more="booruStore.loadMore()"
    >
      <template #default="{ item }">
        <ImageCard :post="item" @click="openImage" />
      </template>
    </WaterfallGrid>

    <!-- 加载状态 -->
    <div v-if="booruStore.loading" class="booru-home__loading">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
    <div v-if="!booruStore.hasMore && booruStore.posts.length > 0" class="booru-home__end">
      没有更多了
    </div>

    <FilterPanel v-model="filterVisible" @apply="onFilterApply" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Filter, Loading } from '@element-plus/icons-vue'
import { useBooruStore } from '@/stores/booru'
import WaterfallGrid from '@/components/WaterfallGrid.vue'
import ImageCard from '@/components/ImageCard.vue'
import TagInput from '@/components/TagInput.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import type { Post } from '@/types/post'

const router = useRouter()
const route = useRoute()
const booruStore = useBooruStore()
const searchTags = ref('')
const filterVisible = ref(false)

const columnCount = computed(() => {
  const w = window.innerWidth
  if (w > 1600) return 6
  if (w > 1200) return 5
  if (w > 900) return 4
  return 3
})

onMounted(() => {
  // 检查URL查询参数
  if (route.query.tags) {
    searchTags.value = route.query.tags as string
    booruStore.search(searchTags.value)
  } else if (booruStore.posts.length === 0) {
    booruStore.loadMore()
  }
})

// 监听路由查询参数变化
watch(() => route.query.tags, (newTags) => {
  if (newTags) {
    searchTags.value = newTags as string
    booruStore.search(searchTags.value)
  }
})

function doSearch() {
  booruStore.search(searchTags.value)
}

function openImage(post: Post) {
  router.push(`/booru/image/${post.id}`)
}

function onFilterApply() {
  // 由于 FilterPanel 直接保存到 settingsStore，且 booruStore 的 filteredPosts 是计算属性
  // 如果过滤后数据太少，自动补充加载
  if (booruStore.filteredPosts.length < 50) {
    booruStore.loadMore()
  }
}
</script>

<style lang="scss" scoped>
.booru-home {
  &__search {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: var(--el-bg-color-overlay);
    border-bottom: 1px solid var(--el-border-color-lighter);
    position: sticky;
    top: 0;
    z-index: 10;

    .search-input { flex: 1; }
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: 24px;
    font-size: 24px;
    color: var(--el-color-primary);
  }

  &__end {
    text-align: center;
    padding: 16px;
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}
</style>
