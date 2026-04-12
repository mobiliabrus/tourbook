<script setup lang="ts">
import { computed } from 'vue'
import AImg from './a-img.vue'
import { getSecret } from './util'

interface GalleryItem {
  name: string
  dir?: string
}

const props = defineProps<{
  img: GalleryItem[]
}>()

const secretKey = getSecret()

const content = computed(() => {
  return props.img.filter((i) => {
    return !i?.dir?.includes('privacy') || !!secretKey
  })
})

const visible = computed(() => {
  return content.value.length > 0
})
</script>

<template>
  <div v-if="visible" class="gallery" aria-hidden="true">
    <div v-for="(i, index) in content" :key="i.name">
      <AImg :name="i.name" :dir="i.dir" />
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  align-items: center;
}
</style>
