import { useEffect, useState } from 'react'

// Content area height (11" - 2" margins)
const CONTENT_AREA_HEIGHT = 1056 - (96 * 2) 

export function usePageBreaks(editor: any) {
  const [breaks, setBreaks] = useState<number[]>([])

  useEffect(() => {
    if (!editor) return

    const calculate = () => {
      const height = editor.view.dom.scrollHeight
      const result: number[] = []
      
      let current = CONTENT_AREA_HEIGHT
      while (current < height) {
        result.push(current)
        current += CONTENT_AREA_HEIGHT
      }
      setBreaks(result)
    }

    calculate()
    editor.on('transaction', calculate)
    return () => { editor.off('transaction', calculate) }
  }, [editor])

  return breaks
}