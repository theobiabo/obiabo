import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'workWithMePage',
  title: 'Work with me',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'topicsHeading',
      title: 'Topics heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [{type: 'string'}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'contactPrompt',
      title: 'Contact prompt',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactLinkLabel',
      title: 'Contact link label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contactPath',
      title: 'Contact page path',
      type: 'string',
      initialValue: '/reach',
      validation: (rule) => rule.required().custom((value) =>
        /^\/(?!\/)/.test(value ?? '') ? true : 'Enter a site path starting with /',
      ),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
  },
})
