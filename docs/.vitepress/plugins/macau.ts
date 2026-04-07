import type MarkdownIt from 'markdown-it'
import { load } from 'js-yaml'

export default function markdownItMacau(md: MarkdownIt) {
  const defaultFenceRenderer = md.renderer.rules.fence || function (tokens: any[], idx: number, options: any, env: any, self: any) {
    return self.renderToken(tokens, idx, options);
  }
  
  // 保存原始的 fence 规则
  const originalFence = md.renderer.rules.fence
  
  // 自定义 fence 规则来处理 ```<componentName> 代码块
  md.renderer.rules.fence = function (tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx]
    const info = token.info ? token.info.trim() : ''
    const content = token.content.trim()
    
    // 检查是否是以 <componentName> 开头的代码块（支持大小写和连字符）
    const componentMatch = info.match(/^<([a-zA-Z][a-zA-Z0-9\-]*)>/)
    
    if (componentMatch) {
      const componentName = componentMatch[1]
      // 转换为大写字母开头的组件名（Vue 组件命名规范）
      const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
      console.log('[Macau] Component matched:', pascalCaseName)
      
      try {
        // 使用官方的 js-yaml 解析 YAML 内容
        const attrs = load(content) as Record<string, any> || {}
        
        // 构建 Vue 组件标签
        const attrString = Object.entries(attrs)
          .map(([key, value]) => {
            // 根据值类型决定是否需要引号
            if (typeof value === 'boolean' || typeof value === 'number' || value === null) {
              return `:${key}="${value}"`
            } else if (typeof value === 'string') {
              // 转义字符串中的特殊字符
              const escapedValue = value
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;');
              return `${key}="${escapedValue}"`
            } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
              return `:${key}="${JSON.stringify(value)}"`
            } else {
              return `:${key}="${JSON.stringify(value)}"`
            }
          })
          .join(' ')
        
        // 返回自闭合标签
        return `<${pascalCaseName}${attrString ? ' ' + attrString : ''} />`
        
      } catch (e) {
        // YAML 解析失败时，返回错误信息
        console.error(`[Macau] Failed to parse YAML for component ${pascalCaseName}:`, e)
        return `<div style="color: red; padding: 1rem;">Invalid YAML format: ${(e as Error).message}</div>`
      }
    }
    
    // 其他情况使用默认的 fence 渲染
    if (originalFence) {
      return originalFence(tokens, idx, options, env, self);
    } else {
      return defaultFenceRenderer(tokens, idx, options, env, self);
    }
  }
}