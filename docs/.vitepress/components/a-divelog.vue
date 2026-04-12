<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  no: {
    type: [String, Number],
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  objective: {
    type: String,
    required: false,
  },
  conditions: {
    type: String,
    required: false,
  },
  timein: {
    type: String,
    required: false,
  },
  timeout: {
    type: String,
    required: false,
  },
  depth: {
    type: [String, Number],
    required: false,
  },
  time: {
    type: [String, Number],
    required: false,
  },
  comment: {
    type: String,
    required: false,
  },
  buddy: {
    type: [String, Number],
    required: false,
  },
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  return dayjs(props.date).format('M/D/YY')
})

const parseTime = (timeStr: string | undefined) => {
  if (!timeStr) return { hours: 0, minutes: 0 }
  const [hours, minutes] = timeStr.split(':').map(Number)
  return { hours: hours || 0, minutes: minutes || 0 }
}

const diveProfile = computed(() => {
  const timeIn = parseTime(props.timein)
  const timeOut = parseTime(props.timeout)
  
  // Calculate dive duration if not provided
  let calculatedTime = props.time
  if (!calculatedTime && props.timein && props.timeout) {
    const totalMinutesIn = timeIn.hours * 60 + timeIn.minutes
    const totalMinutesOut = timeOut.hours * 60 + timeOut.minutes
    const duration = totalMinutesOut - totalMinutesIn
    if (duration > 0) {
      calculatedTime = `${duration}min`
    }
  }
  
  return {
    timeIn: `${String(timeIn.hours).padStart(2, '0')}:${String(timeIn.minutes).padStart(2, '0')}`,
    timeOut: `${String(timeOut.hours).padStart(2, '0')}:${String(timeOut.minutes).padStart(2, '0')}`,
    duration: calculatedTime || '-',
  }
})
</script>

<template>
  <div class="a-divelog">
    <div class="divelog-line">
      <span class="divelog-label">Dive #:</span>{{ no || '-' }}
      <span class="divelog-separator">|</span>
      <span class="divelog-label">Date:</span>{{ formattedDate || '-' }}
    </div>
    
    <div class="divelog-line">
      <span class="divelog-label">Location:</span>{{ location || '-' }}
      <span class="divelog-separator">|</span>
      <span class="divelog-label">Objective:</span>{{ objective || '-' }}
      <span class="divelog-separator">|</span>
      <span class="divelog-label">Cond:</span>{{ conditions || '-' }}
    </div>
    
    <div class="divelog-line divelog-time-line">
      <span class="divelog-label">In:</span>{{ diveProfile.timeIn }}
      <span class="divelog-separator">|</span>
      <span class="divelog-label">Out:</span>{{ diveProfile.timeOut }}
      <span class="divelog-separator">|</span>
      <span class="divelog-label">Depth:</span>{{ depth || '-' }}
      <span class="divelog-separator">|</span>
      <span class="divelog-label">Time:</span>{{ diveProfile.duration }}
    </div>
    
    <div v-if="comment" class="divelog-line divelog-comment-line">
      <span class="divelog-label">Comment:</span>{{ comment }}
      <span class="divelog-separator">|</span>
      <span class="divelog-label">Buddy:</span>#{{ buddy }}
    </div>
  </div>
</template>

<style scoped>
.a-divelog {
  font-size: 12px;
  padding: 8px 12px;
  margin: 12px 0;
  background: #f8f9fa;
  line-height: 1.8;
}

.divelog-line {
  margin-bottom: 2px;
}

.divelog-line:last-child {
  margin-bottom: 0;
}

.divelog-label {
  font-weight: 600;
  color: #666;
  margin-right: 4px;
}

.divelog-separator {
  margin: 0 8px;
  color: #ccc;
}

.divelog-time-line {
  font-size: 12px;
  color: #555;
  padding: 4px 0;
}

.divelog-comment-line {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px dashed #e0e0e0;
}
</style>
