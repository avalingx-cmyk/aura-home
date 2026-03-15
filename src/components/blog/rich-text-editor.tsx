'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Write something...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-forest-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-forest max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  // Update editor content when prop changes (for editing existing posts)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-sage-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-sage-50 border-b border-sage-200 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bold') ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium italic transition-colors ${
            editor.isActive('italic') ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('strike') ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Strikethrough"
        >
          S
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Heading 3"
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bulletList') ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('orderedList') ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Numbered List"
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('blockquote') ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Quote"
        >
          " Quote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded text-sm font-medium font-mono transition-colors ${
            editor.isActive('codeBlock') ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Code Block"
        >
          {'</>'}
        </button>
        <button
          onClick={() => {
            const url = prompt('Enter image URL:')
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
          className="px-3 py-1 rounded text-sm font-medium hover:bg-sage-200 transition-colors"
          title="Add Image"
        >
          🖼️ Image
        </button>
        <button
          onClick={() => {
            const url = prompt('Enter link URL:')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('link') ? 'bg-forest-100 text-forest-700' : 'hover:bg-sage-200'
          }`}
          title="Add Link"
        >
          🔗 Link
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="px-3 py-1 rounded text-sm font-medium hover:bg-sage-200 transition-colors"
          title="Undo"
        >
          ↶ Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="px-3 py-1 rounded text-sm font-medium hover:bg-sage-200 transition-colors"
          title="Redo"
        >
          ↷ Redo
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}
