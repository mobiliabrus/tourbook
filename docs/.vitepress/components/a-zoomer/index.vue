<script setup lang="ts">
import { useZoomer, type UseZoomerOptions } from './useZoomer'
import './vue-zoomer.css'

const props = withDefaults(defineProps<UseZoomerOptions>(), {
  minScale: 1,
  maxScale: 5,
  resetTrigger: 1e5,
  aspectRatio: 1,
  backgroundColor: 'transparent',
  pivot: 'cursor',
  zoomingElastic: true,
  limitTranslation: true,
  doubleClickToZoom: true,
  mouseWheelToZoom: true,
})

const emit = defineEmits<{
  'update:zoomed': [value: boolean]
  swipe: [direction: 'left' | 'right']
}>()

const {
  root,
  wrapperStyle,
  backgroundColor,
  onMouseWheel,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  setPointerPosCenter,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
} = useZoomer(props)
</script>

<template>
  <div
    ref="root"
    class="vue-zoomer"
    :style="{ backgroundColor }"
    @mousewheel="onMouseWheel"
    @DOMMouseScroll="onMouseWheel"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
    @mouseout="setPointerPosCenter"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchmove="onTouchMove"
  >
    <div class="zoomer" :style="wrapperStyle">
      <slot></slot>
    </div>
  </div>
</template>
