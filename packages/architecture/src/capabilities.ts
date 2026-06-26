import { capability } from '@noahclark/schema'

/**
 * Capabilities: curatorial, consulting-facing. Each is a present-tense competency with
 * `evidence` pointing at the roles/projects that justify it (claims with receipts).
 */
export const capabilities = [
  capability({
    id: 'knowledge-graph-systems',
    name: 'Knowledge-graph systems',
    blurb:
      'Designing typed graph data models in Neo4j that stay queryable and coherent as the data piles up.',
    threads: ['graph'],
    evidence: ['dia-asset-mgmt', 'ga-learning-platform', 'iam', 'atlas'],
  }),
  capability({
    id: 'ai-native-tooling',
    name: 'AI-native development tooling',
    blurb:
      'AI-assisted code review and debugging in the dev loop, plus architecture modelled as data an agent can query and act on.',
    threads: ['ai-native', 'graph'],
    evidence: ['quatt', 'atlas', 'iam-founder'],
  }),
  capability({
    id: 'realtime-telemetry',
    name: 'Real-time telemetry at scale',
    blurb:
      'Telemetry pipelines for fleets of distributed devices: pulling the signals in and processing them, then pushing control back out while the hardware runs.',
    threads: ['scale'],
    evidence: ['quatt'],
  }),
  capability({
    id: 'scaling-saas',
    name: 'Scaling SaaS platforms',
    blurb: 'Taking products from a handful of users to over a million across many enterprise partners.',
    threads: ['scale'],
    evidence: ['sei', 'workforceedge'],
  }),
  capability({
    id: 'platform-architecture',
    name: 'Platform & systems architecture',
    blurb:
      'Architecting systems that reach from the physical hardware up through the software and data. Since 2013, up to $1.1B-scale infrastructure strategy.',
    threads: ['intelligence', 'scale'],
    evidence: ['dia-architect', 'quatt', 'sei'],
  }),
  capability({
    id: 'research-platforms',
    name: 'Research data platforms',
    blurb:
      'Building measurement platforms for first-person and scientific data: structured capture and real-time reporting at one end, the analysis at the other.',
    threads: ['consciousness', 'graph'],
    evidence: ['cmu', 'nderf-platform', 'iam'],
  }),
]
