<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type VNode } from 'vue'
import { crypto, normalizeKey } from './crypto'
import CryptoJS from 'crypto-js'
import { getSecret } from './util'
import { renderMarkdownToVNodes } from './markdown-render'
import { createOutlineSyncer, type Heading } from '../composables/useOutlineSync'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  autoload: {
    type: Boolean,
    default: false,
  },
  blackout: {
    type: Boolean,
    default: false,
  },
})

const loading = ref(false)
const visible = ref(false)
const rawContent = ref('')
const contentVNodes = ref<VNode[]>([])
// Client-side only flag to avoid hydration mismatch
const isClient = ref(false)
const secretKey = ref('')
const syncer = createOutlineSyncer()
const extractedHeadings = ref<Heading[]>([])

// Use Vite's import.meta.glob to preload all confidential files
const confidentialModules = import.meta.glob('../../assets/confidential/*.md', { 
  query: '?raw',
  import: 'default'
})

const decrypt = () => {
  if (contentVNodes.value.length > 0) {
    visible.value = true
    // Delay registering outline to ensure DOM is updated
    setTimeout(() => {
      syncer.registerHeadings(extractedHeadings.value)
    }, 0)
  }
}

/**
 * Extract heading information from HTML string
 */
const extractHeadings = (html: string): Heading[] => {
  const headings: Heading[] = []
  const regex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10)
    const id = match[2]
    // Remove inner anchor tags to get plain text
    const text = match[3].replace(/<a[^>]*class="header-anchor"[^>]*>.*?<\/a>/g, '').trim()
    headings.push({ id, text, level })
  }
  return headings
}

onMounted(async () => {
  // Mark as client-side mounted
  isClient.value = true
  
  // Get secret key only on client side
  secretKey.value = getSecret() || ''
  
  if (!secretKey.value) {
    return
  }

  loading.value = true
  
  try {
    // Build file path
    const filePath = `../../assets/confidential/${props.name}.md`

    // Check if file exists
    if (!confidentialModules[filePath]) {
      console.error(`Secret file not found: ${props.name}.md`)
      loading.value = false
      return
    }
    
    // Dynamically import file content
    const module = await confidentialModules[filePath]()
    rawContent.value = module as string

    // Decrypt content
    if (secretKey.value && rawContent.value) {
      const normalizedKey = normalizeKey(secretKey.value)
      const keyUtf = CryptoJS.enc.Utf8.parse(normalizedKey)
      const iv = { iv: CryptoJS.enc.Base64.parse(normalizedKey) }
      
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(rawContent.value) },
        keyUtf,
        iv
      )
      const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted)

      // Extract headings for Outline synchronization
      // We need to render to HTML first to extract, or modify renderMarkdownToVNodes to return intermediate results
      // Here we re-render HTML once for extraction (small performance overhead)
      const { renderMarkdown } = await import('./markdown-render')
      const html = renderMarkdown(decryptedText)
      extractedHeadings.value = extractHeadings(html)

      // Render decrypted markdown as Vue VNodes (supporting custom components)
      contentVNodes.value = renderMarkdownToVNodes(decryptedText)
      
      // If autoload is set, display immediately
      if (props.autoload) {
        decrypt()
      }
    }
  } catch (err) {
    console.error('Failed to load or decrypt secret:', err)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  syncer.unregister()
})
</script>

<template>
  <!-- Only render after client-side hydration to avoid mismatch -->
  <template v-if="isClient">
    <div v-if="loading" class="a-secret-loading">
      <div class="a-secret-skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>
    
    <span
      v-else-if="!visible && (blackout || contentVNodes.length > 0)"
      class="a-secret-blackout"
      @click="decrypt"
    >
      {{ rawContent }}
    </span>
    
    <template
      v-else-if="visible"
    >
      <component
        v-for="(vnode, index) in contentVNodes"
        :key="index"
        :is="vnode"
      />
    </template>
  </template>
  
  <!-- SSR fallback: render empty placeholder to maintain consistent structure -->
  <span v-else class="a-secret-ssr-placeholder"></span>
</template>

<style scoped>
.a-secret-ssr-placeholder {
  display: inline-block;
  min-height: 1em;
}

.a-secret-loading {
  padding: 1rem 0;
}

.a-secret-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.a-secret-blackout {
  display: inline;
  background-color: #333;
  color: transparent;
  padding: 0 8px;
  user-select: none;
  height: 18px;
  line-height: 18px;
  word-break: break-all;
  letter-spacing: -5.5px;
  cursor: pointer;
}
</style>
