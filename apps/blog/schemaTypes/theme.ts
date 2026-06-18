import {defineField, defineType} from 'sanity'
import {ColorPickerInput} from '../components/ColorPickerInput'

const fontStylesheetUrl =
  'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Geist+Mono:wght@100..900&family=IBM+Plex+Mono:ital,wght@0,100..700;1,100..700&family=Instrument+Serif:ital@0;1&family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400..700&family=Merriweather:wght@300;400;700;900&family=Newsreader:opsz,wght@6..72,200..800&family=Source+Code+Pro:wght@200..900&family=Space+Mono:wght@400;700&display=swap'

const primaryFontOptions = [
  {title: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace'},
  {title: 'Geist Mono', value: '"Geist Mono", monospace'},
  {title: 'JetBrains Mono', value: '"JetBrains Mono", monospace'},
  {title: 'Fira Code', value: '"Fira Code", monospace'},
  {title: 'Space Mono', value: '"Space Mono", monospace'},
  {title: 'Source Code Pro', value: '"Source Code Pro", monospace'},
  {title: 'Inter', value: '"Inter", sans-serif'},
]

const serifFontOptions = [
  {title: 'Instrument Serif', value: '"Instrument Serif", serif'},
  {title: 'Newsreader', value: '"Newsreader", serif'},
  {title: 'Lora', value: '"Lora", serif'},
  {title: 'Merriweather', value: '"Merriweather", serif'},
  {title: 'Libre Baskerville', value: '"Libre Baskerville", serif'},
]

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
    defineField({
      name: 'fontStylesheetUrl',
      title: 'Font stylesheet URL',
      type: 'url',
      initialValue: fontStylesheetUrl,
      description: 'CDN stylesheet containing the selectable font ranges below.',
      validation: (rule) => rule.required().uri({scheme: ['https']}),
    }),
    defineField({
      name: 'monoFontFamily',
      title: 'Primary font family',
      type: 'string',
      initialValue: '"IBM Plex Mono", monospace',
      options: {
        list: primaryFontOptions,
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'serifFontFamily',
      title: 'Serif font family',
      type: 'string',
      initialValue: '"Instrument Serif", serif',
      options: {
        list: serifFontOptions,
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    colorField('primaryBackgroundColor', 'Primary background color', '#141414'),
    colorField('secondaryBackgroundColor', 'Secondary background color', '#1a1a1a'),
    colorField('primaryTextColor', 'Primary text color', '#c8ccda'),
    colorField('mutedTextColor', 'Muted text color', '#999999'),
    colorField('borderColor', 'Border color', '#333333'),
    colorField('accentColor', 'Accent color', '#e53636'),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'monoFontFamily',
    },
  },
})
