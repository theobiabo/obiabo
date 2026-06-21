import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'openSourceContributionsPage',
  title: 'Open Source Contributions Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Open Source Contributions',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overviewTitle',
      title: 'Overview Title',
      type: 'string',
      initialValue: 'Overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'overviewText',
      title: 'Overview Text',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contributionsTitle',
      title: 'Contributions Section Title',
      type: 'string',
      initialValue: 'Recent Contributions',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'groups',
      title: 'Contribution Groups',
      type: 'array',
      of: [
        defineField({
          name: 'contributionGroup',
          title: 'Contribution Group',
          type: 'object',
          fields: [
            defineField({
              name: 'projectName',
              title: 'Project Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Project Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Lower numbers appear first.',
              initialValue: 0,
            }),
            defineField({
              name: 'items',
              title: 'Contributions',
              type: 'array',
              validation: (rule) => rule.min(1),
              of: [
                defineField({
                  name: 'contributionItem',
                  title: 'Contribution',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Link Text',
                      type: 'string',
                      description: 'Example: Pull Request #698',
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'url',
                      title: 'URL',
                      type: 'url',
                      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 3,
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      subtitle: 'description',
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'projectName',
              subtitle: 'description',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'overviewTitle',
    },
  },
})
