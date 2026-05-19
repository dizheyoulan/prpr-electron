<template>
  <div class="tag-card" :style="{ borderColor: borderColor }">
    <div class="tag-card__header">
      <span class="tag-name">{{ tag.name }}</span>
      <el-tag
        v-if="tag.type !== undefined"
        :type="getTagTypeVariant(tag.type)"
        size="small"
        effect="plain"
        class="tag-type"
      >
        {{ TAG_TYPE_LABELS[tag.type] }}
      </el-tag>
    </div>
    <div class="tag-card__meta">
      <span v-if="tag.count !== undefined" class="tag-count">
        <el-icon><PictureFilled /></el-icon>
        {{ formatCount(tag.count) }}
      </span>
    </div>
    <div class="tag-card__actions">
      <el-button size="small" type="primary" @click="$emit('use', tag.name)">
        搜索
      </el-button>
      <el-button size="small" @click="handleCopy">
        复制
      </el-button>
      <el-button
        v-if="showDelete"
        size="small"
        type="danger"
        @click="$emit('delete', tag.name)"
      >
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { PictureFilled } from '@element-plus/icons-vue'
import type { Tag, TagType } from '@/types/post'
import { TAG_TYPE_LABELS, TAG_TYPE_COLORS } from '@/types/post'

interface TagCardProps {
  tag: Tag | { name: string; type?: TagType; count?: number }
  showDelete?: boolean
}

const props = withDefaults(defineProps<TagCardProps>(), {
  showDelete: false
})

defineEmits<{
  use: [tagName: string]
  copy: [tagName: string]
  delete: [tagName: string]
}>()

const borderColor = computed(() => {
  if (props.tag.type !== undefined) {
    return TAG_TYPE_COLORS[props.tag.type]
  }
  return 'var(--el-border-color-light)'
})

function formatCount(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count.toString()
}

function getTagTypeVariant(type: TagType): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  const variants: Record<TagType, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    0: 'info',
    1: 'warning',
    3: 'success',
    4: 'danger',
    5: 'primary',
    6: 'danger'
  }
  return variants[type] || 'info'
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.tag.name)
    ElMessage.success('已复制到剪贴板')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}
</script>

<style lang="scss" scoped>
.tag-card {
  padding: 8px;
  background: var(--el-bg-color-overlay);
  border: 2px solid var(--el-border-color-light);
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--el-color-primary);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 4px;

    .tag-name {
      flex: 1;
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      word-break: break-word;
      line-height: 1.4;
    }

    .tag-type {
      flex-shrink: 0;
    }
  }

  &__meta {
    margin-bottom: 8px;
    min-height: 18px;

    .tag-count {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: var(--el-text-color-secondary);
      font-size: 14px;

      .el-icon {
        font-size: 14px;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 4px;

    .el-button {
      flex: 1;
      padding: 4px 8px;
      font-size: 12px;
    }
  }
}
</style>
