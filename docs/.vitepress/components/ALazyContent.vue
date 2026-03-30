<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  threshold?: string
}>()

const isVisible = ref(false)
const contentRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      })
    }, {
      rootMargin: '50px'
    })
    
    if (contentRef.value) {
      observer.observe(contentRef.value)
    }
  } else {
    isVisible.value = true
  }
})
</script>

<template>
  <div ref="contentRef" class="a-lazy-content">
    <slot v-if="isVisible" />
    <div v-else class="a-lazy-placeholder">Loading...</div>
  </div>
</template>

<style scoped>
.a-lazy-content {
  margin: 1rem 0;
}

.a-lazy-placeholder {
  padding: 2rem;
  text-align: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #999;
}
</style>
