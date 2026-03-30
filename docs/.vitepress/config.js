import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'Tourbook',
  description: 'Confidence, Strong and Handsome.',
  
  srcDir: './',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  
  themeConfig: {
    sidebar: [
      {
        text: 'PROLOGUE',
        items: [
          { text: 'Episode I. Beginnings', link: '/episode-1' },
          { text: 'Episode II. Fastprimes', link: '/episode-2' },
        ],
      },
      {
        text: 'MAIN CHRONICLES',
        items: [
          { text: 'I. Long, Solitary Tour', link: '/1-tour' },
          { text: 'II. The Backpacker', link: '/2-tour' },
          { text: 'III. The Three Trees', link: '/3-tour' },
          { text: 'IV. Lonely Soul', link: '/4-tour' },
          { text: 'V. Interlude', link: '/5-tour' },
          { text: "VI. Redemption's Echo", link: '/6-tour' },
          { text: 'VII. Final Journey', link: '/7-tour' },
        ],
      },
      { text: 'Appendix', link: '/appendix' },
    ],
    
    socialLinks: [],
    
    footer: {
      message: 'Tourbook',
      copyright: 'Copyright © 2026',
    },
  },
  
  markdown: {
    config: (md) => {
      // 自定义 markdown 配置
    },
  },
})
