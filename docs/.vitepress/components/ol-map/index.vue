<script setup>
import { ref } from 'vue';
import { propsType } from './constant';
import Lazyload from '../a-lazyload';
import Placeholder from '../a-placeholder';
import Map from './Map.vue';

const loaded = ref(false);

const props = defineProps(propsType);

const onLoad = () => {
  loaded.value = true;
};
</script>

<template>
  <Lazyload @load="onLoad">
    <Map v-if="loaded" v-bind="$props" />
    <Placeholder v-else />
  </Lazyload>
</template>
