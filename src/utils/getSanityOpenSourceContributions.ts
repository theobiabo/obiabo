import { sanity } from './sanityClient';

export type SanityContributionItem = {
  title: string;
  url: string;
  description: string;
};

export type SanityContributionGroup = {
  projectName: string;
  description?: string;
  order?: number;
  items?: SanityContributionItem[];
};

export type SanityOpenSourceContributionsPage = {
  title?: string;
  overviewTitle?: string;
  overviewText?: string;
  contributionsTitle?: string;
  groups?: SanityContributionGroup[];
};

export async function getSanityOpenSourceContributions(): Promise<SanityOpenSourceContributionsPage | null> {
  const query = `*[_type == "openSourceContributionsPage"][0]{
    title,
    overviewTitle,
    overviewText,
    contributionsTitle,
    "groups": groups[]|order(coalesce(order, 0) asc, projectName asc){
      projectName,
      description,
      order,
      items[]{
        title,
        url,
        description
      }
    }
  }`;

  return await sanity.fetch(query);
}
