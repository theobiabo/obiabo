import {sanity} from './sanityClient'

export type SanityTheme = {
  _id: string
  title?: string
  primaryBackgroundColor?: string
  secondaryBackgroundColor?: string
  primaryTextColor?: string
  mutedTextColor?: string
  borderColor?: string
  accentColor?: string
}

export const defaultTheme: Omit<SanityTheme, '_id' | 'title'> = {
  primaryBackgroundColor: '#141414',
  secondaryBackgroundColor: '#1a1a1a',
  primaryTextColor: '#c8ccda',
  mutedTextColor: '#999999',
  borderColor: '#333333',
  accentColor: '#f94e19',
}

export async function getSanityTheme(): Promise<SanityTheme | null> {
  const query = `*[_type == "theme"][0]{
    _id,
    title,
    primaryBackgroundColor,
    secondaryBackgroundColor,
    primaryTextColor,
    mutedTextColor,
    borderColor,
    accentColor
  }`

  return await sanity.fetch(query)
}
