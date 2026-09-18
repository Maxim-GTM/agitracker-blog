export interface Author {
  name: string;
  role: string;
  bio: string;
  /** Use 'Organization' for a shared byline such as an editorial team. */
  kind?: 'Person' | 'Organization';
  /** Profiles that prove who this person is: used for schema.org `sameAs`. */
  links?: { label: string; url: string }[];
}

/** Reference an author from a post with `author: <key>`. */
export const AUTHORS = {
  team: {
    name: 'The agitracker.io team',
    role: 'Editorial',
    kind: 'Organization',
    bio: 'We read the papers, run the numbers and write down what actually changed on the road to general-purpose AI.',
    links: [],
  },
} satisfies Record<string, Author>;

export type AuthorId = keyof typeof AUTHORS;

export function getAuthor(id: string): Author {
  return (AUTHORS as Record<string, Author>)[id] ?? AUTHORS.team;
}
