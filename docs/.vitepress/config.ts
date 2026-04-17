import { defineConfig } from 'vitepress'
import macauPkg from 'markdown-it-macau'

// markdown-it-macau 导出的是 { default: fn }，需要提取实际的函数
const markdownItMacau = (macauPkg as any).default || macauPkg

export default defineConfig({
  lang: 'en-UK',
  title: 'Tourbook',
  description: 'Fragments of journeys, echoes of encounters.',
  base: '/tourbook/',
  appearance: false,

  srcDir: './',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['script', {}, `
      // Override default viewport to disable zooming
      (function() {
        function updateViewport() {
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
          } else {
            // If viewport doesn't exist yet, create it
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
          }
        }
        
        // Try immediately and on DOMContentLoaded
        updateViewport();
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', updateViewport);
        }
        // Also try after a short delay to ensure VitePress has rendered
        setTimeout(updateViewport, 0);
      })();
      
      if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
              console.log('SW registration failed: ', registrationError);
            });
        });
      }
    `]
  ],
  
  vite: {
    ssr: {
      noExternal: ['@vue/server-renderer']
    }
  },
  
  themeConfig: {
    // 全局关闭上一页/下一页导航
    docFooter: {
      prev: false,
      next: false,
    },
    
    sidebar: [
      { text: 'INTRO', link: '/' },
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

    outline: {
      label: 'In this section'
    },
    
    socialLinks: [],
    
    footer: {
      message: 'Tourbook',
      copyright: 'Copyright © 2026',
    },
  },
  
  markdown: {
    config: (md) => {
      md.use(markdownItMacau)
    },
  },
})