<script setup lang="ts">
import { computed } from 'vue'
import AImg from './a-img/index.vue'
import { Carousel } from 'ant-design-vue'
import { getSecret } from './util'

interface ImgItem {
  name: string
  dir?: string
}

const props = defineProps<{
  img: ImgItem[]
}>()

const secretKey = getSecret()

const visible = computed(() => {
  return content.value.length > 0
})

const content = computed(() => {
  if (!Array.isArray(props.img)) return []
  return props.img.filter((i: ImgItem) => {
    return !i.dir?.includes('privacy') || !!secretKey
  })
})
</script>

<template>
  <Carousel autoplay v-if="visible">
    <div v-for="item in content" :key="item.name">
      <AImg :name="item.name" :dir="item.dir" />
    </div>
  </Carousel>
</template>
