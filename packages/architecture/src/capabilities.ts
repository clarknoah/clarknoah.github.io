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
      'Designing typed graph data models (Neo4j) that stay queryable and coherent as they grow.',
    threads: ['graph'],
    evidence: ['dia-asset-mgmt', 'cmu-psych-platform', 'iam', 'atlas'],
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
      'Telemetry pipelines for fleets of distributed devices: ingestion, processing, and live control.',
    threads: ['scale'],
    evidence: ['quatt'],
  }),
  capability({
    id: 'scaling-saas',
    name: 'Scaling SaaS platforms',
    blurb: 'Taking products from a handful of users to millions across many enterprise partners.',
    threads: ['scale'],
    evidence: ['sei', 'workforceedge'],
  }),
  capability({
    id: 'platform-architecture',
    name: 'Platform & systems architecture',
    blurb:
      'Architecting systems across hardware, software, and data boundaries. 18 years, up to $1.1B-scale infrastructure strategy.',
    threads: ['intelligence', 'scale'],
    evidence: ['dia-architect', 'quatt', 'sei'],
  }),
  capability({
    id: 'research-platforms',
    name: 'Research data platforms',
    blurb:
      'Building first-person and scientific measurement platforms: structured capture, real-time reporting, analysis.',
    threads: ['consciousness', 'graph'],
    evidence: ['cmu-psych-platform', 'nderf-platform', 'iam'],
  }),
]
