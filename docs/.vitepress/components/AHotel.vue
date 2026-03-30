<script setup lang="ts">
const props = defineProps<{
  name?: string
  date?: string
  nights?: number
}>()
</script>

<template>
  <div class="a-hotel-container">
    <div class="a-hotel-card">
      <div class="a-hotel-header">
        <span class="a-hotel-icon">🏨</span>
        <span class="a-hotel-title">Hotel</span>
      </div>
      <div class="a-hotel-content">
        <div v-if="name" class="a-hotel-name">{{ name }}</div>
        <div class="a-hotel-details">
          <span v-if="date" class="a-hotel-detail">📅 {{ date }}</span>
          <span v-if="nights" class="a-hotel-detail">🌙 {{ nights }} night{{ nights > 1 ? 's' : '' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.a-hotel-container {
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
}

.a-hotel-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 350px;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.a-hotel-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: white;
}

.a-hotel-icon {
  font-size: 1.5rem;
}

.a-hotel-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.a-hotel-content {
  color: white;
}

.a-hotel-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.a-hotel-details {
  display: flex;
  gap: 1.5rem;
  font-size: 0.95rem;
  opacity: 0.95;
}

.a-hotel-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
