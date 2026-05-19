<template>
  <div class="tag-input">
    <el-select
      ref="selectRef"
      v-model="selectedTags"
      multiple
      filterable
      remote
      allow-create
      :remote-method="searchTags"
      :loading="loading"
      placeholder="输入标签搜索..."
      class="tag-input__select"
      @change="handleChange"
    >
      <el-option
        v-for="tag in suggestions"
        :key="tag.name"
        :label="`${tag.name} (${tag.count})`"
        :value="tag.name"
      >
        <span :style="{ color: tagColor(tag.type) }">{{ tag.name }}</span>
        <span class="tag-count">{{ tag.count }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Tag, TagType } from '@/types/post'
import { TAG_TYPE_COLORS } from '@/types/post'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const selectedTags = ref<string[]>(props.modelValue ? props.modelValue.split(' ').filter(Boolean) : [])
const suggestions = ref<Tag[]>([])
const loading = ref(false)
const selectRef = ref<any>(null)

watch(() => props.modelValue, (val) => {
  selectedTags.value = val ? val.split(' ').filter(Boolean) : []
})

function handleChange(val: string[]) {
  emit('update:modelValue', val.join(' '))
  if (selectRef.value) {
    selectRef.value.query = ''
  }
}

async function searchTags(query: string) {
  if (!query) return
  loading.value = true
  try {
    suggestions.value = await (await import('@/lib/booru')).searchTags(query)
  } finally {
    loading.value = false
  }
}

function tagColor(type: TagType): string {
  return TAG_TYPE_COLORS[type] || '#b4c7d9'
}
</script>

<style lang="scss" scoped>
.tag-input {
  &__select { width: 300px; }
}
.tag-count {
  float: right;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>
