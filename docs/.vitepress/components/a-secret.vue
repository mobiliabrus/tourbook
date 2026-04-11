<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type VNode } from 'vue'
import CryptoJS from 'crypto-js'
import { getSecret } from './util'
import { renderMarkdownToVNodes } from './markdown-render'
import { createOutlineSyncer, type Heading } from './useOutlineSync'

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
const secretKey = ref(getSecret())
const syncer = createOutlineSyncer()
const extractedHeadings = ref<Heading[]>([])

// 使用 Vite 的 import.meta.glob 预加载所有机密文件
const confidentialModules = import.meta.glob('../../assets/confidential/*.md', { 
  query: '?raw',
  import: 'default'
})

const decrypt = () => {
  if (contentVNodes.value.length > 0) {
    visible.value = true
    // 延迟注册 outline，确保 DOM 已更新
    setTimeout(() => {
      syncer.registerHeadings(extractedHeadings.value)
    }, 0)
  }
}

/**
 * 从 HTML 字符串中提取标题信息
 */
const extractHeadings = (html: string): Heading[] => {
  const headings: Heading[] = []
  const regex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10)
    const id = match[2]
    // 移除内部的 anchor 标签以获取纯文本
    const text = match[3].replace(/<a[^>]*class="header-anchor"[^>]*>.*?<\/a>/g, '').trim()
    headings.push({ id, text, level })
  }
  return headings
}

onMounted(async () => {
  if (!secretKey.value) {
    return
  }

  loading.value = true
  
  try {
    // 构建文件路径
    const filePath = `../../assets/confidential/${props.name}.md`

    // 检查文件是否存在
    if (!confidentialModules[filePath]) {
      console.error(`Secret file not found: ${props.name}.md`)
      loading.value = false
      return
    }
    
    // 动态导入文件内容
    const module = await confidentialModules[filePath]()
    rawContent.value = module as string

    // 解密内容
    if (secretKey.value && rawContent.value) {
      const keylength = 16
      const keyorigin = secretKey.value.split('')
      const key16 =
        keyorigin.length < 16
          ? [...keyorigin, ...Array.from(new Array(keylength - keyorigin.length)).map(() => '0')].join('')
          : keyorigin.slice(0, 16).join('')
      
      const keyutf = CryptoJS.enc.Utf8.parse(key16)
      const iv = { iv: CryptoJS.enc.Base64.parse(key16) }
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(rawContent.value) },
        keyutf,
        iv
      )
      const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted)

      // 提取标题用于 Outline 同步
      // 我们需要先渲染成 HTML 才能提取，或者修改 renderMarkdownToVNodes 返回中间结果
      // 这里我们重新渲染一次 HTML 用于提取（性能开销较小）
      const { renderMarkdown } = await import('./markdown-render')
      const html = renderMarkdown(decryptedText)
      extractedHeadings.value = extractHeadings(html)

      // 将解密后的 markdown 渲染为 Vue VNodes（支持自定义组件）
      contentVNodes.value = renderMarkdownToVNodes(decryptedText)
      
      // 如果设置了自动加载，则立即显示
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

<style scoped>
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
