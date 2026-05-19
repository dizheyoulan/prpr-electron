<template>
  <div class="image-card" @click="emit('click', post)">
    <div class="image-card__thumb" :style="{ paddingBottom: aspectRatio }">
      <img
        v-lazy="post.preview_url"
        :alt="post.id.toString()"
        class="image-card__img"
        loading="lazy"
      />
      <div class="image-card__overlay">
        <span class="image-card__score">♥ {{ post.score }}</span>
        <span class="image-card__rating" :class="`rating--${post.rating}`">
          {{ post.rating.toUpperCase() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types/post'

const props = defineProps<{ post: Post }>()
const emit = defineEmits<{ click: [post: Post] }>()

const aspectRatio = computed(() =>
  `${(props.post.preview_height / props.post.preview_width) * 100}%`
)
</script>

<style lang="scss" scoped>
.image-card {
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  background: var(--el-fill-color-light);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  &__thumb {
    position: relative;
    width: 100%;
    height: 0;
  }

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 4px 6px;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover &__overlay { opacity: 1; }

  &__score { color: #fff; font-size: 11px; }

  &__rating {
    font-size: 10px;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
    &.rating--s { background: #67c23a; color: #fff; }
    &.rating--q { background: #e6a23c; color: #fff; }
    &.rating--e { background: #f56c6c; color: #fff; }
  }
}
</style>
