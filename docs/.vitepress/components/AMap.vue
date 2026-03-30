<script setup lang="ts">
import { computed } from 'vue'

interface Point {
  lng: number
  lat: number
  name: string
}

const props = defineProps<{
  points?: string
  flights?: string
  theme?: string
}>()

const parsedPoints = computed<Point[]>(() => {
  if (!props.points) return []
  return props.points.split('|').map(point => {
    const [lng, lat, name] = point.split(',')
    return {
      lng: parseFloat(lng),
      lat: parseFloat(lat),
      name: name || ''
    }
  })
})

const mapUrl = computed(() => {
  if (parsedPoints.value.length === 0) return ''
  const center = parsedPoints.value[Math.floor(parsedPoints.value.length / 2)]
  return `https://www.google.com/maps?q=${center.lat},${center.lng}&z=10`
})
</script>

<template>
  <div class="a-map-container">
    <div class="a-map-header">
      <span class="a-map-title">📍 Travel Map</span>
    </div>
    <div class="a-map-content">
      <div v-if="parsedPoints.length > 0" class="a-map-points">
        <div v-for="(point, index) in parsedPoints" :key="index" class="a-map-point">
          <span class="a-map-point-icon">📍</span>
          <span class="a-map-point-name">{{ point.name }}</span>
          <span class="a-map-point-coords">{{ point.lat }}, {{ point.lng }}</span>
        </div>
      </div>
      <a :href="mapUrl" target="_blank" class="a-map-link" v-if="parsedPoints.length > 0">
        Open in Google Maps →
      </a>
      <div v-else class="a-map-placeholder">
        Map data not available
      </div>
    </div>
  </div>
</template>

<style scoped>
.a-map-container {
  margin: 1.5rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.a-map-header {
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.a-map-title {
  font-weight: 600;
  color: #333;
}

.a-map-content {
  padding: 1rem;
}

.a-map-points {
  margin-bottom: 1rem;
}

.a-map-point {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.a-map-point:last-child {
  border-bottom: none;
}

.a-map-point-icon {
  font-size: 1.2rem;
}

.a-map-point-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.a-map-point-coords {
  font-size: 0.85rem;
  color: #999;
}

.a-map-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #1890ff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.a-map-link:hover {
  background: #40a9ff;
}

.a-map-placeholder {
  padding: 2rem;
  text-align: center;
  color: #999;
}
</style>
