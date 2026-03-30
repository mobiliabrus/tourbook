const fs = require('fs')
const path = require('path')

const docsDir = path.join(__dirname, '..', 'docs')

/**
 * 提取完整的 JSON 对象
 */
function extractJSON(str) {
  let braceCount = 0
  let bracketCount = 0
  let inString = false
  let escapeNext = false
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    
    if (escapeNext) {
      escapeNext = false
      continue
    }
    
    if (char === '\\' && inString) {
      escapeNext = true
      continue
    }
    
    if (char === '"' && !escapeNext) {
      inString = !inString
    }
    
    if (!inString) {
      if (char === '{') braceCount++
      if (char === '}') braceCount--
      if (char === '[') bracketCount++
      if (char === ']') bracketCount--
    }
    
    if (braceCount === 0 && bracketCount === 0 && (char === '}' || char === ']')) {
      return str.substring(0, i + 1)
    }
  }
  
  return str
}

/**
 * 解析代码块属性
 */
function parseComponentAttrs(code, componentName) {
  const attrs = {}
  const longAttrs = ['points', 'flights', 'theme', 'route', 'img']
  const lines = code.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    const attrMatch = trimmed.match(/^(\w+):\s*(.*)$/)
    if (!attrMatch) continue
    
    const [, key, valueStart] = attrMatch
    const keyLower = key.toLowerCase()
    
    if (longAttrs.includes(keyLower) && (valueStart.startsWith('{') || valueStart.startsWith('['))) {
      attrs[keyLower] = extractJSON(valueStart)
    } else if (longAttrs.includes(keyLower)) {
      attrs[keyLower] = valueStart.trim().replace(/['"]/g, '')
    } else {
      attrs[keyLower] = valueStart.trim().replace(/['"]/g, '')
    }
  }
  
  return attrs
}

/**
 * 构建组件标签 - 对于 JSON 值使用动态绑定
 */
function buildComponentTag(componentName, attrs) {
  const componentMap = { img: 'AImg', map: 'AMap', flight: 'AFlight' }
  const component = componentMap[componentName] || componentName
  const attrParts = []
  
  Object.entries(attrs).forEach(([key, value]) => {
    const cleanValue = value.replace(/[,\n\r\s]+$/, '').trim()
    
    // 对于 JSON 值，使用 :attr='...' 语法（单引号包裹）
    if (cleanValue.startsWith('{') || cleanValue.startsWith('[')) {
      attrParts.push(`:${key}='${cleanValue}'`)
    } else {
      attrParts.push(`${key}="${cleanValue}"`)
    }
  })
  
  return `<${component} ${attrParts.join(' ')} />`
}

/**
 * 修复现有的 <a-map> 组件的 route 属性
 */
function fixAMapRoute(content) {
  const lines = content.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.includes('<a-map') && line.includes('route=')) {
      // 查找 route=" 或 route='
      const routeMatch = line.match(/route=(['"])(\{.*?\})\1/)
      
      if (routeMatch) {
        const quote = routeMatch[1]
        const jsonStr = routeMatch[2]
        
        // 验证是否是完整的 JSON
        if (extractJSON(jsonStr) === jsonStr) {
          // 转换为动态绑定语法
          const oldAttr = `route=${quote}${jsonStr}${quote}`
          const newAttr = `:route='${jsonStr}'`
          lines[i] = line.replace(oldAttr, newAttr)
        }
      }
    }
  }
  
  return lines.join('\n')
}

/**
 * 处理文件内容
 */
function processContent(content) {
  // 1. 转换代码块组件
  content = content.replace(/```<a-(\w+)>([\s\S]*?)```/g, (match, comp, code) => {
    const attrs = parseComponentAttrs(code.trim(), comp)
    return buildComponentTag(comp, attrs)
  })
  
  // 2. 转换 a-secret autoload
  content = content.replace(/<a-secret\s+name="([^"]+)"\s+autoload\s*><\/a-secret>/g, '<!-- Secret: $1 -->')
  
  // 3. 修复 a-hotel 的 points 属性
  content = content.replace(/<a-hotel([^>]*)>/g, (m, attrs) => {
    return `<a-hotel${attrs.replace(/\s+points="[^"]*"/g, '')}>`
  })
  
  // 4. 修复 a-map 的 route 属性（包括单引号和双引号）
  content = fixAMapRoute(content)
  
  // 5. 处理导航和侧边栏文件
  if (content.includes('_navbar') || content.includes('_sidebar')) {
    content = '<!-- Migrated to vitepress config -->\n'
  }
  
  return content
}

/**
 * 转换文件
 */
function convertFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const processed = processContent(content)
  
  if (processed !== content) {
    fs.writeFileSync(filePath, processed, 'utf-8')
    console.log(`✓ ${path.relative(docsDir, filePath)}`)
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🔄 Migrating from docsify to vitepress...\n')
  
  const files = fs.readdirSync(docsDir)
  files.forEach(f => f.endsWith('.md') && convertFile(path.join(docsDir, f)))
  
  const subdirs = ['assets/confidential']
  subdirs.forEach(dir => {
    const dirPath = path.join(docsDir, dir)
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach(f => {
        f.endsWith('.md') && convertFile(path.join(dirPath, f))
      })
    }
  })
  
  console.log('\n✅ Migration complete!')
}

main()
