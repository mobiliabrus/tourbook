const fs = require('fs')
const path = require('path')

const docsDir = path.join(__dirname, '..', 'docs')

/**
 * 提取完整的 JSON 对象（从字符串中提取，处理嵌套）
 */
function extractJSON(str) {
  let braceCount = 0
  let bracketCount = 0
  let inString = false
  let escapeNext = false
  let result = ''
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    
    if (escapeNext) {
      result += char
      escapeNext = false
      continue
    }
    
    if (char === '\\' && inString) {
      result += char
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
    
    result += char
    
    if (braceCount === 0 && bracketCount === 0 && (char === '}' || char === ']')) {
      return result
    }
  }
  
  return result
}

/**
 * 修复已存在的 <a-*> 组件中的属性引号问题
 */
function fixComponentAttrs(content) {
  // 修复 <a-hotel> 组件 - 移除 points 属性
  content = content.replace(/<a-hotel([^>]*)>/g, (match, attrs) => {
    const cleaned = attrs.replace(/\s+points="[^"]*"/g, '')
    return `<a-hotel${cleaned}>`
  })
  
  // 修复 <a-map> 组件中的 route 属性
  content = content.replace(/<a-map([^>]*)>/g, (match, attrs) => {
    // 查找 route=' 开头的内容
    const routeMatch = attrs.match(/route='\{/)
    if (routeMatch) {
      // 找到 route=' 的位置
      const routeStart = attrs.indexOf("route='")
      if (routeStart !== -1) {
        // 从 {' 开始提取完整的 JSON
        const jsonStart = routeStart + 7 // "route='".length
        const remaining = attrs.substring(jsonStart)
        const jsonValue = extractJSON(remaining)
        
        if (jsonValue) {
          // 替换单引号为双引号
          const oldAttr = `route='${jsonValue}'`
          const newAttr = `route="${jsonValue}"`
          return `<a-map${attrs.replace(oldAttr, newAttr)}>`
        }
      }
    }
    return `<a-map${attrs}>`
  })
  
  return content
}

/**
 * 转换单个文件
 */
function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  const originalContent = content
  
  // 修复现有组件的属性
  content = fixComponentAttrs(content)
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✓ ${path.relative(docsDir, filePath)}`)
  }
}

/**
 * 处理所有 markdown 文件
 */
function processAllFiles() {
  console.log('🔧 Fixing component attributes...\n')
  
  // 处理根目录文件
  const files = fs.readdirSync(docsDir)
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(docsDir, file)
      convertFile(filePath)
    }
  })
  
  // 递归处理子目录
  const subdirs = ['assets/confidential']
  subdirs.forEach(subdir => {
    const subdirPath = path.join(docsDir, subdir)
    if (fs.existsSync(subdirPath)) {
      const subfiles = fs.readdirSync(subdirPath)
      subfiles.forEach(file => {
        if (file.endsWith('.md')) {
          const filePath = path.join(subdirPath, file)
          convertFile(filePath)
        }
      })
    }
  })
  
  console.log('\n✅ Fix completed!')
}

processAllFiles()
