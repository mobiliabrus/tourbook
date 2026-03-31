import type MarkdownIt from 'markdown-it'

/**
 * 简单的 YAML 解析器（支持基础类型）
 */
function parseSimpleYAML(content: string): Record<string, any> {
  const result: Record<string, any> = {}
  const lines = content.split('\n')
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('#')) continue // 跳过空行和注释
    
    const colonIndex = trimmedLine.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = trimmedLine.substring(0, colonIndex).trim()
    const valueStr = trimmedLine.substring(colonIndex + 1).trim()
    
    // 解析值类型
    let value: any
    if (valueStr === 'true') {
      value = true
    } else if (valueStr === 'false') {
      value = false
    } else if (/^-?\d+$/.test(valueStr)) {
      value = parseInt(valueStr, 10)
    } else if (/^-?\d+\.\d+$/.test(valueStr)) {
      value = parseFloat(valueStr)
    } else if ((valueStr.startsWith('"') && valueStr.endsWith('"')) || 
               (valueStr.startsWith("'") && valueStr.endsWith("'"))) {
      // 去除引号
      value = valueStr.slice(1, -1)
    } else {
      value = valueStr
    }
    
    result[key] = value
  }
  
  return result
}

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
        // 解析 YAML 内容
        const attrs = parseSimpleYAML(content)
        
        // 构建 Vue 组件标签
        const attrString = Object.entries(attrs)
          .map(([key, value]) => {
            // 根据值类型决定是否需要引号
            if (typeof value === 'boolean' || typeof value === 'number') {
              return `:${key}="${value}"`
            } else if (typeof value === 'string') {
              // 检查是否是 JSON 对象或数组字符串
              try {
                JSON.parse(value)
                return `:${key}="${value}"`
              } catch {
                return `${key}="${value}"`
              }
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