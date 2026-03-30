<script setup lang="ts">
const props = defineProps<{
  times?: number
  location?: string
}>()
</script>

<template>
  <div class="a-times-container">
    <div class="a-times-badge">
      <span class="a-times-icon">🔄</span>
      <span class="a-times-count">{{ times }}</span>
      <span class="a-times-label">visit{{ (times || 0) !== 1 ? 's' : '' }}</span>
      <span v-if="location" class="a-times-location">in {{ location }}</span>
    </div>
  </div>
</template>

<style scoped>
.a-times-container {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

.a-times-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 20px;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.a-times-icon {
  font-size: 1.2rem;
}

.a-times-count {
  font-size: 1.3rem;
  font-weight: 700;
}

.a-times-label {
  font-size: 0.9rem;
}

.a-times-location {
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
