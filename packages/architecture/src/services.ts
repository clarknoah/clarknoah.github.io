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
    id: 'data-modelling',
    name: 'Data modelling & standardisation',
    blurb:
      'Turn inconsistent, messy data into a validated, queryable model with referential integrity.',
    proof: 'iam',
    proofLabel: 'iAm, a research platform I built and still run',
  },
  {
    id: 'data-visualisation',
    name: 'Data visualisation',
    blurb: 'Make complex, multidimensional data legible.',
    proof: 'dia-asset-mgmt',
    proofLabel: 'DIA asset-management system, visualised as a graph with d3.js and cytoscape.js',
  },
  {
    id: 'data-pipelines',
    name: 'Data pipelines & real-time platforms',
    blurb: 'Move data from wherever it lives into something you can use, in batch or in real time.',
    proof: 'quatt-cloud',
    proofLabel: 'Real-time telemetry for 20,000+ connected devices at Quatt',
  },
  {
    id: 'agentic-automation',
    name: 'Agentic automation',
    blurb:
      'Agent-assisted tooling for multi-step engineering work in the development loop, like code review and debugging.',
    proofLabel: 'Built AI-assisted code-review and debugging tooling at Quatt',
  },
]

export type ServiceId = (typeof services)[number]['id']
