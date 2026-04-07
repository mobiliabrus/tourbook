<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CryptoJS from 'crypto-js'
import { getSecret } from './util'
import { renderMarkdown } from './markdown-render'

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
const content = ref('')
const secretKey = ref(getSecret())

// 使用 Vite 的 import.meta.glob 预加载所有机密文件
const confidentialModules = import.meta.glob('../../assets/confidential/*.md', { 
  query: '?raw',
  import: 'default'
})

const decrypt = () => {
  if (content.value) {
    visible.value = true
  }
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
      
      // 将解密后的 markdown 渲染为 HTML
      content.value = renderMarkdown(decryptedText)
      
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
    v-else-if="!visible && (blackout || content)"
    class="a-secret-blackout"
    @click="decrypt"
  >
    {{ rawContent }}
  </span>
  
  <div
    v-else-if="visible"
    class="a-secret-content"
    v-html="content"
  ></div>
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

.a-secret-content {
  text-decoration-line: underline;
  text-decoration-color: #f0f0f0;
  text-underline-position: from-font;
}
</style>
