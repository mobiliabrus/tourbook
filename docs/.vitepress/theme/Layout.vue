<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const { Layout } = DefaultTheme
const route = useRoute()

const handleSetSecret = () => {
  const value = prompt("")
  if (value !== null && value.trim() !== '') {
    localStorage.setItem("lee6's-secret", value.trim())
  }
}

const scrollToHash = () => {
  const hash = window.location.hash
  if (hash) {
    // 增加延迟以确保动态内容（如 a-secret）已经渲染完成
    setTimeout(() => {
      const element = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (element) {
        element.scrollIntoView()
      }
    }, 300)
  }
}

onMounted(() => {
  scrollToHash()
})

// 监听路由变化，处理页面跳转时的 hash 定位
watch(() => route.path, () => {
  // 页面切换时，等待新页面挂载后尝试滚动
  setTimeout(scrollToHash, 100)
}, { flush: 'post' })

// 由于 VitePress 的 Route 类型可能不包含 hash，我们直接监听 window.location
const handleHashChange = () => {
  scrollToHash()
}

onMounted(() => {
  window.addEventListener('hashchange', handleHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
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
