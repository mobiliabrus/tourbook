<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import Close from './a-close.vue'
import Zoomer from './a-zoomer/index.vue'

const props = defineProps({
  scale: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['popover'])

const visible = ref(false)
const zoomerRef = ref<InstanceType<typeof Zoomer> | null>(null)

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

const zoomIn = (s: number) => {
  if (zoomerRef.value) {
    zoomerRef.value.zoomIn(s)
  }
}

const reset = () => {
  if (zoomerRef.value) {
    zoomerRef.value.reset()
  }
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
        <Zoomer ref="zoomerRef" style="width:100%;height:100%;">
          <slot name="popover"></slot>
        </Zoomer>
      </div>
      <div @click="pop">
        <slot name="default"></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="less">
.a-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #000;
  z-index: 2147483647;
  overflow: hidden;
  transform: translateZ(0);
}

.a-modal-close {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 2147483646;
}

.a-modal-actions {
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 0;
  margin-bottom: 24px;
  padding: 15px 15px;
  z-index: 2147483646;
}
</style>
