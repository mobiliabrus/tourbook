import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import './styles.css'

import CustomLayout from './Layout.vue'

import { registerComponents } from '../components/component-registry'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    registerComponents(app)
  },
} satisfies Theme
