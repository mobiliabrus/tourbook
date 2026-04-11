import MarkdownIt from 'markdown-it'
import macauPkg from 'markdown-it-macau'
import anchorPlugin from 'markdown-it-anchor'
import { h, type VNode } from 'vue'
import { componentRegistry } from './component-registry'

const markdownItMacau = (macauPkg as any).default || macauPkg

/**
 * Create a simplified markdown renderer (for a-secret component)
 * Integrates macau plugin to support custom components
 */
function createMarkdownRenderer(): MarkdownIt {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })

  // Integrate macau plugin to support custom component syntax
  md.use(markdownItMacau)

  // Integrate anchor plugin to support heading anchors
  md.use(anchorPlugin, {
    permalink: anchorPlugin.permalink.ariaHidden({
      class: 'header-anchor',
      symbol: '&ZeroWidthSpace;',
      placement: 'after',
    }),
    slugify: (s: string) =>
      encodeURIComponent(
        String(s)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
      ),
  })

  return md
}

// Create singleton instance
const md = createMarkdownRenderer()

/**
 * Render markdown content as HTML string
 * Note: This method only generates HTML string, without Vue component functionality
 * @param content Markdown content
 * @returns HTML string
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
 * Parse custom component tags in HTML string
 * Convert tags like <AImg name="test" /> to recognizable format
 * @param html HTML string
 * @returns Parsed tokens array
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

  // Regular expression to match custom component tags
  const componentRegex = /<(A[A-Z][a-zA-Z0-9]*|a-[a-z-]+)(\s+[^>]*)?\s*\/?>/gi
  
  let lastIndex = 0
  let match

  while ((match = componentRegex.exec(html)) !== null) {
    // Add plain text
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        content: html.slice(lastIndex, match.index),
      })
    }

    const componentName = match[1]
    const attrsString = match[2] || ''
    
    // Parse attributes
    const props: Record<string, any> = {}
    // Match two forms: key="value" or key (boolean attribute)
    const attrRegex = /(:?)([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g
    let attrMatch
    
    while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
      const isBinding = attrMatch[1]
      const key = attrMatch[2]
      const hasValue = attrMatch[3] !== undefined || attrMatch[4] !== undefined
      const value = attrMatch[3] !== undefined ? attrMatch[3] : attrMatch[4]

      // If no value, it's a boolean attribute (like autoload, disabled), set to true
      if (!hasValue) {
        props[key] = true
      } else if (isBinding) {
        // Try to parse JavaScript expression (like :name="{}", :count="123")
        try {
          // Use Function constructor to safely parse JavaScript expressions
          // This approach can handle object literals, arrays, booleans, numbers, etc.
          const parsed = new Function(`return ${value}`)()
          props[key] = parsed
        } catch {
          // If parsing fails, keep the original string value
          props[key] = value
        }
      } else {
        // Normal string attribute
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

  // Add remaining text
  if (lastIndex < html.length) {
    tokens.push({
      type: 'text',
      content: html.slice(lastIndex),
    })
  }

  return tokens
}

/**
 * Convert parsed tokens to Vue VNodes
 * Used for dynamically rendering content containing custom components at runtime
 * @param tokens Parsed tokens array
 * @returns VNode array
 */
export function renderTokensAsVNodes(tokens: ReturnType<typeof parseComponentTags>): VNode[] {
  return tokens.map((token, index) => {
    if (token.type === 'text') {
      // For plain text, return text node directly
      return h('span', { key: index, innerHTML: token.content })
    } else if (token.type === 'component' && token.componentName) {
      // Find registered component
      const Component = componentRegistry[token.componentName as keyof typeof componentRegistry]
      
      if (Component) {
        // If component is found, render it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return h(Component as any, { key: index, ...token.props })
      } else {
        // If component not found, return original HTML
        console.warn(`Component "${token.componentName}" not found in registry`)
        return h('span', { key: index, innerHTML: token.content })
      }
    }
    
    return h('span', { key: index })
  })
}

/**
 * Render Markdown content as Vue VNodes
 * This is the complete rendering flow: Markdown -> HTML -> Parse component tags -> VNodes
 * @param content Markdown content
 * @returns VNode array
 */
export function renderMarkdownToVNodes(content: string): VNode[] {
  const html = renderMarkdown(content)
  const tokens = parseComponentTags(html)
  return renderTokensAsVNodes(tokens)
}
