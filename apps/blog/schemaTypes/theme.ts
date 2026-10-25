import {defineField, defineType} from 'sanity'
import {ColorPickerInput} from '../components/ColorPickerInput'

const colorField = (name: string, title: string, initialValue: string) =>
  defineField({
    name,
    title,
    type: 'string',
    components: {
      input: ColorPickerInput,
    },
    initialValue,
    validation: (rule) =>
      rule.required().regex(/^#[0-9a-f]{6}$/i, {
        name: 'hex color',
        invert: false,
      }),
  })

export default defineType({
  name: 'theme',
  title: 'Theme',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Site theme',
      validation: (rule) => rule.required(),
    }),
    colorField('primaryBackgroundColor', 'Primary background color', '#141414'),
    colorField('secondaryBackgroundColor', 'Secondary background color', '#1a1a1a'),
    colorField('primaryTextColor', 'Primary text color', '#c8ccda'),
    colorField('mutedTextColor', 'Muted text color', '#999999'),
    colorField('borderColor', 'Border color', '#333333'),
    colorField('accentColor', 'Accent color', '#f94e19'),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'primaryBackgroundColor',
    },
  },
})
