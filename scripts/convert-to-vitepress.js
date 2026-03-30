const fs = require('fs')
const path = require('path')

const docsDir = path.join(__dirname, '..', 'docs')

// 解析代码块中的组件属性
function parseComponentAttrs(code, componentName) {
  const attrRegex = /(\w+):([^`\s]+)/g
  const attrs = {}
  let match
  
  while ((match = attrRegex.exec(code)) !== null) {
    attrs[match[1]] = match[2].replace(/['"]/g, '')
  }
  
  // 特殊处理 img 组件
  if (componentName === 'img') {
    return {
      name: attrs.name || '',
      dir: attrs.dir ? `"${attrs.dir}"` : undefined
    }
  }
  
  // 特殊处理 map 组件
  if (componentName === 'map') {
    return {
      points: attrs.points ? `"${attrs.points}"` : undefined,
      flights: attrs.flights ? `"${attrs.flights}"` : undefined,
      theme: attrs.theme ? `"${attrs.theme}"` : undefined
    }
  }
  
  // 特殊处理 flight 组件
  if (componentName === 'flight') {
    return {
      flight: attrs.flight ? `"${attrs.flight}"` : undefined,
      departure: attrs.departure ? `"${attrs.departure}"` : undefined,
      destination: attrs.destination ? `"${attrs.destination}"` : undefined,
      'departure-time': attrs['departure-time'] ? `"${attrs['departure-time']}"` : undefined,
      'arrive-time': attrs['arrive-time'] ? `"${attrs['arrive-time']}"` : undefined
    }
  }
  
  return attrs
}

// 构建组件标签
function buildComponentTag(componentName, attrs) {
  const attrString = Object.entries(attrs)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ')
  
  const componentMap = {
    img: 'AImg',
    map: 'AMap',
    flight: 'AFlight'
  }
  
  const component = componentMap[componentName] || componentName
  return `<${component} ${attrString} />`
}

// 转换单个文件
function convertFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  
  // 转换 ```<a-component> 代码块
  const codeBlockRegex = /```<a-(\w+)>([\s\S]*?)```/g
  content = content.replace(codeBlockRegex, (match, componentName, code) => {
    const attrs = parseComponentAttrs(code.trim(), componentName)
    return buildComponentTag(componentName, attrs)
  })
  
  // 移除 <a-secret autoload> 并替换为实际内容占位符
  content = content.replace(/<a-secret\s+name="([^"]+)"\s+autoload\s*><\/a-secret>/g, 
    '<!-- Secret content: $1 -->')
  
  // 转换其他行内组件（已经是 Vue 组件语法的保持不变）
  
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Converted: ${path.relative(docsDir, filePath)}`)
}

// 处理所有 markdown 文件
function processAllFiles() {
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
}

processAllFiles()
console.log('Conversion completed!')
