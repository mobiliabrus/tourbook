<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from './util'

const emit = defineEmits<{
  load: []
}>()

const loaded = ref(false)
const lazy = ref<HTMLElement | null>(null)
let handler: (() => void) | null = null

const listen = () => {
  handler = debounce(onscroll, 100)
  document.addEventListener('scroll', handler)
}

const dismiss = () => {
  if (handler) {
    document.removeEventListener('scroll', handler)
    handler = null
  }
}

const onscroll = () => {
  shouldLoad()
}

const shouldLoad = (next?: () => void) => {
  if (!lazy.value) return
  
  const clientHeight = document.documentElement.clientHeight
  const preload = 0.5 * clientHeight
  const { bottom, top } = lazy.value.getBoundingClientRect()
  
  if (!loaded.value && bottom - clientHeight < preload && top > 0 - preload) {
    loaded.value = true
    emit('load')
    dismiss()
    return
  } else if (typeof next === 'function') {
    next()
  }
}

onMounted(() => {
  setTimeout(() => {
    shouldLoad(() => {
      listen()
    })
  }, 100)
})

onBeforeUnmount(() => {
  dismiss()
})
</script>

<template>
  <span ref="lazy">
    <slot></slot>
  </span>
</template>
