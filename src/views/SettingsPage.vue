<template>
  <div class="booru-settings">
    <el-tabs v-model="activeTab">
      <!-- 基本设置 -->
      <el-tab-pane label="基本" name="general">
        <el-form :model="settings" label-width="120px">
          <!-- <el-form-item label="站点地址">
            <el-input v-model="settings.booruHost" placeholder="https://yande.re" />
          </el-form-item>
          <el-form-item label="主题">
            <el-radio-group v-model="settings.theme">
              <el-radio-button label="system">跟随系统</el-radio-button>
              <el-radio-button label="light">浅色</el-radio-button>
              <el-radio-button label="dark">深色</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="安全模式">
            <el-switch v-model="settings.booruSafeMode" />
          </el-form-item> -->
          <el-form-item label="下载路径">
            <el-input v-model="settings.downloadPath" placeholder="默认下载目录">
              <template #append>
                <el-button @click="selectDownloadPath">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const activeTab = ref('general')
const settings = reactive({ ...settingsStore.$state })

onMounted(() => Object.assign(settings, settingsStore.$state))

let saveTimer: any = null

// 监听所有设置项的变化并自动保存
watch(settings, (newSettings) => {
  let changed = false
  for (const key in newSettings) {
    const k = key as keyof typeof newSettings
    if (newSettings[k] !== settingsStore.$state[k]) {
      settingsStore.save(k, newSettings[k])
      changed = true
    }
  }

  if (changed) {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      ElMessage.success({
        message: '设置已自动保存',
        duration: 1500,
        grouping: true
      })
    }, 500)
  }
}, { deep: true })

async function selectDownloadPath() {
  const path = await window.api.settings.selectFolder()
  if (path) settings.downloadPath = path
}
</script>

<style lang="scss" scoped>
.booru-settings { padding: 24px; max-width: 600px; }
</style>
