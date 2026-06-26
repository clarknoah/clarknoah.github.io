import { thread } from '@noahclark/schema'

/**
 * Threads: curatorial. Each is an interpretation of how the career coheres, backed by
 * the roles/projects in `evidence`. Colours live in @noahclark/theme, keyed by id.
 */
export const threads = [
  thread({
    id: 'graph',
    label: 'Knowledge Graphs',
    blurb:
      'Building typed graph data models since 2013. The same conviction runs from the DIA asset graph to Atlas.',
    evidence: ['dia-architect', 'dia-asset-mgmt', 'ga-learning-platform', 'iam', 'atlas'],
  }),
  thread({
    id: 'consciousness',
    label: 'Consciousness & Neurophenomenology',
    blurb:
      'A decade spent where software meets first-person experience, from fMRI pipelines to iAm.',
    evidence: ['cmu', 'fmri-pipeline', 'nderf', 'nderf-platform', 'iam-founder', 'iam'],
  }),
  thread({
    id: 'intelligence',
    label: 'Intelligence & Security',
    blurb:
      'Started in cyber intelligence and physical penetration testing; architected systems for the US Intelligence Community.',
    evidence: ['usaf-analyst', 'questor', 'dia-architect', 'dia-asset-mgmt'],
  }),
  thread({
    id: 'scale',
    label: 'Scale & Engineering Leadership',
    blurb:
      'Scaling products and leading teams, from a SaaS platform at 1.2M users to a 20,000-device IoT fleet.',
    evidence: ['sei', 'workforceedge', 'quatt'],
  }),
  thread({
    id: 'ai-native',
    label: 'AI-Native Engineering',
    blurb:
      'AI-assisted tooling in the build loop, and architecture modelled as data agents can operate on. Most recent: Quatt and iAm.',
    evidence: ['iam-founder', 'iam', 'quatt', 'atlas'],
  }),
]
