const fs = require('fs')
const path = require('path')

const docsDir = path.join(__dirname, '..', 'docs')

// 解析代码块中的组件属性 - 增强版本
function parseComponentAttrs(code, componentName) {
  const attrs = {}
  
  // 简单键值对匹配（值不包含空格）
  const simpleAttrRegex = /(\w+):([^\s,\n]+)/g
  let match
  
  while ((match = simpleAttrRegex.exec(code)) !== null) {
    const key = match[1]
    const value = match[2]
    if (!attrs[key]) {
      attrs[key] = value
    }
  }
  
  // 特殊处理可能包含逗号的长属性
  const longAttrs = ['points', 'flights', 'theme']
  longAttrs.forEach(attr => {
    const regex = new RegExp(`${attr}:(.+?)(?=\\n\\w+:|$)`, 's')
    const attrMatch = code.match(regex)
    if (attrMatch) {
      attrs[attr] = attrMatch[1].trim()
    }
  })
  
  return attrs
}

// 构建组件标签
function buildComponentTag(componentName, attrs) {
  const componentMap = {
    img: 'AImg',
    map: 'AMap',
    flight: 'AFlight'
  }
  
  const component = componentMap[componentName] || componentName
  const attrParts = []
  
  Object.entries(attrs).forEach(([key, value]) => {
    // 移除可能的末尾标点
    const cleanValue = value.replace(/[,\n\r]+$/, '')
    attrParts.push(`${key}="${cleanValue}"`)
  })
  
  const attrString = attrParts.join(' ')
  return `<${component} ${attrString} />`
}

// 转换单个文件
function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let changed = false
  
  // 转换 ```<a-component> 代码块
  const oldContent = content
  content = content.replace(/```<a-(\w+)>([\s\S]*?)```/g, (match, componentName, code) => {
    const attrs = parseComponentAttrs(code.trim(), componentName)
    return buildComponentTag(componentName, attrs)
  })
  
  // 转换 <a-secret autoload>
  content = content.replace(/<a-secret\s+name="([^"]+)"\s+autoload\s*><\/a-secret>/g, 
    '<!-- Secret content: $1 -->')
  
  if (content !== oldContent) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✓ ${path.relative(docsDir, filePath)}`)
  }
}

// 处理所有 markdown 文件
function processAllFiles() {
  console.log('Converting markdown files...\n')
  
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
  
  console.log('\n✓ Conversion completed!')
}

processAllFiles()
