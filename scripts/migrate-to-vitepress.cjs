
<<<<<<< Local
=======
const docsDir = path.join(__dirname, '..', 'docs')

/**
 * 提取完整的 JSON 对象（处理嵌套）
 */
function extractJSON(str, startIndex) {
  let braceCount = 0
  let bracketCount = 0
  let inString = false
  let escapeNext = false
  let result = ''
  
  for (let i = startIndex; i < str.length; i++) {
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
      result += char
      continue
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
 * 解析代码块中的组件属性 - 增强版
 */
function parseComponentAttrs(code, componentName) {
  const attrs = {}
  
  // 定义长属性列表
  const longAttrs = ['points', 'flights', 'theme', 'route', 'img']
  
  // 逐行处理代码
  const lines = code.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // 检查是否是属性行
    const attrMatch = line.match(/^(\w+):\s*(.*)$/)
    if (!attrMatch) continue
    
    const [, key, valueStart] = attrMatch
    const keyLower = key.toLowerCase()
    
    // 如果是长属性且以 { 或 [ 开头，提取完整 JSON
    if (longAttrs.includes(keyLower) && (valueStart.startsWith('{') || valueStart.startsWith('['))) {
      const fullValue = extractJSON(valueStart, 0)
      attrs[keyLower] = fullValue
    } else if (longAttrs.includes(keyLower)) {
      // 简单长属性
      attrs[keyLower] = valueStart.trim().replace(/['"]/g, '')
    } else {
      // 简单属性
      attrs[keyLower] = valueStart.trim().replace(/['"]/g, '')
    }
  }
  
  return attrs
}

/**
 * 构建 Vue 组件标签
 */
function buildComponentTag(componentName, attrs) {
  const componentMap = {
    img: 'AImg',
    map: 'AMap',
    flight: 'AFlight'
  }
  
  const component = componentMap[componentName] || componentName
  const attrParts = []
  
  Object.entries(attrs).forEach(([key, value]) => {
    const cleanValue = value.replace(/[,\n\r\s]+$/, '').trim()
    attrParts.push(`${key}="${cleanValue}"`)
  })
  
  const attrString = attrParts.join(' ')
  return `<${component} ${attrString} />`
}

/**
 * 转换单个文件
 */
function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let changed = false
  const originalContent = content
  
  // 1. 转换 ```<a-component> 代码块
  content = content.replace(/```<a-(\w+)>([\s\S]*?)```/g, (match, componentName, code) => {
    const attrs = parseComponentAttrs(code.trim(), componentName)
    return buildComponentTag(componentName, attrs)
  })
  
  // 2. 转换 <a-secret autoload> 为注释占位符
  content = content.replace(/<a-secret\s+name="([^"]+)"\s+autoload\s*><\/a-secret>/g, 
    '<!-- Secret content: $1 -->')
  
  // 3. 移除 docs/_navbar.md 和 docs/_sidebar.md 的特殊内容
  if (filePath.includes('_navbar.md') || filePath.includes('_sidebar.md')) {
    content = '<!-- This file is migrated to vitepress config -->\n'
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✓ ${path.relative(docsDir, filePath)}`)
  }
}

/**
 * 处理所有 markdown 文件
 */
function processAllFiles() {
  console.log('🔄 Migrating docs from docsify to vitepress...\n')
  
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
  
  console.log('\n✅ Migration completed!')
}

processAllFiles()

>>>>>>> Remote