import MarkdownIt from 'markdown-it'
import { load } from 'js-yaml'

/**
 * 创建一个简化的 markdown 渲染器（用于 a-secret 组件）
 * 不包含 macau 插件的自定义 fence 规则
 */
function createMarkdownRenderer(): MarkdownIt {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })

  return md
}

// 创建单例实例
const md = createMarkdownRenderer()

/**
 * 将 markdown 内容渲染为 HTML
 */
export function renderMarkdown(content: string): string {
  try {
    return md.render(content)
  } catch (error) {
    console.error('Failed to render markdown:', error)
    return content
  }
}
