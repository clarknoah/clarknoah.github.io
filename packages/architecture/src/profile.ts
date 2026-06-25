/** Personal facts: single source for the hero, nav, and contact sections. */
export const profile = {
  name: 'Noah Clark',
  /** Short role descriptor (nav, boot screen, meta). */
  title: 'AI & systems engineer',
  domain: 'noahclark.ing',
  url: 'https://noahclark.ing',
  /** Hero line: a plain description of the work, not a slogan. */
  positioning: 'I build data systems and the tools that run on them.',
  /** Hero subhead: what I build and who for, plainly. No swagger, no overclaimed niche. */
  subhead:
    'Knowledge graphs, data pipelines, data visualisation, and the infrastructure underneath them. Mostly for startups. Based in Amsterdam, available for independent and contract work.',
  /** Short about paragraph. Every clause traces to the résumé. */
  summary:
    'I have written software since 2007, from intelligence and geospatial systems to a research platform for measuring experience that I built and still run. I tend to start with the data model, then build the tools and agents on top of it.',
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
