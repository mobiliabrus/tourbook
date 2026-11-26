<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { Modal } from 'ant-design-vue'
import OlMap from './ol-map/index.vue'
import Close from './a-close.vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: '',
  },
  nights: {
    type: [String, Number],
    default: 0,
  },
  point: {
    type: String,
    default: '',
  },
  points: {
    type: String,
    default: '',
  },
})

const detail = ref(false)
const mapVisible = ref(false)

const mapPoint = computed(() => {
  const value = (props.point || props.points).trim()
  const parts = value.split(',')
  if (parts.length !== 2 || parts.some((part) => !part.trim())) return ''

  const [lng, lat] = parts.map(Number)
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return ''
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return ''
  return `${lng},${lat}`
})

const mapPoints = computed(() => mapPoint.value ? `${mapPoint.value},${props.name}` : '')

const from = computed(() => {
  if (!props.date) return ''
  return dayjs(props.date).format('D MMM, YYYY')
})

const to = computed(() => {
  if (!props.date || !props.nights) return ''
  const nightsNum = Number(props.nights)
  if (detail.value) {
    return ` - ${dayjs(props.date).add(nightsNum, 'd').format('D MMM, YYYY')}`
  }
  return `, ${nightsNum} night${nightsNum > 1 ? 's' : ''}`
})

const switchDetail = () => {
  detail.value = !detail.value
}
</script>

<template>
  <div class="a-hotel">
    <div class="a-hotel-name">
      <b>{{ name }}</b>
      <button
        v-if="mapPoint"
        type="button"
        class="a-hotel-map-button"
        :aria-label="`Show ${name} on map`"
        title="Show on map"
        @click="mapVisible = true"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
          <circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8" />
        </svg>
      </button>
    </div>
    <div @click="switchDetail" style="margin-bottom:16px">
      <i>{{ from }}</i>
      <i>{{ to }}</i>
    </div>
    <Modal
      v-model:open="mapVisible"
      :title="null"
      :footer="null"
      :closable="false"
      width="100vw"
      wrap-class-name="a-hotel-map-modal"
      :destroy-on-close="true"
    >
      <OlMap :points="mapPoints" :zoom="15" height="100dvh" />
      <button class="a-hotel-map-close" type="button" aria-label="Close map" @click="mapVisible = false">
        <Close />
      </button>
    </Modal>
  </div>
</template>

<style scoped>
.a-hotel-name {
  display: flex;
  align-items: center;
  gap: 6px;
}

.a-hotel-map-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  color: var(--vp-c-brand-1);
  background: transparent;
  cursor: pointer;
}

.a-hotel-map-button:hover,
.a-hotel-map-button:focus-visible {
  color: var(--vp-c-brand-2);
  background: var(--vp-c-default-soft);
}

.a-hotel-map-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
</style>

<style>
.a-hotel-map-modal .ant-modal-wrap {
  overflow: hidden;
}

.a-hotel-map-modal .ant-modal {
  top: 0;
  width: 100vw !important;
  max-width: none;
  margin: 0;
  padding: 0;
}

.a-hotel-map-modal .ant-modal-content {
  padding: 0;
  border-radius: 0;
  background: #f0f0f0;
  box-shadow: none;
}

.a-hotel-map-modal .ant-modal-body {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.a-hotel-map-modal .map-container {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  max-height: none;
  margin: 0;
  border: 0;
}

.a-hotel-map-close {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 2147483646;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  padding: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.a-hotel-map-modal .fullscreen-hint,
.a-hotel-map-modal .fullscreen-exit {
  display: none;
}
</style>
