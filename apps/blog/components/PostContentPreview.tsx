import {PortableText} from '@portabletext/react'
import type {ReactNode} from 'react'
import {useFormValue, type StringInputProps} from 'sanity'

type PortableTextBlock = {
  _key?: string
  _type: string
  [key: string]: unknown
}

type PostImage = {
  alt?: string
  caption?: string
}

function getYouTubeOrVimeoEmbedUrl(url?: string) {
  if (!url) return null

  if (url.includes('youtu')) {
    const id = url.match(/v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?]+)/)?.[1]
    return id ? `https://www.youtube.com/embed/${id}` : null
  }

  if (url.includes('vimeo')) {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1]
    return id ? `https://player.vimeo.com/video/${id}` : null
  }

  return url
}

export function PostContentPreview(_props: StringInputProps) {
  const title = useFormValue(['title']) as string | undefined
  const description = useFormValue(['description']) as string | undefined
  const body = useFormValue(['body']) as PortableTextBlock[] | undefined

  const hasBody = Array.isArray(body) && body.length > 0

  return (
    <div className="post-content-preview">
      <div className="post-content-preview__header">
        <p className="post-content-preview__eyebrow">Live preview</p>
        <p className="post-content-preview__hint">Updates from the draft fields above.</p>
      </div>

      <article className="post-content-preview__article">
        {title && <h1>{title}</h1>}
        {description && <p className="post-content-preview__description">{description}</p>}

        {hasBody ? (
          <PortableText
            value={body}
            components={{
              types: {
                image: ({value}: {value: PostImage}) => (
                  <figure className="post-content-preview__image">
                    <div className="post-content-preview__image-placeholder">Image preview</div>
                    {value?.caption && <figcaption>{value.caption}</figcaption>}
                  </figure>
                ),
                code: ({value}: {value?: {language?: string; code?: string}}) => (
                  <div className="post-content-preview__code-block">
                    {value?.language && (
                      <div className="post-content-preview__language">{value.language}</div>
                    )}
                    <pre>
                      <code>{value?.code}</code>
                    </pre>
                  </div>
                ),
                callout: ({value}: {value?: {type?: string; title?: string; message?: string}}) => (
                  <aside
                    className={`post-content-preview__callout post-content-preview__callout--${value?.type || 'info'}`}
                  >
                    {value?.title && <strong>{value.title}</strong>}
                    {value?.message && <p>{value.message}</p>}
                  </aside>
                ),
                divider: () => <hr />,
                videoEmbed: ({value}: {value?: {url?: string; caption?: string}}) => {
                  const embedUrl = getYouTubeOrVimeoEmbedUrl(value?.url)

                  if (!embedUrl) return null

                  return (
                    <figure className="post-content-preview__video">
                      <iframe src={embedUrl} title={value?.caption || 'Embedded video preview'} />
                      {value?.caption && <figcaption>{value.caption}</figcaption>}
                    </figure>
                  )
                },
                quoteBlock: ({value}: {value?: {text?: string; author?: string}}) => (
                  <blockquote>
                    {value?.text && <p>{value.text}</p>}
                    {value?.author && <footer>— {value.author}</footer>}
                  </blockquote>
                ),
                highlight: ({value}: {value?: {text?: string}}) => <mark>{value?.text}</mark>,
                previewBlock: ({
                  value,
                }: {
                  value?: {title?: string; description?: string; previewContent?: string}
                }) => (
                  <div className="post-content-preview__preview-block">
                    {value?.title && <h4>{value.title}</h4>}
                    {value?.description && <p>{value.description}</p>}
                    {value?.previewContent && <div>{value.previewContent}</div>}
                  </div>
                ),
              },
              block: {
                h1: ({children}) => <h1>{children}</h1>,
                h2: ({children}) => <h2>{children}</h2>,
                h3: ({children}) => <h3>{children}</h3>,
                h4: ({children}) => <h4>{children}</h4>,
                blockquote: ({children}) => <blockquote>{children}</blockquote>,
                normal: ({children}) => <p>{children}</p>,
              },
              marks: {
                link: ({value, children}: {value?: {href?: string}; children: ReactNode}) => (
                  <a href={value?.href} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                ),
                internalLink: ({children}: {children: ReactNode}) => <>{children}</>,
              },
            }}
          />
        ) : (
          <p className="post-content-preview__empty">
            Start writing in the Body field to preview the post here.
          </p>
        )}
      </article>

      <style>{`
        .post-content-preview {
          background: var(--card-bg-color);
          border-radius: 6px;
          overflow: hidden;
        }

        .post-content-preview__header {
          align-items: baseline;
          border-bottom: 1px solid var(--card-border-color);
          display: flex;
          flex-wrap: wrap;
          gap: 8px 12px;
          padding: 12px 16px;
        }

        .post-content-preview__eyebrow,
        .post-content-preview__hint {
          margin: 0;
        }

        .post-content-preview__eyebrow {
          color: var(--card-fg-color);
          font-size: 13px;
          font-weight: 600;
        }

        .post-content-preview__hint {
          color: var(--card-muted-fg-color);
          font-size: 12px;
        }

        .post-content-preview__article {
          color: var(--card-fg-color);
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          line-height: 1.8;
          margin: 0 auto;
          max-height: 620px;
          max-width: 760px;
          overflow: auto;
          padding: 24px 18px 32px;
        }

        .post-content-preview__article h1,
        .post-content-preview__article h2,
        .post-content-preview__article h3,
        .post-content-preview__article h4 {
          font-family: inherit;
          line-height: 1.25;
          margin: 1.5em 0 0.6em;
        }

        .post-content-preview__article h1:first-child {
          margin-top: 0;
        }

        .post-content-preview__article p,
        .post-content-preview__article ul,
        .post-content-preview__article ol,
        .post-content-preview__article blockquote,
        .post-content-preview__article pre {
          margin: 0 0 1rem;
        }

        .post-content-preview__description,
        .post-content-preview__empty {
          color: var(--card-muted-fg-color);
        }

        .post-content-preview__article a {
          color: #60a5fa;
        }

        .post-content-preview__code-block {
          background: rgba(127, 127, 127, 0.12);
          border-radius: 6px;
          margin: 1rem 0;
          overflow: hidden;
        }

        .post-content-preview__language {
          color: var(--card-muted-fg-color);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          padding: 8px 12px 0;
        }

        .post-content-preview__code-block pre {
          overflow: auto;
          padding: 12px;
        }

        .post-content-preview__image-placeholder,
        .post-content-preview__preview-block,
        .post-content-preview__callout {
          background: rgba(127, 127, 127, 0.12);
          border-radius: 6px;
          padding: 16px;
        }

        .post-content-preview__image-placeholder {
          align-items: center;
          color: var(--card-muted-fg-color);
          display: flex;
          min-height: 180px;
          justify-content: center;
        }

        .post-content-preview__video iframe {
          aspect-ratio: 16 / 9;
          border: 0;
          border-radius: 6px;
          width: 100%;
        }

        .post-content-preview__article figcaption {
          color: var(--card-muted-fg-color);
          font-size: 13px;
          margin-top: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
