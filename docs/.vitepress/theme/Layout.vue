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

  // 1. Remove active state from all dynamic outline items
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

  // 2. If dynamic item is found, remove active from native items (prevent conflicts)
  if (found) {
    document.querySelectorAll('.VPDocOutlineItem.root > li > a.outline-link:not([data-vp-outline])').forEach(link => {
      link.classList.remove('active')
    })
  }
}

const scrollToHash = () => {
  const hash = window.location.hash
  if (hash) {
    // Increase delay to ensure dynamic content (like a-secret) has finished rendering
    setTimeout(() => {
      const element = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (element) {
        // Get navbar height as top spacing
        const navHeight = document.querySelector('.VPNav')?.clientHeight || 60;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;

        window.scrollTo({
          top: offsetPosition,
        });
        updateActiveOutline()
      }
    }, 300)
  }
}

onMounted(() => {
  scrollToHash()
  window.addEventListener('hashchange', handleHashChange)
  // Listen to scroll to update active state
  window.addEventListener('scroll', updateActiveOutline, { passive: true })
})

// Listen to route changes to handle hash positioning during page navigation
watch(() => route.path, () => {
  // When switching pages, wait for new page to mount before attempting to scroll
  setTimeout(() => {
    scrollToHash()
    updateActiveOutline()
  }, 100)
}, { flush: 'post' })

// Since VitePress Route type may not include hash, we directly listen to window.location
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
