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

  /**
   * Get the scoped CSS hash from existing outline elements
   */
  const getScopedHash = (): string | null => {
    // Find any existing outline link element
    const existingLink = document.querySelector('.outline-link')
    if (existingLink) {
      // Extract hash from attribute name
      const attrs = existingLink.attributes
      for (let i = 0; i < attrs.length; i++) {
        if (attrs[i].name.startsWith('data-v-')) {
          return attrs[i].name
        }
      }
    }
    return null
  }

  /**
   * Add heading link to a specific container
   */
  const addHeadingToContainer = (outlineList: HTMLElement, heading: Heading) => {
    // Check if already added to THIS specific container (not just registered)
    const existingLink = outlineList.querySelector(`a.outline-link[href="#${heading.id}"][data-vp-outline="true"]`)
    if (existingLink) return
    
    const scopedHash = getScopedHash()
    
    const li = document.createElement('li')
    if (scopedHash) {
      li.setAttribute(scopedHash, '')
    }
    
    const link = document.createElement('a')
    if (scopedHash) {
      link.setAttribute(scopedHash, '')
    }
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
  }

  /**
   * Register headings to both desktop and mobile outlines
   */
  const registerHeadings = (headings: Heading[]) => {
    // 1. Desktop outline: VPDocAsideOutline
    const desktopOutlineList = document.querySelector('.VPDocAsideOutline .VPDocOutlineItem.root') as HTMLElement
    if (desktopOutlineList) {
      headings.forEach((heading) => {
        addHeadingToContainer(desktopOutlineList, heading)
      })
    }

    // 2. Mobile outline: VPLocalNavOutlineDropdown
    // The mobile outline is inside a dropdown that only renders when opened
    // We need to observe the dropdown and add headings when it opens
    const setupMobileObserver = () => {
      const mobileDropdown = document.querySelector('.VPLocalNavOutlineDropdown')
      if (!mobileDropdown) return

      // Function to sync headings to mobile outline
      const syncToMobile = () => {
        const itemsContainer = mobileDropdown.querySelector('.items')
        if (!itemsContainer) return
        
        const mobileOutlineList = itemsContainer.querySelector('.outline .VPDocOutlineItem.nested') as HTMLElement
        if (mobileOutlineList) {
          headings.forEach((heading) => {
            addHeadingToContainer(mobileOutlineList, heading)
          })
        }
      }

      // Check if items are already rendered (dropdown was opened before)
      syncToMobile()

      // Observe for when the dropdown opens/closes (items element appears/disappears)
      const observer = new MutationObserver(() => {
        // When DOM changes, try to sync again
        syncToMobile()
      })

      observer.observe(mobileDropdown, { childList: true, subtree: true })
      
      // Store observer reference for cleanup
      ;(mobileDropdown as any).__outlineObserver = observer
    }

    setupMobileObserver()
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

    // Clean up observers
    document.querySelectorAll('.VPLocalNavOutlineDropdown').forEach(dropdown => {
      const observer = (dropdown as any).__outlineObserver
      if (observer) {
        observer.disconnect()
        delete (dropdown as any).__outlineObserver
      }
    })
  }

  return {
    registerHeadings,
    unregister,
  }
}
