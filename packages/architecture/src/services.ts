/**
 * Engagement types: what someone can hire Noah to do. The consulting-page counterpart
 * to the (chronological) career data. Each entry states what the buyer gets in one plain
 * sentence, and points at a real project as evidence. No claim here is unbacked: `proof`
 * references a project id in projects.ts, `proofLabel` summarises the verifiable fact.
 */
export interface Service {
  id: string
  /** What to call the engagement. */
  name: string
  /** One plain sentence: what the buyer gets. No hype, no metrics that are not real. */
  blurb: string
  /** Project id (see projects.ts) to surface as evidence, if there is one. */
  proof?: string
  /** Short, verifiable proof line. */
  proofLabel: string
}

export const services: Service[] = [
  {
    id: 'agent-ready-architecture',
    name: 'Agent-ready architecture',
    blurb:
      'Model your domain as a typed graph that engineers and AI agents can both query, instead of tables you join by hand.',
    proof: 'atlas',
    proofLabel: 'Atlas: 670 entities, 41 repos, queryable by engineers and agents',
  },
  {
    id: 'agentic-automation',
    name: 'Agentic automation',
    blurb:
      'Agent systems that carry multi-step work end to end: research, annotation, transformation, and reporting.',
    proof: 'atlas',
    proofLabel: 'Built AI-assisted code-review and debugging tooling at Quatt',
  },
  {
    id: 'research-data-standardisation',
    name: 'Research-data standardisation',
    blurb:
      'Turn inconsistent study data into a validated, queryable model with referential integrity that holds up to analysis.',
    proof: 'iam',
    proofLabel: 'iAm: a graph-native research platform I founded and run',
  },
  {
    id: 'multimodal-pipelines',
    name: 'Multimodal pipelines',
    blurb:
      'Align first-person reports with physiological signals, audio, and video into one dataset you can actually analyse.',
    proof: 'fmri-pipeline',
    proofLabel: 'fMRI normalisation pipeline for a neuroscience lab at Carnegie Mellon',
  },
  {
    id: 'data-visualisation',
    name: 'Data visualisation',
    blurb: 'Make complex, multidimensional data legible, without the dashboard clichés.',
    proof: 'dia-asset-mgmt',
    proofLabel: 'Every figure on this site is generated from validated data',
  },
]

export type ServiceId = (typeof services)[number]['id']
