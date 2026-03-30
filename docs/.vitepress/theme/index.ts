import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import './styles.css'

import AImg from '../components/AImg.vue'
import AFlight from '../components/a-flight/index.vue'
import AHotel from '../components/AHotel.vue'
import ATimes from '../components/ATimes.vue'
import ASecret from '../components/ASecret.vue'
import ACarousel from '../components/ACarousel.vue'
import ABg from '../components/ABg.vue'
import AGallery from '../components/AGallery.vue'
import ADivelog from '../components/ADivelog.vue'
import ALazyContent from '../components/ALazyContent.vue'
import Map from '../components/ol-map/index.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AImg', AImg)
    app.component('a-img', AImg)
    app.component('AMap', Map)
    app.component('a-map', Map)
    app.component('AFlight', AFlight)
    app.component('a-flight', AFlight)
    app.component('AHotel', AHotel)
    app.component('a-hotel', AHotel)
    app.component('ATimes', ATimes)
    app.component('a-times', ATimes)
    app.component('ASecret', ASecret)
    app.component('a-secret', ASecret)
    app.component('ACarousel', ACarousel)
    app.component('a-carousel', ACarousel)
    app.component('ABg', ABg)
    app.component('a-bg', ABg)
    app.component('AGallery', AGallery)
    app.component('a-gallery', AGallery)
    app.component('ADivelog', ADivelog)
    app.component('a-divelog', ADivelog)
    app.component('ALazyContent', ALazyContent)
    app.component('a-lazycontent', ALazyContent)
  },
} satisfies Theme
