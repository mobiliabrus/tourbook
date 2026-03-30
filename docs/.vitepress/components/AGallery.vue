<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  images?: Array<{
    name: string
    dir?: string
  }>
}>()

const currentIndex = ref(0)

const images = ref(props.images || [])
</script>

<template>
  <div class="a-gallery-container" v-if="images && images.length > 0">
    <div class="a-gallery-grid">
      <div v-for="(img, index) in images" :key="index" class="a-gallery-item">
        <AImg :name="img.name" :dir="img.dir" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.a-gallery-container {
  margin: 1.5rem 0;
}

.a-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.a-gallery-item {
  cursor: pointer;
  transition: transform 0.3s;
}

.a-gallery-item:hover {
  transform: scale(1.02);
}
</style>
