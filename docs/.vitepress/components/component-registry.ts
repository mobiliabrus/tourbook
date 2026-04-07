import type { App } from 'vue'

// 导入所有自定义组件
import AImg from './AImg.vue'
import AFlight from './a-flight/index.vue'
import AHotel from './a-hotel/index.vue'
import ATimes from './a-times.js'
import ASecret from './a-secret.vue'
import ACarousel from './ACarousel.vue'
import ABg from './ABg.vue'
import AGallery from './AGallery.vue'
import ADivelog from './ADivelog.vue'
import ALazyContent from './ALazyContent.vue'
import Map from './ol-map/index.vue'

// 定义组件映射表
export const componentRegistry = {
  'AImg': AImg,
  'a-img': AImg,
  'AMap': Map,
  'a-map': Map,
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
  'ABg': ABg,
  'a-bg': ABg,
  'AGallery': AGallery,
  'a-gallery': AGallery,
  'ADivelog': ADivelog,
  'a-divelog': ADivelog,
  'ALazyContent': ALazyContent,
  'a-lazycontent': ALazyContent,
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
