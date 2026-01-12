'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { usePagination } from '@/components/usePagination'

export default function Home() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <h1>USCIS Cover Letter</h1>
      <p><strong>RE: I-129 Petition for Nonimmigrant Worker</strong></p>
      <p>Dear Adjudicating Officer,</p>
      <p>Start typing your legal document here. As you fill this page, a new page with a dark gap will appear automatically.</p>
    `,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-slate focus:outline-none max-w-none',
      },
    },
  })

  const totalPages = usePagination(editor)

  return (
    <main className="min-h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="no-print sticky top-0 z-50 bg-slate-950 border-b border-slate-800 text-white p-4 flex justify-between items-center px-8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">L</div>
          <h1 className="font-bold text-lg tracking-wide">LegalBridge Editor</h1>
        </div>
        
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold shadow-md transition-all active:scale-95"
        >
          Print / Export PDF
        </button>
      </header>

      {/* Editor Workspace */}
      <div className="flex-1 overflow-y-auto py-10 flex justify-center">
        <div 
          className="document-container"
          style={{ 
            minHeight: `calc(${totalPages} * (1056px + 96px))` 
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
      
      {/* Page Counter */}
      <div className="no-print fixed bottom-4 left-4 bg-slate-800 text-slate-400 px-3 py-1 rounded text-xs uppercase tracking-widest font-semibold border border-slate-700">
        Page {totalPages} of {totalPages} | US Letter (8.5" x 11")
      </div>
    </main>
  )
}