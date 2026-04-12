<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { useRoute } from 'vitepress'
import { Modal, Input } from 'ant-design-vue'

const { Layout } = DefaultTheme
const route = useRoute()

// State for the secret key modal
const secretModalVisible = ref(false)
const secretValue = ref('')

const handleSetSecret = () => {
  secretValue.value = localStorage.getItem("lee6's-secret") || ''
  secretModalVisible.value = true
}

const handleOk = () => {
  if (secretValue.value.trim() !== '') {
    localStorage.setItem("lee6's-secret", secretValue.value.trim())
  }
  secretModalVisible.value = false
}

const handleCancel = () => {
  secretModalVisible.value = false
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
  if (!isBrowser) return
  
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
  
  <!-- Secret Key Modal -->
  <Modal
    v-model:open="secretModalVisible"
    :footer="null"
    :closable="false"
    width="300px"
    wrap-class-name="secret-modal"
  >
    <Input
      v-model:value="secretValue"
      type="password"
      placeholder=""
      @press-enter="handleOk"
    />
    <div style="text-align: right; margin-top: 16px;">
      <button @click="handleCancel" style="margin-right: 8px;">Cancel</button>
      <button @click="handleOk">OK</button>
    </div>
  </Modal>
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

<style>
/* Global styles for secret modal to remove decorations */
.secret-modal .ant-modal-content {
  padding: 16px;
  box-shadow: none;
  border-radius: 4px;
}

.secret-modal .ant-modal-header {
  display: none;
}

.secret-modal .ant-modal-body {
  padding: 0;
}

.secret-modal .ant-input {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px 12px;
}

.secret-modal .ant-input:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.secret-modal button {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
}

.secret-modal button:hover {
  background: #e6e6e6;
}

.secret-modal button:last-child {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.secret-modal button:last-child:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}
</style>
