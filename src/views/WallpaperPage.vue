<template>
  <div class="wallpaper-page">
    <el-page-header @back="router.back()" title="返回" content="壁纸设置" />
    <el-form :model="form" label-width="130px" style="margin-top: 24px; max-width: 560px">
      <el-form-item label="搜索标签">
        <TagInput v-model="form.wallpaperTags" />
      </el-form-item>

      <el-form-item label="最低评分">
        <el-slider v-model="form.wallpaperMinScore" :min="0" :max="100" show-input />
      </el-form-item>

      <el-form-item label="评级">
        <el-checkbox-group v-model="form.wallpaperRatings">
          <el-checkbox label="s">安全 (S)</el-checkbox>
          <el-checkbox label="q">可疑 (Q)</el-checkbox>
          <el-checkbox label="e">成人 (E)</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="仅横图">
        <el-switch v-model="form.wallpaperLandscapeOnly" />
        <span style="margin-left: 12px; color: var(--el-text-color-secondary); font-size: 13px">
          只选择宽度大于高度的图片
        </span>
      </el-form-item>

      <!-- <el-form-item label="裁剪方式">
        <el-radio-group v-model="form.wallpaperCropMethod">
          <el-radio-button label="face">人脸居中</el-radio-button>
          <el-radio-button label="center">图片居中</el-radio-button>
          <el-radio-button label="fill">填充</el-radio-button>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="图片质量">
        <el-radio-group v-model="form.wallpaperQuality">
          <el-radio-button label="sample">样本</el-radio-button>
          <el-radio-button label="original">原图</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="自动更新">
        <el-switch v-model="form.wallpaperAutoUpdate" />
      </el-form-item>
      <el-form-item v-if="form.wallpaperAutoUpdate" label="更新间隔(分钟)">
        <el-input-number v-model="form.wallpaperUpdateInterval" :min="1" :step="1" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="saving" @click="save">保存设置</el-button>
        <el-button :loading="applying" @click="applyNow">立即更换壁纸</el-button>
      </el-form-item>
    </el-form>

    <div class="history-section" v-if="historyStore.wallpaperHistory.length > 0">
      <div class="section-title">最近更换历史</div>
      <div class="history-list">
        <div 
          v-for="item in historyStore.wallpaperHistory" 
          :key="item.id" 
          class="history-item"
          @click="router.push(`/booru/image/${item.id}`)"
        >
          <el-image 
            :src="item.preview_url" 
            fit="cover" 
            lazy
            class="history-image"
          >
            <template #placeholder>
              <div class="image-placeholder">加载中...</div>
            </template>
          </el-image>
          <div class="item-id">#{{ item.id }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'
import { useTaskStore } from '@/stores/task'
import { useHistoryStore } from '@/stores/history'
import { WallpaperManager } from '@/services/WallpaperManager'
import TagInput from '@/components/TagInput.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const taskStore = useTaskStore()
const historyStore = useHistoryStore()
const saving = ref(false)
const applying = ref(false)

const form = reactive({
  wallpaperTags: '',
  wallpaperCropMethod: 'center' as 'face' | 'center' | 'fill',
  wallpaperQuality: 'sample' as 'sample' | 'original',
  wallpaperAutoUpdate: false,
  wallpaperUpdateInterval: 1,
  wallpaperMinScore: 0,
  wallpaperRatings: ['s'] as Array<'s' | 'q' | 'e'>,
  wallpaperLandscapeOnly: false
})

onMounted(() => {
  form.wallpaperTags = settingsStore.wallpaperTags
  form.wallpaperCropMethod = settingsStore.wallpaperCropMethod
  form.wallpaperQuality = settingsStore.wallpaperQuality
  form.wallpaperAutoUpdate = settingsStore.wallpaperAutoUpdate
  form.wallpaperUpdateInterval = settingsStore.wallpaperUpdateInterval
  form.wallpaperMinScore = settingsStore.wallpaperMinScore
  form.wallpaperRatings = settingsStore.wallpaperRatings
  form.wallpaperLandscapeOnly = settingsStore.wallpaperLandscapeOnly
})

async function save() {
  saving.value = true
  try {
    await settingsStore.save('wallpaperTags', form.wallpaperTags)
    await settingsStore.save('wallpaperCropMethod', form.wallpaperCropMethod)
    await settingsStore.save('wallpaperQuality', form.wallpaperQuality)
    await settingsStore.save('wallpaperAutoUpdate', form.wallpaperAutoUpdate)
    await settingsStore.save('wallpaperUpdateInterval', form.wallpaperUpdateInterval)
    await settingsStore.save('wallpaperMinScore', form.wallpaperMinScore)
    await settingsStore.save('wallpaperRatings', form.wallpaperRatings)
    await settingsStore.save('wallpaperLandscapeOnly', form.wallpaperLandscapeOnly)

    // 根据自动更新开关启动或停止定时任务
    if (form.wallpaperAutoUpdate) {
      taskStore.startWallpaperTask()
      ElMessage.success('壁纸设置已保存，自动更新任务已启动')
    } else {
      taskStore.stopWallpaperTask()
      ElMessage.success('壁纸设置已保存，自动更新任务已停止')
    }
  } finally {
    saving.value = false
  }
}

async function applyNow() {
  if (!form.wallpaperTags) { ElMessage.warning('请先设置搜索标签'); return }
  applying.value = true
  try {
    ElMessage.info('正在获取图片并设置壁纸...')
    await WallpaperManager.applyWallpaper()
    ElMessage.success('壁纸已更新')
  } catch (e) {
    ElMessage.error('设置壁纸失败')
  } finally {
    applying.value = false
  }
}
</script>

<style lang="scss" scoped>
.wallpaper-page { padding: 24px; }

.history-section {
  margin-top: 40px;
  
  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
  }
  
  .history-list {
    display: flex;
    overflow-x: auto;
    gap: 16px;
    padding-bottom: 30px;
    
    /* 隐藏滚动条但保留滚动功能 (可选) */
    &::-webkit-scrollbar {
      height: 20px;
      cursor: pointer;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--el-border-color-lighter);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
  
  .history-item {
    flex: 0 0 150px;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-4px);
      
      .history-image {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
    }
    
    .history-image {
      width: 150px;
      height: 100px;
      border-radius: 8px;
      border: 1px solid var(--el-border-color);
    }
    
    .item-id {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-top: 4px;
      text-align: center;
    }
    
    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-fill-color-light);
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }
  }
}
</style>
