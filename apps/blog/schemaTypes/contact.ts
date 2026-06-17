import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introMarkdown',
      title: 'Contact intro',
      type: 'text',
      rows: 5,
      description: 'Short intro shown on the contact page. Supports Markdown and inline HTML.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Social and contact links',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'contactLink',
          title: 'Contact link',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'headerTitle',
              title: 'Header title',
              type: 'string',
              description: 'Optional shorter or alternate title for the site header.',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (rule) =>
                rule.required().custom((value) => {
                  if (!value) {
                    return true
                  }

                  return /^(https?:\/\/|mailto:)/.test(value)
                    ? true
                    : 'Use a URL that starts with http://, https://, or mailto:'
                }),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'showInHeader',
              title: 'Show in header',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url',
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
