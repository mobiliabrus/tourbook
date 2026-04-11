import type { App } from 'vue'

// 导入所有自定义组件
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

// 定义组件映射表
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
} as const

/**
 * 注册所有自定义组件到 Vue 应用实例
 * @param app Vue 应用实例
 */
export function registerComponents(app: App) {
  Object.entries(componentRegistry).forEach(([name, component]) => {
    app.component(name, component)
  })
}

/**
 * 根据组件名称获取组件定义
 * @param name 组件名称
 * @returns 组件定义或 undefined
 */
export function getComponentByName(name: string) {
  return componentRegistry[name as keyof typeof componentRegistry]
}

export default componentRegistry
