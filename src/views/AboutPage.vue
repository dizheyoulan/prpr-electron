<template>
  <div class="about-page">
    <el-card class="about-card">
      <div class="about-card__logo">🐱</div>
      <h1>PRPR</h1>
      <p class="about-card__desc">动漫壁纸软件</p>
      <el-divider />
      <el-descriptions :column="1">
        <el-descriptions-item label="版本">1.0.0</el-descriptions-item>
        <el-descriptions-item label="框架">Electron + Vue 3 + Element Plus</el-descriptions-item>
        <el-descriptions-item label="支持站点">Yandere</el-descriptions-item>
        <!-- <el-descriptions-item label="支持站点">Yandere / Konachan</el-descriptions-item> -->
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.about-page {
  display: flex; justify-content: center; align-items: center; height: 100%; padding: 24px;
}
.about-card {
  width: 400px; text-align: center;
  &__logo { font-size: 64px; margin-bottom: 8px; }
  &__desc { color: var(--el-text-color-secondary); margin-top: 4px; }
  h1 { margin: 0; font-size: 28px; }
}
</style>
