import { onMounted, onUnmounted } from 'vue'

export interface Heading {
  id: string
  text: string
  level: number
}

const registeredHeadings = new Map<string, HTMLElement>()

/**
 * 将动态内容的标题注册到 VitePress 的 Outline 中
 */
export function useOutlineSync() {
  const registerHeadings = (headings: Heading[]) => {
    const outlineContainer = document.querySelector('.VPDocAsideOutline .outline-link')?.parentElement
    if (!outlineContainer) return

    headings.forEach((heading) => {
      if (registeredHeadings.has(heading.id)) return

      const link = document.createElement('a')
      link.className = `outline-link level-${heading.level}`
      link.href = `#${heading.id}`
      link.textContent = heading.text
      link.dataset.vpOutline = 'true' // 标记为动态添加的链接

      // 插入到容器末尾或根据层级插入
      outlineContainer.appendChild(link)
      registeredHeadings.set(heading.id, link)
    })
  }

  const unregisterHeadings = (ids: string[]) => {
    ids.forEach((id) => {
      const el = registeredHeadings.get(id)
      if (el) {
        el.remove()
        registeredHeadings.delete(id)
      }
    })
  }

  onUnmounted(() => {
    // 组件卸载时清理所有由该实例注册的标题
    const idsToRemove: string[] = []
    // 这里需要一种方式知道哪些 ID 是当前组件注册的，简化起见，我们可以在 register 时记录
    // 但由于 useOutlineSync 是单例逻辑，我们需要改进一下
  })

  return {
    registerHeadings,
    unregisterHeadings,
  }
}

// 改进：使用一个更简单的全局管理，并在组件内部维护自己的 ID 列表
export function createOutlineSyncer() {
  const myIds: string[] = []

  const registerHeadings = (headings: Heading[]) => {
    const outlineContainer = document.querySelector('.VPDocAsideOutline .content') || 
                             document.querySelector('.VPDocAsideOutline .outline-link')?.parentElement
    if (!outlineContainer) return

    headings.forEach((heading) => {
      if (myIds.includes(heading.id)) return
      
      const link = document.createElement('a')
      link.className = `outline-link level-${heading.level}`
      link.href = `#${heading.id}`
      link.textContent = heading.text
      link.setAttribute('data-vp-outline', 'true')

      outlineContainer.appendChild(link)
      myIds.push(heading.id)
    })
  }

  const unregister = () => {
    myIds.forEach((id) => {
      const link = document.querySelector(`.outline-link[href="#${id}"][data-vp-outline="true"]`)
      if (link) link.remove()
    })
    myIds.length = 0
  }

  return {
    registerHeadings,
    unregister,
  }
}
