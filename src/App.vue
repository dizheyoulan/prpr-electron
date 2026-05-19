<template>
  <AppShell />
</template>

<script setup lang="ts">
import AppShell from '@/components/AppShell.vue'
import { useSettingsStore } from '@/stores/settings'
import { useTaskStore } from '@/stores/task'
import { useHistoryStore } from '@/stores/history'
import { onMounted, watch } from 'vue'

const settings = useSettingsStore()
const tasks = useTaskStore()
const history = useHistoryStore()

onMounted(async () => {
  await settings.loadAll()
  await history.loadHistory()
  applyTheme(settings.theme)
  tasks.init()
})

watch(() => settings.theme, applyTheme)

function applyTheme(theme: string) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', isDark)
}
</script>
