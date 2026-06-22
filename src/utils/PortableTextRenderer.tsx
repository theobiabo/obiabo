//@ts-nocheck
import React from "react";
import { PortableText } from "@portabletext/react";
import styles from "../style/portable-text.module.css";

const PortableTextRenderer: React.FC<{ value: any }> = ({ value }) => {
  if (!value) return null;

  const components = {
    /* =====================
     * CUSTOM BLOCK TYPES
     * ===================== */
    types: {
      image: ({ value }) => {
        const url = value?.asset?.url;
        if (!url) return null;

        return (
          <figure className="portable-image">
            <img src={url} alt={value.alt || ""} loading="lazy" />
            {value.caption && <figcaption>{value.caption}</figcaption>}
          </figure>
        );
      },

      code: ({ value }) => (
        <div className="code-block">
          {value.language && (
            <div className="language-badge">{value.language}</div>
          )}
          {value.highlightedHtml ? (
            <div
              className="shiki-code"
              dangerouslySetInnerHTML={{ __html: value.highlightedHtml }}
            />
          ) : (
            <pre>
              <code className={`language-${value.language || "javascript"}`}>
                {value.code}
              </code>
            </pre>
          )}
          <style>{`
            .code-block {
              margin: 1.5rem 0;
              overflow: hidden;
              border-radius: 0.75rem;
              background: #0d1117;
            }

            .language-badge {
              padding: 0.6rem 1rem 0;
              color: #8b949e;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
              font-size: 0.75rem;
              text-transform: uppercase;
              letter-spacing: 0.08em;
            }

            .shiki-code .shiki,
            .code-block > pre {
              margin: 0;
              padding: 1rem;
              overflow-x: auto;
              background: #0d1117 !important;
              font-size: 0.9rem;
              line-height: 1.7;
            }

            .shiki-code code,
            .code-block code {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            }

            .shiki-code code {
              display: block;
              background: transparent !important;
              padding: 0 !important;
              color: inherit;
            }

            .shiki-code .line {
              min-height: 1.7em;
            }
          `}</style>
        </div>
      ),

      callout: ({ value }) => (
        <div className={`callout callout-${value.type || "info"}`}>
          {value.title && (
            <strong className="callout-title">{value.title}</strong>
          )}
          {value.message && <p className="callout-message">{value.message}</p>}
        </div>
      ),

      divider: () => <hr className="portable-divider" />,

      videoEmbed: ({ value }) => {
        const embedUrl = convertToEmbedUrl(value?.url);
        if (!embedUrl) return null;

        return (
          <figure className="portable-video">
            <iframe
              src={embedUrl}
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
              title={value.caption || "Embedded video"}
            />
            {value.caption && <figcaption>{value.caption}</figcaption>}
          </figure>
        );
      },

      quoteBlock: ({ value }) => (
        <blockquote className="portable-quote">
          <p className="quote-text">{value.text}</p>
          {value.author && (
            <footer className="quote-author">— {value.author}</footer>
          )}
        </blockquote>
      ),

      highlight: ({ value }) => (
        <mark className={`highlight highlight-${value.color || "yellow"}`}>
          {value.text}
        </mark>
      ),

      previewBlock: ({ value }) => (
        <div className={`preview-block preview-${value.bgType || "light"}`}>
          {value.title && <h4 className="preview-title">{value.title}</h4>}
          {value.description && (
            <p className="preview-description">{value.description}</p>
          )}
          {value.previewContent && (
            <div className="preview-content">{value.previewContent}</div>
          )}
        </div>
      ),
    },

    /* =====================
     * BLOCK STYLES
     * ===================== */
    block: {
      h1: ({ children }) => <h1 className="portable-h1">{children}</h1>,
      h2: ({ children }) => <h2 className="portable-h2">{children}</h2>,
      h3: ({ children }) => <h3 className="portable-h3">{children}</h3>,
      h4: ({ children }) => <h4 className="portable-h4">{children}</h4>,
      blockquote: ({ children }) => (
        <blockquote className="portable-blockquote">{children}</blockquote>
      ),
      normal: ({ children }) => <p className="portable-p">{children}</p>,
    },

    /* =====================
     * LISTS
     * ===================== */
    list: {
      bullet: ({ children }) => <ul className="portable-ul">{children}</ul>,
      number: ({ children }) => <ol className="portable-ol">{children}</ol>,
    },

    listItem: {
      bullet: ({ children }) => (
        <li className="portable-li-bullet">{children}</li>
      ),
      number: ({ children }) => (
        <li className="portable-li-number">{children}</li>
      ),
    },

    /* =====================
     * INLINE MARKS
     * ===================== */
    marks: {
      strong: ({ children }) => (
        <strong className="portable-strong">{children}</strong>
      ),
      em: ({ children }) => <em className="portable-em">{children}</em>,
      code: ({ children }) => <code className="portable-code">{children}</code>,
      underline: ({ children }) => (
        <u className="portable-underline">{children}</u>
      ),
      "strike-through": ({ children }) => (
        <s className="portable-strikethrough">{children}</s>
      ),

      link: ({ value, children }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="portable-link"
        >
          {children}
        </a>
      ),

      internalLink: ({ value, children }) => {
        const slug = value?.reference?.slug?.current;
        if (!slug) return children;

        return (
          <a href={`/notes/${slug}`} className="portable-internal-link">
            {children}
          </a>
        );
      },
    },
  };

  return (
    <>
      <div className={styles.portableText}>
        <PortableText value={value} components={components} />
      </div>
    </>
  );
};

function convertToEmbedUrl(url?: string) {
  if (!url) return null;

  if (url.includes("youtu")) {
    const id =
      url.match(/v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (url.includes("vimeo")) {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return url;
}

export default PortableTextRenderer;
