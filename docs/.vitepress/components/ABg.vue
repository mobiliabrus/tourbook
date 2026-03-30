<script setup lang="ts">
// 背景组件 - 用于装饰性背景
const props = defineProps<{
  type?: string
}>()
</script>

<template>
  <div class="a-bg-container">
    <slot />
  </div>
</template>

<style scoped>
.a-bg-container {
  position: relative;
  overflow: hidden;
}
</style>
