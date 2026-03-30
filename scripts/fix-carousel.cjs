const fs = require('fs')
const path = require('path')

const docsDir = path.join(__dirname, '..', 'docs')

/**
 * 修复 carousel 组件的引号问题
 * 将 :img="[{name:'test',dir:'privacy'}]" 转换为 :img='[{name:"test",dir:"privacy"}]'
 */
function fixCarousel(content) {
  return content.replace(/:img="(\[.*?\])"/g, (match, jsonStr) => {
    // 将内部的单引号改为双引号
    const fixed = jsonStr.replace(/'/g, '"')
    return `:img='${fixed}'`
  })
}

/**
 * 主函数
 */
function main() {
  console.log('🔧 Fixing carousel components...\n')
  
  const files = fs.readdirSync(docsDir)
  let count = 0
  
  files.forEach(file => {
    if (!file.endsWith('.md')) return
    
    const filePath = path.join(docsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const fixed = fixCarousel(content)
    
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf-8')
      console.log(`✓ ${file}`)
      count++
    }
  })
  
  console.log(`\n✅ Fixed ${count} file(s)!`)
}

main()
