<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';

/**
 * Calculate approximate full moon dates using lunar cycle algorithm
 */
function getFullMoonDates(year: number): Date[] {
  const fullMoons: Date[] = [];
  const referenceFullMoon = new Date(2025, 0, 6);
  const lunarCycleDays = 29.53;
  
  let currentDate = new Date(referenceFullMoon);
  
  while (currentDate.getFullYear() < year) {
    currentDate = new Date(currentDate.getTime() + lunarCycleDays * 24 * 60 * 60 * 1000);
  }
  
  while (currentDate.getFullYear() === year) {
    fullMoons.push(new Date(currentDate));
    currentDate = new Date(currentDate.getTime() + lunarCycleDays * 24 * 60 * 60 * 1000);
  }
  
  return fullMoons;
}

/**
 * Get Full Moon Party period (4 days before full moon to full moon day)
 */
function getPartyPeriod(fullMoonDate: Date): string {
  const start = dayjs(fullMoonDate).subtract(4, 'day').format('YYYY-MM-DD');
  const end = dayjs(fullMoonDate).format('YYYY-MM-DD');
  return `${start} - ${end}`;
}

/**
 * Calculate travel options for given years
 */
const result = computed(() => {
  const currentYear = dayjs().year();
  const years = [currentYear, currentYear + 1];
  
  const allPeriods: string[] = [];
  
  years.forEach(year => {
    const songkranStart = dayjs(`${year}-04-13`);
    const songkranEnd = dayjs(`${year}-04-15`);
    
    const fullMoons = getFullMoonDates(year);
    
    // Find the full moon just before Songkran
    const beforeSongkran = fullMoons
      .filter(fm => dayjs(fm).isBefore(songkranStart))
      .sort((a, b) => dayjs(b).valueOf() - dayjs(a).valueOf())[0];
    
    // Find the full moon just after Songkran
    const afterSongkran = fullMoons
      .filter(fm => dayjs(fm).isAfter(songkranEnd))
      .sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf())[0];
    
    if (beforeSongkran) {
      allPeriods.push(getPartyPeriod(beforeSongkran));
    }
    if (afterSongkran) {
      allPeriods.push(getPartyPeriod(afterSongkran));
    }
  });
  
  return allPeriods.join(', ');
});
</script>

<template>
  {{ result }}
</template>
