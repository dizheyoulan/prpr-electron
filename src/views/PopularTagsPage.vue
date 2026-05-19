<template>
  <div class="popular-tags">
    <div class="popular-tags__header">
      <h2 class="title">热门标签</h2>
      <div class="controls">
        <el-select v-model="tagType" placeholder="标签类型" style="width: 120px" @change="filterTags">
          <el-option label="全部" :value="-1" />
          <el-option label="通用" :value="0" />
          <el-option label="画师" :value="1" />
          <el-option label="版权" :value="3" />
          <el-option label="角色" :value="4" />
          <el-option label="社团" :value="5" />
        </el-select>
        <el-button :icon="Refresh" @click="loadTags" :loading="loading">刷新</el-button>
      </div>
    </div>

    <!-- 最近使用标签 -->
    <div v-if="recentTags.length > 0" class="recent-tags-section">
      <div class="section-header">
        <h3 class="section-title">最近使用</h3>
        <el-button text size="small" @click="clearRecentTags">清空</el-button>
      </div>
      <div class="tags-grid">
        <TagCard
          v-for="tag in recentTagsData"
          :key="tag.name"
          :tag="tag"
          :show-delete="true"
          @use="searchByTag"
          @delete="removeRecentTag"
        />
      </div>
    </div>

    <div v-if="loading && tags.length === 0" class="popular-tags__loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <div v-else-if="error && tags.length === 0" class="popular-tags__error">
      <el-icon><WarningFilled /></el-icon>
      <p>{{ error }}</p>
      <el-button @click="loadTags(true)">重试</el-button>
    </div>

    <template v-else>
      <div
        class="tags-grid"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="loading || !hasMore"
        :infinite-scroll-distance="200"
      >
        <TagCard
          v-for="tag in displayedTags"
          :key="tag.id"
          :tag="tag"
          :show-delete="false"
          @use="searchByTag"
        />
      </div>

      <div v-if="loading && tags.length > 0" class="popular-tags__loading-more">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>正在加载更多...</span>
      </div>

      <div v-if="!loading && !hasMore && displayedTags.length > 0" class="popular-tags__no-more">
        <span>没有更多标签了</span>
      </div>

      <div v-if="!loading && displayedTags.length === 0" class="popular-tags__empty">
        <el-icon><FolderOpened /></el-icon>
        <p>没有找到标签</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Refresh, Loading, WarningFilled, FolderOpened } from '@element-plus/icons-vue'
import { getPopularTags } from '@/lib/booru'
import type { Tag } from '@/types/post'
import TagCard from '@/components/TagCard.vue'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const tags = ref<Tag[]>([])
const tagType = ref<number>(-1)
const recentTags = ref<Tag[]>([])
const page = ref(1)
const hasMore = ref(true)
const PAGE_SIZE = 100

const RECENT_TAGS_KEY = 'booru_recent_tags'
const MAX_RECENT_TAGS = 20

const displayedTags = computed(() => {
  if (tagType.value === -1) return tags.value
  return tags.value.filter(tag => tag.type === tagType.value)
})

const recentTagsData = computed(() => {
  return recentTags.value
})

onMounted(() => {
  loadTags(true)
  loadRecentTags()
})

async function loadTags(reset = false) {
  if (reset) {
    page.value = 1
    tags.value = []
    hasMore.value = true
  }
  
  if (loading.value || !hasMore.value) return

  loading.value = true
  error.value = ''
  try {
    const newTags = await getPopularTags(page.value, PAGE_SIZE)
    if (newTags.length < PAGE_SIZE) {
      hasMore.value = false
    }
    tags.value = [...tags.value, ...newTags]
    page.value++
  } catch (e) {
    error.value = '加载失败，请检查网络连接'
    console.error('Failed to load popular tags:', e)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (tagType.value !== -1) return // 筛选状态下暂时不支持加载更多，因为后端不支持带类型的分页查询（通常）
  await loadTags()
}

function filterTags() {
  // 过滤逻辑已通过 computed 实现
  // 如果想要在筛选时也支持加载更多，可能需要重新设计 API 调用
}

function searchByTag(tagName: string) {
  // 查找完整的标签信息
  const fullTag = tags.value.find(t => t.name === tagName)
  if (fullTag) {
    addRecentTag(fullTag)
  } else {
    // 如果在热门标签中找不到，创建简单的标签对象
    addRecentTag({ name: tagName } as Tag)
  }

  router.push({
    path: '/booru',
    query: { tags: tagName }
  })
}

function loadRecentTags() {
  try {
    const stored = localStorage.getItem(RECENT_TAGS_KEY)
    if (stored) {
      recentTags.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load recent tags:', e)
  }
}

function saveRecentTags() {
  try {
    localStorage.setItem(RECENT_TAGS_KEY, JSON.stringify(recentTags.value))
  } catch (e) {
    console.error('Failed to save recent tags:', e)
  }
}

function addRecentTag(tag: Tag) {
  // 移除已存在的（按名称匹配）
  const index = recentTags.value.findIndex(t => t.name === tag.name)
  if (index > -1) {
    recentTags.value.splice(index, 1)
  }

  // 添加到开头
  recentTags.value.unshift(tag)

  // 限制数量
  if (recentTags.value.length > MAX_RECENT_TAGS) {
    recentTags.value = recentTags.value.slice(0, MAX_RECENT_TAGS)
  }

  saveRecentTags()
}

function removeRecentTag(tagName: string) {
  const index = recentTags.value.findIndex(t => t.name === tagName)
  if (index > -1) {
    recentTags.value.splice(index, 1)
    saveRecentTags()
  }
}

function clearRecentTags() {
  recentTags.value = []
  saveRecentTags()
}
</script>

<style lang="scss" scoped>
.popular-tags {
  padding: 20px;
  height: 100%;
  overflow-y: auto;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--el-border-color-lighter);

    .title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .controls {
      display: flex;
      gap: 12px;
    }
  }

  &__loading-more,
  &__no-more {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    gap: 8px;
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }

  &__loading,
  &__error,
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: var(--el-text-color-secondary);

    .el-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    p {
      margin: 0 0 16px 0;
      font-size: 16px;
    }
  }

  &__error {
    color: var(--el-color-danger);
  }
}

.recent-tags-section {
  margin-bottom: 16px;
  padding: 12px;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .section-title {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}
</style>

