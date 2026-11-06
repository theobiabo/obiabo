import {sanity} from './sanityClient'

export type SanityWorkWithMePage = {
  _id: string
  heading: string
  seoDescription: string
  intro: string
  topicsHeading: string
  topics: string[]
  selectedWorkHeading?: string
  selectedWork?: {
    organization: string
    slug?: {current: string}
    summary: string
    role?: string
    heroImage?: {alt?: string; asset?: {url?: string}}
    sections?: {heading: string; body: string}[]
  }[]
  contactPrompt: string
  contactLinkLabel: string
  contactPath: string
}

export async function getSanityWorkWithMePage(): Promise<SanityWorkWithMePage | null> {
  const query = `*[_type == "workWithMePage" && _id == "workWithMePage"][0]{
    _id,
    heading,
    seoDescription,
    intro,
    topicsHeading,
    topics,
    selectedWorkHeading,
    selectedWork[]{organization, slug, summary, role, heroImage{alt, asset->{url}}, sections[]{heading, body}},
    contactPrompt,
    contactLinkLabel,
    contactPath
  }`

  return await sanity.withConfig({useCdn: false}).fetch<SanityWorkWithMePage | null>(query)
}
