<template>
  <div class="lockscreen-page">
    <el-page-header @back="router.back()" title="返回" content="锁屏设置" />
    <el-alert v-if="!isWindows" title="锁屏设置仅支持 Windows 平台" type="warning" show-icon style="margin-top:16px" />
    <el-form :model="form" label-width="130px" style="margin-top: 24px; max-width: 560px">
      <el-form-item label="搜索标签">
        <TagInput v-model="form.lockscreenTags" />
      </el-form-item>
      <el-form-item label="自动更新">
        <el-switch v-model="form.lockscreenAutoUpdate" :disabled="!isWindows" />
      </el-form-item>
      <el-form-item v-if="form.lockscreenAutoUpdate" label="更新间隔(分钟)">
        <el-input-number v-model="form.lockscreenUpdateInterval" :min="1" :step="1" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="save">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'
import { useTaskStore } from '@/stores/task'
import TagInput from '@/components/TagInput.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const taskStore = useTaskStore()
const saving = ref(false)
const isWindows = navigator.userAgent.includes('Windows')

const form = reactive({
  lockscreenTags: '',
  lockscreenAutoUpdate: false,
  lockscreenUpdateInterval: 1
})

onMounted(() => {
  form.lockscreenTags = settingsStore.lockscreenTags
  form.lockscreenAutoUpdate = settingsStore.lockscreenAutoUpdate
  form.lockscreenUpdateInterval = settingsStore.lockscreenUpdateInterval
})

async function save() {
  saving.value = true
  try {
    await settingsStore.save('lockscreenTags', form.lockscreenTags)
    await settingsStore.save('lockscreenAutoUpdate', form.lockscreenAutoUpdate)
    await settingsStore.save('lockscreenUpdateInterval', form.lockscreenUpdateInterval)

    // 根据自动更新开关启动或停止定时任务
    if (form.lockscreenAutoUpdate && isWindows) {
      taskStore.startLockscreenTask()
      ElMessage.success('锁屏设置已保存，自动更新任务已启动')
    } else {
      taskStore.stopLockscreenTask()
      ElMessage.success('锁屏设置已保存，自动更新任务已停止')
    }
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.lockscreen-page { padding: 24px; }
</style>
