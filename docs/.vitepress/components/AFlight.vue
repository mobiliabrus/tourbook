<script setup lang="ts">
const props = defineProps<{
  flight?: string
  departure?: string
  destination?: string
  departureTime?: string
  arriveTime?: string
}>()
</script>

<template>
  <div class="a-flight-container">
    <div class="a-flight-card">
      <div class="a-flight-header">
        <span class="a-flight-icon">✈️</span>
        <span class="a-flight-title">Flight</span>
        <span v-if="flight" class="a-flight-number">{{ flight }}</span>
      </div>
      <div class="a-flight-route">
        <div class="a-flight-location">
          <div class="a-flight-code">{{ departure }}</div>
          <div class="a-flight-label">Departure</div>
          <div v-if="departureTime" class="a-flight-time">{{ departureTime }}</div>
        </div>
        <div class="a-flight-path">
          <div class="a-flight-line"></div>
          <div class="a-flight-plane">→</div>
        </div>
        <div class="a-flight-location">
          <div class="a-flight-code">{{ destination }}</div>
          <div class="a-flight-label">Arrival</div>
          <div v-if="arriveTime" class="a-flight-time">{{ arriveTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.a-flight-container {
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
}

.a-flight-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 400px;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.a-flight-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  color: white;
}

.a-flight-icon {
  font-size: 1.5rem;
}

.a-flight-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.a-flight-number {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.a-flight-route {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.a-flight-location {
  flex: 1;
  text-align: center;
  color: white;
}

.a-flight-code {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.a-flight-label {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.a-flight-time {
  font-size: 0.9rem;
  opacity: 0.9;
}

.a-flight-path {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
}

.a-flight-line {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
  position: relative;
}

.a-flight-plane {
  font-size: 1.5rem;
  margin-top: -0.5rem;
  animation: fly 2s infinite;
}

@keyframes fly {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}
</style>
