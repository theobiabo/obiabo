import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'galleryItem',
  title: 'Gallery item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for visitors using a screen reader.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'note',
      media: 'image',
    },
  },
})
