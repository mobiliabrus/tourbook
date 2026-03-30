<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useFullscreenWithScroll } from '../../composables/useFullscreenWithScroll';
import { propsType } from './constant';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Close from '../a-close';
import { parsePoints, parseFlights } from './util';
import { createPoints } from './sources/points';
import { createRoute } from './sources/route';
import { createFlights } from './sources/flights';
import { style } from './style';
import diveSiteIcon from './statics/divesite';
import olms from 'ol-mapbox-style';

const mapRef = ref(undefined);
const mapInstance = ref(null);

const { handleFullscreen, isFullscreen } = useFullscreenWithScroll();

const props = defineProps(propsType);
const theme = props.theme;
const maxZoom = props.zoom;
const mapHeight = props.height;
const mapPadding = props.padding;
const routeJSON = props.route;
const flightsData = parseFlights(props.flights);
const diveSitesData = parsePoints(props.divesites);
const pointsData = parsePoints(props.points);

let fitView = () => {};
const initMap = () => {
  olms(
    mapRef.value,
    `https://api.maptiler.com/maps/${theme}/style.json?key=K18uxgT9BWfvlkwGw6VG`
  ).then((map) => {
    mapInstance.value = map;

    // Control
    map.getControls().clear();

    // View
    const view = map.getView();

    // Vector
    const vectorSource = new VectorSource();
    createPoints(vectorSource, pointsData);
    createPoints(vectorSource, diveSitesData, { url: diveSiteIcon });
    createRoute(vectorSource, routeJSON);
    createFlights(vectorSource, flightsData);

    // Layer
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style,
      zIndex: 10,
    });

    map.addLayer(vectorLayer);

    fitView = () => {
      const extent = vectorSource.getExtent();
      view.fit(extent, {
        padding: mapPadding,
        maxZoom: maxZoom || 18,
        duration: 0,
      });
    };

    // Fit view
    if (routeJSON || flightsData || pointsData.length > 0 || diveSitesData.length > 0) {
      fitView();
    }
  });
};

const handleFullscreenClick = () => {
  handleFullscreen(mapRef.value);
};

watch(isFullscreen, () => {
  setTimeout(fitView, 0);
});

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.setTarget(null);
    mapInstance.value = null;
  }
});
</script>

<template>
  <div ref="mapRef" class="map-container" :style="{ height: mapHeight }">
    <div class="fullscreen-hint" v-if="!isFullscreen" @click="handleFullscreenClick" />
    <div class="fullscreen-exit" v-else @click="handleFullscreenClick"><Close /></div>
  </div>
</template>

<style>
.ol-overlaycontainer-stopevent {
  display: none;
}
</style>

<style scoped>
.map-container {
  position: relative;
  background-color: #f0f0f0;
  width: 100%;
  height: 30vw;
  min-height: 160px;
  max-height: 30vh;
  border: 1px solid #ccc;
  overflow: hidden;
}

.fullscreen-hint {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 9007199254740991;
}

.fullscreen-exit {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 25px;
  height: 25px;
  background: rgba(0, 0, 0, 0.25);
  z-index: 9007199254740991;
}
</style>
