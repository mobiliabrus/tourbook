import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import './styles.css'

import CustomLayout from './Layout.vue'

import { registerComponents } from '../components/component-registry'

// 引入 vconsole
import VConsole from 'vconsole'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    registerComponents(app)
    
    // 仅在客户端初始化 vConsole
    if (typeof window !== 'undefined') {
      // 检查是否为移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // 可以通过 URL 参数控制是否启用 vConsole,例如 ?debug=true
      const urlParams = new URLSearchParams(window.location.search)
      const enableDebug = urlParams.get('debug') === 'true' || 
                         urlParams.get('vconsole') === 'true'
      
      // 在移动设备上或明确指定 debug 模式时启用 vConsole
      if ((isMobile || enableDebug) && !(window as any).vConsole) {
        new VConsole()
        console.log('vConsole initialized')
      }
    }
  },
} satisfies Theme
