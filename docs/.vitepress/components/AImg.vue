<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  name: string
  dir?: string
  alt?: string
}>()

const imageUrl = computed(() => {
  if (!props.name) {
    console.warn('AImg: name prop is required but not provided')
    return ''
  }
  const ext = props.name.includes('.') ? '' : '.jpg'
  if (props.dir) {
    return `/assets/${props.dir}/${props.name}${ext}`
  }
  return `/assets/${props.name}${ext}`
})

const imageError = ref(false)
</script>

<template>
  <div class="a-img-container">
    <img 
      v-if="!imageError" 
      :src="imageUrl" 
      :alt="alt || name" 
      class="a-img"
      @error="imageError = true"
    />
    <div v-else class="a-img-placeholder">
      Image not found: {{ name }}
    </div>
  </div>
</template>

<style scoped>
.a-img-container {
  margin: 1.5rem 0;
  text-align: center;
}

.a-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.a-img-placeholder {
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
  color: #999;
}
</style>
