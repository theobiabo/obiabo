import { sanity } from './sanityClient';

export type SanityProject = {
  _id: string;
  name: string;
  description: string;
  details?: string;
  url: string;
  order?: number;
};

export async function getSanityProjects(): Promise<SanityProject[]> {
  const query = `*[_type == "project" && featured != false]|order(coalesce(order, 0) asc, name asc){
    _id,
    name,
    description,
    details,
    url,
    order
  }`;

  return await sanity.fetch(query);
}
