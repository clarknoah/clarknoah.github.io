/** Personal facts — single source for the hero and contact sections. */
export const profile = {
  name: 'Noah Clark',
  title: 'Agentic Systems Architect',
  domain: 'noahclark.ing',
  url: 'https://noahclark.ing',
  tagline: 'AI-native product engineering, built on knowledge graphs.',
  summary:
    'Engineer of 18 years, from US Air Force intelligence systems to a consciousness-measurement platform I founded. I turn messy domains into typed, queryable graphs, and build with AI agents wired into the real work: code review, debugging, and architecture an agent can read.',
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
