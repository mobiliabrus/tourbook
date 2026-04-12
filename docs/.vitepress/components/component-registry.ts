import type { App } from 'vue'

// Import all custom components
import AImg from './a-img/'
import AModal from './a-modal.vue'
import AFlight from './a-flight.vue'
import AHotel from './a-hotel.vue'
import ATimes from './a-times.vue'
import ASecret from './a-secret.vue'
import ACarousel from './a-carousel.vue'
import Map from './ol-map/index.vue'
import AClose from './a-close.vue'
import APlaceholder from './a-placeholder.vue'
import ALazyload from './a-lazyload.vue'
import AGallery from './a-gallery.vue'
import ADivelog from './a-divelog.vue'

// Define component mapping table
export const componentRegistry = {
  'AImg': AImg,
  'a-img': AImg,
  'A-img': AImg,
  'AModal': AModal,
  'a-modal': AModal,
  'AMap': Map,
  'a-map': Map,
  'A-map': Map,
  'AFlight': AFlight,
  'a-flight': AFlight,
  'AHotel': AHotel,
  'a-hotel': AHotel,
  'ATimes': ATimes,
  'a-times': ATimes,
  'ASecret': ASecret,
  'a-secret': ASecret,
  'ACarousel': ACarousel,
  'a-carousel': ACarousel,
  'AClose': AClose,
  'a-close': AClose,
  'APlaceholder': APlaceholder,
  'a-placeholder': APlaceholder,
  'ALazyload': ALazyload,
  'a-lazyload': ALazyload,
  'AGallery': AGallery,
  'a-gallery': AGallery,
  'ADivelog': ADivelog,
  'a-divelog': ADivelog,
  'A-divelog': ADivelog,
} as const

/**
 * Register all custom components to Vue app instance
 * @param app Vue app instance
 */
export function registerComponents(app: App) {
  Object.entries(componentRegistry).forEach(([name, component]) => {
    app.component(name, component)
  })
}

/**
 * Get component definition by component name
 * @param name Component name
 * @returns Component definition or undefined
 */
export function getComponentByName(name: string) {
  return componentRegistry[name as keyof typeof componentRegistry]
}

export default componentRegistry
