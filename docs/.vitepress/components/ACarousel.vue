<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  img?: Array<{
    name: string
    dir?: string
  }>
}>()

const currentIndex = ref(0)

const images = computed(() => {
  if (!props.img || props.img.length === 0) return []
  return props.img.map(item => {
    const ext = item.name.includes('.') ? '' : '.jpg'
    if (item.dir) {
      return `/assets/${item.dir}/${item.name}${ext}`
    }
    return `/assets/${item.name}${ext}`
  })
})

const goToPrevious = () => {
  currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : images.value.length - 1
}

const goToNext = () => {
  currentIndex.value = currentIndex.value < images.value.length - 1 ? currentIndex.value + 1 : 0
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}
</script>

<template>
  <div class="a-carousel-container" v-if="images.length > 0">
    <div class="a-carousel">
      <div class="a-carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(img, index) in images" :key="index" class="a-carousel-slide">
          <img :src="img" :alt="'Carousel image ' + (index + 1)" class="a-carousel-image" />
        </div>
      </div>
      
      <button class="a-carousel-button a-carousel-button-prev" @click="goToPrevious" v-if="images.length > 1">
        ‹
      </button>
      <button class="a-carousel-button a-carousel-button-next" @click="goToNext" v-if="images.length > 1">
        ›
      </button>
      
      <div class="a-carousel-indicators" v-if="images.length > 1">
        <button 
          v-for="(_, index) in images" 
          :key="index"
          :class="['a-carousel-indicator', { active: index === currentIndex }]"
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.a-carousel-container {
  margin: 1.5rem 0;
}

.a-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.a-carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.a-carousel-slide {
  min-width: 100%;
  height: 500px;
}

.a-carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.a-carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.3s;
  z-index: 10;
}

.a-carousel-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.a-carousel-button-prev {
  left: 1rem;
}

.a-carousel-button-next {
  right: 1rem;
}

.a-carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.a-carousel-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: background 0.3s;
}

.a-carousel-indicator.active {
  background: white;
}
</style>
