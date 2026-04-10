import MarkdownIt from 'markdown-it'
import macauPkg from 'markdown-it-macau'
import { h, type VNode } from 'vue'
import { componentRegistry } from './component-registry'

const markdownItMacau = (macauPkg as any).default || macauPkg

/**
 * 创建一个简化的 markdown 渲染器（用于 a-secret 组件）
 * 集成 macau 插件以支持自定义组件
 */
function createMarkdownRenderer(): MarkdownIt {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })

  // 集成 macau 插件以支持自定义组件语法
  md.use(markdownItMacau)

  return md
}

// 创建单例实例
const md = createMarkdownRenderer()

/**
 * 将 markdown 内容渲染为 HTML 字符串
 * 注意：此方法仅生成 HTML 字符串，不包含 Vue 组件功能
 * @param content Markdown 内容
 * @returns HTML 字符串
 */
export function renderMarkdown(content: string): string {
  try {
    return md.render(content)
  } catch (error) {
    console.error('Failed to render markdown:', error)
    return content
  }
}

/**
 * 解析 HTML 字符串中的自定义组件标签
 * 将 <AImg name="test" /> 等标签转换为可识别的格式
 * @param html HTML 字符串
 * @returns 解析后的 tokens 数组
 */
export function parseComponentTags(html: string): Array<{
  type: 'text' | 'component'
  content: string
  componentName?: string
  props?: Record<string, any>
}> {
  const tokens: Array<{
    type: 'text' | 'component'
    content: string
    componentName?: string
    props?: Record<string, any>
  }> = []

  // 匹配自定义组件标签的正则表达式
  const componentRegex = /<(A[A-Z][a-zA-Z0-9]*|a-[a-z-]+)(\s+[^>]*)?\s*\/?>/gi
  
  let lastIndex = 0
  let match

  while ((match = componentRegex.exec(html)) !== null) {
    // 添加普通文本
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        content: html.slice(lastIndex, match.index),
      })
    }

    const componentName = match[1]
    const attrsString = match[2] || ''
    
    // 解析属性
    const props: Record<string, any> = {}
    // 匹配两种形式：key="value" 或 key（布尔属性）
    const attrRegex = /(:?)([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g
    let attrMatch
    
    while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
      const isBinding = attrMatch[1]
      const key = attrMatch[2]
      const hasValue = attrMatch[3] !== undefined || attrMatch[4] !== undefined
      const value = attrMatch[3] !== undefined ? attrMatch[3] : attrMatch[4]

      // 如果没有值，说明是布尔属性（如 autoload、disabled），设置为 true
      if (!hasValue) {
        props[key] = true
      } else if (isBinding) {
        // 尝试解析 JavaScript 表达式（如 :name="{}"、:count="123"）
        try {
          // 使用 Function 构造器安全地解析 JavaScript 表达式
          // 这种方式可以处理对象字面量、数组、布尔值、数字等
          const parsed = new Function(`return ${value}`)()
          props[key] = parsed
        } catch {
          // 如果解析失败，保持原始字符串值
          props[key] = value
        }
      } else {
        // 普通字符串属性
        props[key] = value
      }
    }

    tokens.push({
      type: 'component',
      content: match[0],
      componentName,
      props,
    })

    lastIndex = match.index + match[0].length
  }

  // 添加剩余的文本
  if (lastIndex < html.length) {
    tokens.push({
      type: 'text',
      content: html.slice(lastIndex),
    })
  }

  return tokens
}

/**
 * 将解析后的 tokens 转换为 Vue VNodes
 * 用于在运行时动态渲染包含自定义组件的内容
 * @param tokens 解析后的 tokens 数组
 * @returns VNode 数组
 */
export function renderTokensAsVNodes(tokens: ReturnType<typeof parseComponentTags>): VNode[] {
  return tokens.map((token, index) => {
    if (token.type === 'text') {
      // 对于普通文本，直接返回文本节点
      return h('span', { key: index, innerHTML: token.content })
    } else if (token.type === 'component' && token.componentName) {
      // 查找注册的组件
      const Component = componentRegistry[token.componentName as keyof typeof componentRegistry]
      
      if (Component) {
        // 如果找到组件，渲染它
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return h(Component as any, { key: index, ...token.props })
      } else {
        // 如果未找到组件，返回原始 HTML
        console.warn(`Component "${token.componentName}" not found in registry`)
        return h('span', { key: index, innerHTML: token.content })
      }
    }
    
    return h('span', { key: index })
  })
}

/**
 * 将 Markdown 内容渲染为 Vue VNodes
 * 这是完整的渲染流程：Markdown -> HTML -> 解析组件标签 -> VNodes
 * @param content Markdown 内容
 * @returns VNode 数组
 */
export function renderMarkdownToVNodes(content: string): VNode[] {
  const html = renderMarkdown(content)
  const tokens = parseComponentTags(html)
  return renderTokensAsVNodes(tokens)
}
