import {useCallback, useEffect, useMemo, useRef, type TextareaHTMLAttributes} from 'react'
import {set, unset, type TextInputProps} from 'sanity'
import EasyMDE from 'easymde'
import 'easymde/dist/easymde.min.css'

type MarkdownEditorInputProps = TextInputProps & {
  schemaType: TextInputProps['schemaType'] & {
    rows?: number
  }
}

export function MarkdownEditorInput(props: MarkdownEditorInputProps) {
  const {elementProps, onChange, value, schemaType} = props
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const editorRef = useRef<EasyMDE | null>(null)
  const onChangeRef = useRef(onChange)
  const {value: _value, onChange: _onChange, style: _style, ...textareaProps} =
    elementProps as TextareaHTMLAttributes<HTMLTextAreaElement>

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const minHeight = useMemo(() => {
    const rows = schemaType.rows ?? 10
    return `${Math.max(rows * 24, 180)}px`
  }, [schemaType.rows])

  const handleEditorChange = useCallback(() => {
    const nextValue = editorRef.current?.value() ?? ''
    onChangeRef.current(nextValue ? set(nextValue) : unset())
  }, [])

  useEffect(() => {
    if (!textareaRef.current) return

    const editor = new EasyMDE({
      element: textareaRef.current,
      autofocus: false,
      spellChecker: false,
      status: false,
      minHeight,
      renderingConfig: {
        codeSyntaxHighlighting: true,
      },
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide',
      ],
      initialValue: value ?? '',
    })

    editor.codemirror.on('change', handleEditorChange)
    editorRef.current = editor

    return () => {
      editor.codemirror.off('change', handleEditorChange)
      editor.toTextArea()
      editorRef.current = null
    }
  }, [handleEditorChange, minHeight])

  useEffect(() => {
    editorRef.current?.codemirror.setOption('readOnly', elementProps.readOnly ? 'nocursor' : false)
  }, [elementProps.readOnly])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor || editor.value() === (value ?? '')) return

    editor.value(value ?? '')
  }, [value])

  return (
    <div className="markdown-editor-input">
      <textarea {...textareaProps} ref={textareaRef} defaultValue={value ?? ''} />
      <div className="markdown-editor-input__caption">Markdown editor</div>
      <style>{`
        .markdown-editor-input {
          border: 1px solid var(--card-border-color);
          border-radius: 3px;
          overflow: hidden;
        }

        .markdown-editor-input .EasyMDEContainer .CodeMirror {
          border-left: 0;
          border-right: 0;
          border-radius: 0;
        }

        .markdown-editor-input .editor-toolbar {
          border-left: 0;
          border-right: 0;
          border-top: 0;
          border-radius: 0;
        }

        .markdown-editor-input__caption {
          color: var(--card-muted-fg-color);
          font-size: 12px;
          padding: 8px 12px;
        }
      `}</style>
    </div>
  )
}
