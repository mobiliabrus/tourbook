<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted } from 'vue'

const { Layout } = DefaultTheme

const handleSetSecret = () => {
  const value = prompt("")
  if (value !== null && value.trim() !== '') {
    localStorage.setItem("lee6's-secret", value.trim())
  }
}

const scrollToHash = () => {
  const hash = window.location.hash
  if (hash) {
    // 等待 DOM 更新后尝试滚动
    setTimeout(() => {
      const element = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }
}

onMounted(() => {
  scrollToHash()
  window.addEventListener('hashchange', scrollToHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', scrollToHash)
})
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <button 
        class="secret-key-btn"
        @click="handleSetSecret"
      >
      </button>
    </template>
  </Layout>
</template>

<style scoped>
.secret-key-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 0.5rem;
  transition: transform 0.2s;
}
</style>
