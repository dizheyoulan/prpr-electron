<template>
  <el-drawer v-model="visible" title="过滤设置" direction="rtl" size="320px">
    <el-form label-position="top" :model="form">
      <el-form-item label="最低评分">
        <el-slider v-model="form.browseMinScore" :min="0" :max="100" show-input />
      </el-form-item>

      <el-form-item label="评级">
        <el-checkbox-group v-model="form.browseRatings">
          <el-checkbox label="s">安全 (S)</el-checkbox>
          <el-checkbox label="q">可疑 (Q)</el-checkbox>
          <el-checkbox label="e">成人 (E)</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="仅横图">
        <el-switch v-model="form.browseLandscapeOnly" />
        <span style="margin-left: 12px; color: var(--el-text-color-secondary); font-size: 13px">
          只选择宽度大于高度的图片
        </span>
      </el-form-item>

      <el-form-item label="排除标签">
        <el-select
          v-model="form.browseExcludeTags"
          multiple
          allow-create
          filterable
          placeholder="输入要排除的标签"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" :loading="saving" @click="apply">应用并保存</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const visible = defineModel<boolean>({ default: false })
const emit = defineEmits<{ apply: [] }>()

const settingsStore = useSettingsStore()
const saving = ref(false)

const form = reactive({
  browseMinScore: 0,
  browseRatings: ['s'] as Array<'s' | 'q' | 'e'>,
  browseLandscapeOnly: false,
  browseExcludeTags: [] as string[]
})

// 当抽屉打开时，从 store 加载最新设置
watch(visible, (val) => {
  if (val) {
    form.browseMinScore = settingsStore.browseMinScore
    form.browseRatings = [...settingsStore.browseRatings]
    form.browseLandscapeOnly = settingsStore.browseLandscapeOnly
    form.browseExcludeTags = [...settingsStore.browseExcludeTags]
  }
})

function reset() {
  form.browseMinScore = 0
  form.browseRatings = ['s']
  form.browseLandscapeOnly = false
  form.browseExcludeTags = []
}

async function apply() {
  saving.value = true
  try {
    await settingsStore.save('browseMinScore', form.browseMinScore)
    await settingsStore.save('browseRatings', form.browseRatings)
    await settingsStore.save('browseLandscapeOnly', form.browseLandscapeOnly)
    await settingsStore.save('browseExcludeTags', form.browseExcludeTags)
    emit('apply')
    visible.value = false
  } finally {
    saving.value = false
  }
}
</script>
