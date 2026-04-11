<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

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
})

const detail = ref(false)

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
  <div aria-hidden="true">
    <div><b>{{ name }}</b></div>
    <div @click="switchDetail" style="margin-bottom:16px">
      <i>{{ from }}</i>
      <i>{{ to }}</i>
    </div>
  </div>
</template>
