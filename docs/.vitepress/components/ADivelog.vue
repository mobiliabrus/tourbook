<script setup lang="ts">
const props = defineProps<{
  site?: string
  depth?: number
  time?: number
  date?: string
}>()
</script>

<template>
  <div class="a-divelog-container">
    <div class="a-divelog-card">
      <div class="a-divelog-header">
        <span class="a-divelog-icon">🤿</span>
        <span class="a-divelog-title">Dive Log</span>
      </div>
      <div class="a-divelog-content">
        <div v-if="site" class="a-divelog-item">
          <span class="a-divelog-label">Site:</span>
          <span class="a-divelog-value">{{ site }}</span>
        </div>
        <div v-if="depth" class="a-divelog-item">
          <span class="a-divelog-label">Depth:</span>
          <span class="a-divelog-value">{{ depth }}m</span>
        </div>
        <div v-if="time" class="a-divelog-item">
          <span class="a-divelog-label">Time:</span>
          <span class="a-divelog-value">{{ time }}min</span>
        </div>
        <div v-if="date" class="a-divelog-item">
          <span class="a-divelog-label">Date:</span>
          <span class="a-divelog-value">{{ date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.a-divelog-container {
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
}

.a-divelog-card {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 350px;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.a-divelog-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: white;
}

.a-divelog-icon {
  font-size: 1.5rem;
}

.a-divelog-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.a-divelog-content {
  color: white;
}

.a-divelog-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.a-divelog-item:last-child {
  border-bottom: none;
}

.a-divelog-label {
  font-weight: 600;
  opacity: 0.9;
}

.a-divelog-value {
  opacity: 0.95;
}
</style>
