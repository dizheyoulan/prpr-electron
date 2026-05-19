<template>
  <div v-if="post" class="image-page">
    <!-- 顶部工具栏 -->
    <div class="image-page__toolbar">
      <el-button :icon="ArrowLeft" @click="router.back()">返回</el-button>
      <div class="toolbar-actions">
        <el-button :icon="Star" @click="favorite">收藏</el-button>
        <el-button :icon="Download" @click="download">下载</el-button>
        <el-button :icon="Monitor" @click="setWallpaper">设为壁纸</el-button>
      </div>
    </div>

    <div class="image-page__content">
      <!-- 图片预览 -->
      <div class="image-page__preview">
        <img
          :src="previewUrl"
          :alt="post.id.toString()"
          class="preview-img"
          @click="appStore.openImageViewer(post.file_url)"
        />
        <div class="preview-actions">
          <el-radio-group v-model="quality" size="small">
            <el-radio-button label="preview">预览</el-radio-button>
            <el-radio-button label="sample">样本</el-radio-button>
            <el-radio-button label="original">原图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 信息面板 -->
      <div class="image-page__info">
        <el-descriptions :column="1" border size="small" class="info-descriptions">
          <el-descriptions-item label="ID">{{ post.id }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ post.author }}</el-descriptions-item>
          <el-descriptions-item label="评分">{{ post.score }}</el-descriptions-item>
          <el-descriptions-item label="评级">{{ post.rating.toUpperCase() }}</el-descriptions-item>
          <el-descriptions-item label="尺寸">{{ post.width }} × {{ post.height }}</el-descriptions-item>
          <el-descriptions-item label="文件大小">
            预览 {{ previewSize ? formatSize(previewSize) : '...' }} / 样本 {{ formatSize(post.sample_file_size) }} / 原图 {{ formatSize(post.file_size) }}
          </el-descriptions-item>
          <el-descriptions-item label="来源">
            <a :href="post.source" target="_blank">{{ post.source }}</a>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 标签列表 -->
        <div class="image-page__tags">
          <div class="tags-title">标签</div>
          <div class="tags-list">
            <el-tag
              v-for="tag in tagList"
              :key="tag"
              size="small"
              class="tag-item"
              @click="searchByTag(tag)"
            >{{ tag }}</el-tag>
          </div>
        </div>

        <!-- 评论 -->
        <div class="image-page__comments">
          <div class="comments-title">评论 ({{ comments.length }})</div>
          <div v-for="c in comments" :key="c.id" class="comment-item">
            <span class="comment-author">{{ c.creator }}</span>
            <span class="comment-body">{{ c.body }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="image-page--loading">
    <el-icon class="is-loading" :size="32"><Loading /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Star, Download, Monitor, Loading } from '@element-plus/icons-vue'
import { ElMessage, ElButton } from 'element-plus'
import { useBooruStore } from '@/stores/booru'
import { useAppStore } from '@/stores/app'
import type { Comment } from '@/types/post'

const route = useRoute()
const router = useRouter()
const booruStore = useBooruStore()
const appStore = useAppStore()

const quality = ref<'preview' | 'sample' | 'original'>('sample')
const comments = ref<Comment[]>([])
const previewSize = ref(0)

const post = computed(() => booruStore.currentPost)
const tagList = computed(() => post.value?.tags.split(' ').filter(Boolean) || [])
const previewUrl = computed(() => {
  if (!post.value) return ''
  if (quality.value === 'original') return post.value.file_url
  if (quality.value === 'sample') return post.value.sample_url
  return post.value.preview_url
})

onMounted(async () => {
  const id = Number(route.params.id)
  booruStore.currentPost = null
  comments.value = []
  previewSize.value = 0
  await booruStore.getPostDetail(id)
  if (post.value) {
    comments.value = await (await import('@/lib/booru')).getComments(post.value.id)
    fetch(post.value.preview_url).then(r => r.blob()).then(b => { previewSize.value = b.size })
  }
})

function formatSize(bytes: number): string {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

function searchByTag(tag: string) {
  router.push({ path: '/booru', query: { tags: tag } })
}

async function favorite() {
  if (post.value) await booruStore.favorite(post.value.id)
}

async function download() {
  if (!post.value) return
  const url = quality.value === 'original' ? post.value.file_url : post.value.sample_url
  const filename = `${post.value.id}.${post.value.file_ext}`
  try {
    const buffer = await (await import('@/lib/booru')).downloadImage(url)
    const filePath = await window.api.downloadImage(buffer, filename)
    ElMessage({
      type: 'success',
      duration: 10000,
      showClose: true,
      message: h('div', { style: 'display: flex; align-items: center; gap: 12px' }, [
        h('span', null, `下载成功：${filename}`),
        h(ElButton, {
          type: 'primary',
          link: true,
          onClick: () => window.api.openFileInFolder(filePath)
        }, { default: () => '打开文件夹' })
      ])
    })
  } catch (err) {
    ElMessage.error('下载失败')
  }
}

async function setWallpaper() {
  if (!post.value) return
  try {
    const url = post.value.sample_url
    const buffer = await (await import('@/lib/booru')).downloadImage(url)
    await window.api.wallpaper.set(buffer, post.value.id, 'center')
    ElMessage.success('壁纸设置成功')
  } catch (err) {
    ElMessage.error('壁纸设置失败')
  }
}
</script>

<style lang="scss" scoped>
.image-page {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-shrink: 0;
    .toolbar-actions { display: flex; gap: 8px; }
  }

  &__content {
    display: flex;
    flex: 1;
    overflow: hidden;
    gap: 16px;
    padding: 16px;
  }

  &__preview {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    overflow: hidden;

    .preview-img {
      max-width: 100%;
      max-height: calc(100vh - 200px);
      object-fit: contain;
      cursor: zoom-in;
      border-radius: 4px;
    }
  }

  &__info {
    width: 330px;
    overflow-y: auto;
    flex-shrink: 0;

    .info-descriptions {
      width: 100%;
      table-layout: fixed;

      :deep(.el-descriptions__label) {
        white-space: nowrap;
        width: 1px; // 配合 nowrap 让 label 宽度自适应内容且不换行
      }

      :deep(.el-descriptions__content) {
        word-break: break-all; // 强制英文数字截断换行
        overflow-wrap: break-word;
      }
    }
  }

  &__tags {
    margin-top: 16px;
    .tags-title { font-weight: 600; margin-bottom: 8px; }
    .tags-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .tag-item { cursor: pointer; }
  }

  &__comments {
    margin-top: 16px;
    .comments-title { font-weight: 600; margin-bottom: 8px; }
    .comment-item { margin-bottom: 8px; font-size: 13px; }
    .comment-author { font-weight: 600; margin-right: 6px; color: var(--el-color-primary); }
  }

  &--loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
