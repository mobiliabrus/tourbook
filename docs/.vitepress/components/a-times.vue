<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  times?: number
  location?: string
}>()

function convertToOrdinal(num: number = 1): string {
  const suffixes = ['st', 'nd', 'rd']
  const lastDigit = num % 10
  const suffix = suffixes[lastDigit - 1] || 'th'
  return '' + num + suffix
}

const text = computed(() => {
  return 'The ' + convertToOrdinal(props.times || 1) + ' time in ' + (props.location || '')
})
</script>

<template>
  <i>{{ text }}</i>
</template>
