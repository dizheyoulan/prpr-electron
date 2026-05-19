<template>
  <div class="account-page">
    <div v-if="!booruStore.isLoggedIn" class="account-page__login">
      <el-card class="login-card">
        <template #header>登录 {{ settingsStore.booruHost }}</template>
        <el-form :model="form" label-width="80px" @submit.prevent="login">
          <el-form-item label="用户名">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" type="password" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" native-type="submit">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div v-else class="account-page__profile">
      <el-card>
        <template #header>账户信息</template>
        <el-descriptions :column="1">
          <el-descriptions-item label="用户名">{{ booruStore.username }}</el-descriptions-item>
          <el-descriptions-item label="站点">{{ settingsStore.booruHost }}</el-descriptions-item>
        </el-descriptions>
        <el-button type="danger" @click="logout" style="margin-top: 16px">退出登录</el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useBooruStore } from '@/stores/booru'
import { useSettingsStore } from '@/stores/settings'

const booruStore = useBooruStore()
const settingsStore = useSettingsStore()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

async function login() {
  if (!form.username || !form.password) return
  loading.value = true
  try {
    const ok = await booruStore.login(form.username, form.password)
    ok ? ElMessage.success('登录成功') : ElMessage.error('用户名或密码错误')
  } finally {
    loading.value = false
  }
}

function logout() {
  booruStore.logout()
  ElMessage.success('已退出登录')
}
</script>

<style lang="scss" scoped>
.account-page {
  padding: 24px;
  display: flex;
  justify-content: center;
  .login-card { width: 360px; }
}
</style>
