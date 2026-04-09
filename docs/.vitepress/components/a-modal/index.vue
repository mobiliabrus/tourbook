<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import Close from '../a-close.vue'
import './index.less'

const props = defineProps({
  scale: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['popover'])

const visible = ref(false)
const currentScale = ref(1)

const zoomIn = (s: number) => {
  currentScale.value = s
}

const reset = () => {
  currentScale.value = 1
}

const pop = () => {
  visible.value = true
  emit('popover')
  nextTick(() => {
    zoomIn(props.scale)
  })
  document.body.style.overflowY = 'hidden'
}

const close = () => {
  visible.value = false
  document.body.style.overflowY = 'auto'
  reset()
}

watch(
  () => props.scale,
  () => {
    nextTick(() => {
      if (props.scale) {
        zoomIn(props.scale)
      } else {
        reset()
      }
    })
  }
)

const transformStyle = computed(() => ({
  transform: `scale(${currentScale.value})`,
  transformOrigin: 'center center',
  transition: 'transform 0.3s ease',
}))
</script>

<template>
  <Teleport :disabled="!visible" to="body">
    <div style="line-height:initial" aria-hidden="true">
      <div v-if="visible" class="a-modal-wrapper">
        <div class="a-modal-close" @click="close">
          <Close />
        </div>
        <div class="a-modal-actions">
          <slot name="action"></slot>
        </div>
        <div class="a-modal-content" :style="transformStyle">
          <slot name="popover"></slot>
        </div>
      </div>
      <div @click="pop">
        <slot name="default"></slot>
      </div>
    </div>
  </Teleport>
</template>
