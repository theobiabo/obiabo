import { sanity } from './sanityClient';

export type SanityProject = {
  _id: string;
  name: string;
  description: string;
  details?: string;
  url: string;
  order?: number;
};

type ProjectQueryOptions = {
  featuredOnly?: boolean;
  limit?: number;
};

export async function getSanityProjects({ featuredOnly = false, limit }: ProjectQueryOptions = {}): Promise<SanityProject[]> {
  const query = `*[_type == "project"${featuredOnly ? ' && featured == true' : ''}]|order(coalesce(order, 0) asc, name asc){
    _id,
    name,
    description,
    details,
    url,
    order
  }`;

  const projects = await sanity.fetch<SanityProject[]>(query);
  return limit === undefined ? projects : projects.slice(0, limit);
}
