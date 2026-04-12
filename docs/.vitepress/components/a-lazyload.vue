<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
  load: []
}>()

const loaded = ref(false)
const lazy = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!lazy.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loaded.value) {
          loaded.value = true
          emit('load')
          observer?.disconnect()
        }
      })
    },
    {
      rootMargin: '50% 0px', // Preload when element is within 50% of viewport height
    }
  )

  observer.observe(lazy.value)
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <span ref="lazy">
    <slot></slot>
  </span>
</template>
