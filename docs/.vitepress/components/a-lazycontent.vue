<script setup lang="ts">
import { ref } from 'vue';
import Lazyload from './a-lazyload.vue';
import Placeholder from './a-placeholder.vue';

const loaded = ref(false);

const onLoad = () => {
  loaded.value = true;
};
</script>

<template>
  <Lazyload @load="onLoad">
    <slot v-if="loaded" name="default"></slot>
    <Placeholder v-else />
  </Lazyload>
</template>
