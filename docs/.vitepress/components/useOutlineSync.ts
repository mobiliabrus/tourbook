import { onMounted, onUnmounted } from 'vue'

export interface Heading {
  id: string
  text: string
  level: number
}

const registeredHeadings = new Map<string, HTMLElement>()

/**
 * Register dynamic content headings to VitePress Outline
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
      link.dataset.vpOutline = 'true' // Mark as dynamically added link

      // Insert at the end of container or according to hierarchy
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
    // Clean up all headings registered by this instance when component unmounts
    const idsToRemove: string[] = []
    // Here we need a way to know which IDs were registered by current component, for simplicity we can record during register
    // But since useOutlineSync is singleton logic, we need to improve it
  })

  return {
    registerHeadings,
    unregisterHeadings,
  }
}

// Improvement: Use a simpler global management and maintain own ID list within component
export function createOutlineSyncer() {
  const myIds: string[] = []

  const registerHeadings = (headings: Heading[]) => {
    const outlineList = document.querySelector('.VPDocAsideOutline .VPDocOutlineItem.root') as HTMLElement
    if (!outlineList) return

    headings.forEach((heading) => {
      if (myIds.includes(heading.id)) return
      
      const li = document.createElement('li')
      li.setAttribute('data-v-0141d32b', '')
      
      const link = document.createElement('a')
      link.setAttribute('data-v-0141d32b', '')
      link.className = `outline-link level-${heading.level}`
      link.href = `#${heading.id}`
      link.title = heading.text
      link.textContent = heading.text
      link.setAttribute('data-vp-outline', 'true')

      li.appendChild(link)
      
      // Try to insert in order: find the first element that comes after current heading in document flow
      let inserted = false
      const targetEl = document.getElementById(heading.id)
      if (targetEl) {
        const existingItems = Array.from(outlineList.children) as HTMLElement[]
        for (const item of existingItems) {
          const existingLink = item.querySelector('a')
          if (existingLink) {
            const existingHref = existingLink.getAttribute('href')
            if (existingHref) {
              const existingId = existingHref.slice(1)
              const existingEl = document.getElementById(existingId)
              if (existingEl && targetEl.compareDocumentPosition(existingEl) & Node.DOCUMENT_POSITION_PRECEDING) {
                // If existing element is before current target element, continue loop
                continue
              } else {
                // Found the first existing element that comes after current target element, insert before it
                outlineList.insertBefore(li, item)
                inserted = true
                break
              }
            }
          }
        }
      }
      
      if (!inserted) {
        outlineList.appendChild(li)
      }
      
      myIds.push(heading.id)
    })
  }

  const unregister = () => {
    myIds.forEach((id) => {
      const link = document.querySelector(`.outline-link[href="#${id}"][data-vp-outline="true"]`)
      if (link) {
        const li = link.parentElement
        if (li) li.remove()
      }
    })
    myIds.length = 0
  }

  return {
    registerHeadings,
    unregister,
  }
}
