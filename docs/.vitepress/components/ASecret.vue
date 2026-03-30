<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  name: string
  autoload?: boolean
}>()

const isRevealed = ref(props.autoload || false)
const secretKey = 'lee6\'s-secret'

const revealSecret = () => {
  const key = localStorage.getItem(secretKey)
  if (key && key.trim()) {
    // 这里可以实现解密逻辑
    // 目前只是简单显示已存储的密钥
    isRevealed.value = true
  } else {
    const newKey = prompt('Enter secret key:')
    if (newKey) {
      localStorage.setItem(secretKey, newKey)
      isRevealed.value = true
    }
  }
}
</script>

<template>
  <div class="a-secret-container">
    <div v-if="!isRevealed" class="a-secret-locked" @click="revealSecret">
      <span class="a-secret-lock-icon">🔒</span>
      <span class="a-secret-label">Secret Content: {{ name }}</span>
      <span class="a-secret-hint">Click to unlock</span>
    </div>
    <div v-else class="a-secret-revealed">
      <slot>
        <div class="a-secret-content">
          <p>Secret content for: {{ name }}</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.a-secret-container {
  margin: 1.5rem 0;
}

.a-secret-locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  color: white;
}

.a-secret-locked:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.a-secret-lock-icon {
  font-size: 2rem;
}

.a-secret-label {
  font-weight: 600;
  font-size: 1.1rem;
}

.a-secret-hint {
  font-size: 0.85rem;
  opacity: 0.8;
}

.a-secret-revealed {
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.a-secret-content {
  color: #333;
}
</style>
