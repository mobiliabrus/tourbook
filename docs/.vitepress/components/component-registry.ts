import type { App } from 'vue'

// Import all custom components
import AImg from './a-img.vue'
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

/**
 * Convert component name to kebab-case for consistent lookup
 */
export function normalizeComponentName(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

// Define component mapping table (using standard kebab-case names)
export const componentRegistry = {
  'a-img': AImg,
  'a-modal': AModal,
  'a-map': Map,
  'a-flight': AFlight,
  'a-hotel': AHotel,
  'a-times': ATimes,
  'a-secret': ASecret,
  'a-carousel': ACarousel,
  'a-close': AClose,
  'a-placeholder': APlaceholder,
  'a-lazyload': ALazyload,
  'a-gallery': AGallery,
  'a-divelog': ADivelog,
} as const

/**
 * Register all custom components to Vue app instance
 * @param app Vue app instance
 */
export function registerComponents(app: App) {
  Object.entries(componentRegistry).forEach(([name, component]) => {
    // Register both kebab-case and PascalCase versions
    app.component(name, component)
    const pascalName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
    app.component(pascalName, component)
  })
}

/**
 * Get component definition by component name
 * @param name Component name
 * @returns Component definition or undefined
 */
export function getComponentByName(name: string) {
  const normalizedName = normalizeComponentName(name)
  return componentRegistry[normalizedName as keyof typeof componentRegistry]
}

export default componentRegistry
