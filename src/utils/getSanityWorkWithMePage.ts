import {sanity} from './sanityClient'

export type SanityWorkWithMePage = {
  _id: string
  heading: string
  seoDescription: string
  intro: string
  topicsHeading: string
  topics: string[]
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
    contactPrompt,
    contactLinkLabel,
    contactPath
  }`

  return await sanity.withConfig({useCdn: false}).fetch<SanityWorkWithMePage | null>(query)
}
