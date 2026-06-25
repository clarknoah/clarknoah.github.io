/** Personal facts: single source for the hero, nav, and contact sections. */
export const profile = {
  name: 'Noah Clark',
  /** Short role descriptor (nav, boot screen, meta). */
  title: 'AI & systems engineer',
  domain: 'noahclark.ing',
  url: 'https://noahclark.ing',
  /** Hero headline: the offer, addressed to a buyer. Grounded in Atlas, which is queryable
   *  by both engineers and AI agents. */
  positioning: 'I build systems that people and AI agents can both operate.',
  /** Hero subhead: what that means, and the failure mode it avoids. */
  subhead:
    'Knowledge graphs, agent pipelines, and the typed data infrastructure underneath them. Most teams point a model at data it cannot read. I model the domain first, so the agents do real work.',
  /** Short about paragraph. Every clause traces to the résumé. */
  summary:
    'I have built software since 2007, from US Air Force intelligence systems to a graph-native research platform I founded and run. I turn messy domains into typed, queryable graphs, then build the agents and pipelines on top of them.',
  availability: 'Available for independent and contract work.',
  location: 'Amsterdam, Netherlands',
  email: 'noah@intelligent-learning.tech',
  resumeUrl: '/resume.pdf',
  links: [
    { label: 'GitHub', href: 'https://github.com/clarknoah' },
    { label: 'X', href: 'https://x.com/Noah_B_Clark' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/noah-clark-46740232/' },
    { label: 'iAm', href: 'https://iamexplor.ing' },
  ],
} as const

export type Profile = typeof profile
