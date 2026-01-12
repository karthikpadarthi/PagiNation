import { useEffect, useState, useCallback } from 'react'
import { Editor } from '@tiptap/react'

const PAGE_HEIGHT = 1056  // 11 inches
const PAGE_PADDING = 96   // 1 inch top/bottom padding
const GAP_HEIGHT = 96     // 1 inch gap between pages
const CONTENT_PER_PAGE = PAGE_HEIGHT - (PAGE_PADDING * 2) // 864px usable

export function usePagination(editor: Editor | null) {
  const [totalPages, setTotalPages] = useState(1)

  const injectPageBreaks = useCallback(() => {
    if (!editor) return

    const proseMirror = editor.view.dom as HTMLElement
    
    // Remove existing spacers
    proseMirror.querySelectorAll('.page-spacer').forEach(el => el.remove())

    // Get all block-level children
    const children = Array.from(proseMirror.children) as HTMLElement[]
    
    let accumulatedHeight = 0
    let currentPage = 1

    children.forEach((child) => {
      if (child.classList.contains('page-spacer')) return
      
      const childHeight = child.offsetHeight
      const childTop = accumulatedHeight
      const childBottom = childTop + childHeight
      
      const currentPageEnd = (currentPage * CONTENT_PER_PAGE)

      // If this element crosses a page boundary
      if (childBottom > currentPageEnd && childTop < currentPageEnd) {
        // Calculate how much space is left on current page
        const spaceLeft = currentPageEnd - childTop
        
        // Add a spacer to push content to next page
        const spacer = document.createElement('div')
        spacer.className = 'page-spacer'
        spacer.style.height = `${spaceLeft + GAP_HEIGHT + PAGE_PADDING * 2}px`
        spacer.style.pointerEvents = 'none'
        spacer.style.userSelect = 'none'
        
        child.parentNode?.insertBefore(spacer, child)
        
        currentPage++
        accumulatedHeight = (currentPage - 1) * CONTENT_PER_PAGE
      }
      
      accumulatedHeight += childHeight
    })

    // Calculate total pages
    const totalHeight = proseMirror.scrollHeight
    const pages = Math.ceil(totalHeight / (CONTENT_PER_PAGE + GAP_HEIGHT + PAGE_PADDING * 2)) || 1
    setTotalPages(Math.max(1, pages))
  }, [editor])

  useEffect(() => {
    if (!editor) return

    // Run on every update
    const handleUpdate = () => {
      requestAnimationFrame(injectPageBreaks)
    }

    editor.on('update', handleUpdate)
    editor.on('create', handleUpdate)
    
    // Initial run
    setTimeout(handleUpdate, 100)

    return () => {
      editor.off('update', handleUpdate)
      editor.off('create', handleUpdate)
    }
  }, [editor, injectPageBreaks])

  return totalPages
}