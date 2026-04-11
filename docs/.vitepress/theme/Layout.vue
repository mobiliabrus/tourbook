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

const updateActiveOutline = () => {
  const hash = window.location.hash
  if (!hash) return

  // 1. 移除所有动态 outline 的 active 状态
  const dynamicLinks = document.querySelectorAll('.outline-link[data-vp-outline="true"]')
  let found = false
  dynamicLinks.forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.classList.add('active')
      found = true
    } else {
      link.classList.remove('active')
    }
  })

  // 2. 如果找到了动态项，移除原生项的 active（防止冲突）
  if (found) {
    document.querySelectorAll('.VPDocOutlineItem.root > li > a.outline-link:not([data-vp-outline])').forEach(link => {
      link.classList.remove('active')
    })
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
        updateActiveOutline()
      }
    }, 300)
  }
}

onMounted(() => {
  scrollToHash()
  window.addEventListener('hashchange', handleHashChange)
  // 监听滚动以更新 active 状态
  window.addEventListener('scroll', updateActiveOutline, { passive: true })
})

// 监听路由变化，处理页面跳转时的 hash 定位
watch(() => route.path, () => {
  // 页面切换时，等待新页面挂载后尝试滚动
  setTimeout(() => {
    scrollToHash()
    updateActiveOutline()
  }, 100)
}, { flush: 'post' })

// 由于 VitePress 的 Route 类型可能不包含 hash，我们直接监听 window.location
const handleHashChange = () => {
  scrollToHash()
  updateActiveOutline()
}

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
  window.removeEventListener('scroll', updateActiveOutline)
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
