import {defineType, defineArrayMember} from 'sanity'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike', value: 'strike-through'},
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
          {
            title: 'Internal link',
            name: 'internalLink',
            type: 'object',
            fields: [
              {
                title: 'Reference',
                name: 'reference',
                type: 'reference',
                to: [{type: 'post'}],
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
    }),
    defineArrayMember({
      title: 'Code Block',
      name: 'code',
      type: 'object',
      fields: [
        {
          title: 'Language',
          name: 'language',
          type: 'string',
          options: {
            list: [
              {title: 'JavaScript', value: 'javascript'},
              {title: 'TypeScript', value: 'typescript'},
              {title: 'Rust', value: 'rust'},
              {title: 'Python', value: 'python'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
              {title: 'JSON', value: 'json'},
              {title: 'Bash', value: 'bash'},
              {title: 'SQL', value: 'sql'},
            ],
          },
        },
        {
          title: 'Code',
          name: 'code',
          type: 'text',
        },
      ],
      preview: {
        select: {
          language: 'language',
          code: 'code',
        },
        prepare({language, code}) {
          return {
            title: `Code (${language || 'plain'})`,
            subtitle: code?.substring(0, 50) || 'Empty code block',
          }
        },
      },
    }),
    defineArrayMember({
      title: 'Callout',
      name: 'callout',
      type: 'object',
      fields: [
        {
          title: 'Type',
          name: 'type',
          type: 'string',
          options: {
            list: [
              {title: 'Info', value: 'info'},
              {title: 'Warning', value: 'warning'},
              {title: 'Success', value: 'success'},
              {title: 'Error', value: 'error'},
            ],
          },
        },
        {
          title: 'Title',
          name: 'title',
          type: 'string',
        },
        {
          title: 'Message',
          name: 'message',
          type: 'text',
          rows: 3,
        },
      ],
      preview: {
        select: {
          type: 'type',
          title: 'title',
          message: 'message',
        },
        prepare({type, title, message}) {
          return {
            title: `${type?.toUpperCase()} Callout`,
            subtitle: title || message?.substring(0, 50),
          }
        },
      },
    }),
    defineArrayMember({
      title: 'Divider',
      name: 'divider',
      type: 'object',
      fields: [
        {
          name: 'dividerType',
          title: 'Divider',
          type: 'string',
          hidden: true,
          initialValue: 'divider',
        },
      ],
      preview: {
        prepare() {
          return {
            title: '─ Divider ─',
          }
        },
      },
    }),
    defineArrayMember({
      title: 'Video Embed',
      name: 'videoEmbed',
      type: 'object',
      fields: [
        {
          title: 'URL',
          name: 'url',
          type: 'url',
          description: 'YouTube, Vimeo, or other video URL',
        },
        {
          title: 'Caption',
          name: 'caption',
          type: 'string',
        },
      ],
      preview: {
        select: {
          url: 'url',
          caption: 'caption',
        },
        prepare({url, caption}) {
          return {
            title: 'Video Embed',
            subtitle: caption || url,
          }
        },
      },
    }),
    defineArrayMember({
      title: 'Quote',
      name: 'quoteBlock',
      type: 'object',
      fields: [
        {
          title: 'Quote Text',
          name: 'text',
          type: 'text',
          rows: 4,
        },
        {
          title: 'Author',
          name: 'author',
          type: 'string',
        },
      ],
      preview: {
        select: {
          text: 'text',
          author: 'author',
        },
        prepare({text, author}) {
          return {
            title: 'Quote',
            subtitle: author ? `— ${author}` : text?.substring(0, 50),
          }
        },
      },
    }),
    defineArrayMember({
      title: 'Highlight',
      name: 'highlight',
      type: 'object',
      fields: [
        {
          title: 'Text',
          name: 'text',
          type: 'text',
          rows: 2,
        },
        {
          title: 'Color',
          name: 'color',
          type: 'string',
          options: {
            list: [
              {title: 'Yellow', value: 'yellow'},
              {title: 'Green', value: 'green'},
              {title: 'Blue', value: 'blue'},
              {title: 'Red', value: 'red'},
            ],
          },
        },
      ],
      preview: {
        select: {
          text: 'text',
          color: 'color',
        },
        prepare({text, color}) {
          return {
            title: 'Highlight',
            subtitle: `${color} - ${text?.substring(0, 40)}`,
          }
        },
      },
    }),
    defineArrayMember({
      title: 'Preview Block',
      name: 'previewBlock',
      type: 'object',
      fields: [
        {
          title: 'Title',
          name: 'title',
          type: 'string',
        },
        {
          title: 'Description',
          name: 'description',
          type: 'text',
          rows: 3,
        },
        {
          title: 'Preview Content',
          name: 'previewContent',
          type: 'text',
          rows: 8,
          description: 'HTML, code output, or rendered preview',
        },
        {
          title: 'Background Type',
          name: 'bgType',
          type: 'string',
          options: {
            list: [
              {title: 'Light', value: 'light'},
              {title: 'Dark', value: 'dark'},
              {title: 'Code', value: 'code'},
            ],
          },
          initialValue: 'light',
        },
      ],
      preview: {
        select: {
          title: 'title',
          description: 'description',
          bgType: 'bgType',
        },
        prepare({title, description, bgType}) {
          return {
            title: 'Preview Block',
            subtitle: `${bgType} - ${title || description?.substring(0, 40)}`,
          }
        },
      },
    }),
  ],
})
