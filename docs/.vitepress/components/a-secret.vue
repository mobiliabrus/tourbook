<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import CryptoJS from 'crypto-js'
import macau from '../plugins/macau'
import { getSecret } from './util'

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
const t = ref<HTMLElement | null>(null)

let app: any = null

const decrypt = () => {
  if (secretKey.value && content.value) {
    visible.value = true
    nextTick(() => {
      // 这里可以添加渲染逻辑
      if (t.value) {
        t.value.innerHTML = content.value
      }
    })
  }
}

onMounted(() => {
  if (secretKey.value) {
    loading.value = true
    fetch(`assets/confidential/${props.name}.md`, { mode: 'cors' })
      .then((res) => {
        if (res.status === 200) return res.text()
        console.error(`${res.url.split('/').slice(-1)} ${res.statusText.toLowerCase()}.`)
        return Promise.reject()
      })
      .then((raw) => {
        rawContent.value = raw
        if (secretKey.value) {
          const keylength = 16
          const keyorigin = secretKey.value.split('')
          const key16 =
            keyorigin.length < 16
              ? [...keyorigin, ...Array.from(new Array(keylength - keyorigin.length)).map(() => '0')].join('')
              : keyorigin.slice(0, 16).join('')
          
          const keyutf = CryptoJS.enc.Utf8.parse(key16)
          const iv = { iv: CryptoJS.enc.Base64.parse(key16) }
          const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(raw) },
            keyutf,
            iv
          )
          content.value = String(macau(CryptoJS.enc.Utf8.stringify(decrypted)))
          
          if (props.autoload) {
            decrypt()
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load secret:', err)
      })
      .then(() => {
        loading.value = false
      })
  }
})

onBeforeUnmount(() => {
  if (app) {
    app.unmount()
    app = null
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
  
  <span
    v-else-if="visible"
    ref="t"
    class="a-secret-content"
  ></span>
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
