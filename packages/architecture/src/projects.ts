import { project } from '@noahclark/schema'

export const projects = [
  project({
    id: 'dia-asset-mgmt',
    name: 'Book of Apps',
    kind: 'system',
    role: 'dia-architect',
    summary:
      'Architected and led the build of the DIA’s IT asset management system, modelling assets as a graph.',
    threads: ['intelligence', 'graph'],
    skills: ['openstack', 'angular', 'php', 'neo4j', 'd3', 'cytoscape'],
    capabilities: ['knowledge-graph-systems', 'platform-architecture'],
  }),
  project({
    id: 'fmri-pipeline',
    name: 'fMRI Normalisation Pipeline',
    kind: 'pipeline',
    role: 'cmu',
    summary:
      'Automated MATLAB pipeline to sanitise, normalise, and analyse fMRI data for a neuroscience research lab.',
    threads: ['consciousness'],
    skills: ['matlab'],
  }),
  project({
    id: 'imagery-pipeline',
    name: 'Imagery Collection Pipeline',
    kind: 'pipeline',
    role: 'thermopylae-geo',
    summary:
      'Node.js automation for compressing and decompressing commercial imagery assets, removing ~400 hours of manual work.',
    skills: ['javascript'],
  }),
  project({
    id: 'ga-grading-app',
    name: 'Automated Grading App',
    kind: 'tool',
    role: 'ga-instructor',
    summary: 'Node.js application that automated grading for the General Assembly DC campus.',
    skills: ['javascript'],
  }),
  project({
    id: 'ga-learning-platform',
    name: 'Spaced-Repetition Learning Platform',
    kind: 'platform',
    role: 'ga-instructor',
    summary:
      'Learning platform using spaced repetition over a hierarchical knowledge-graph data structure to improve student outcomes.',
    threads: ['graph'],
    skills: ['neo4j', 'javascript', 'react'],
    capabilities: ['knowledge-graph-systems'],
  }),
  project({
    id: 'nderf-platform',
    name: 'NDERF Data Platform',
    kind: 'prototype',
    role: 'nderf',
    summary:
      'Prototype system architecture and API platform for the Near Death Experience Research Foundation’s data and collection workflow.',
    threads: ['consciousness'],
    skills: ['javascript', 'postgresql', 'heroku'],
    capabilities: ['research-platforms'],
  }),
  project({
    id: 'workforceedge',
    name: 'WorkforceEdge',
    kind: 'platform',
    role: 'sei',
    summary:
      'EdTech SaaS platform scaled from a few hundred users to 1.2M+ across 59 corporate partners.',
    url: 'https://workforceedge.com',
    image: '/work/workforceedge.webp',
    threads: ['scale'],
    skills: ['typescript', 'apollo', 'graphql', 'postgresql', 'redis', 'react', 'aws'],
    capabilities: ['scaling-saas', 'platform-architecture'],
  }),
  project({
    id: 'iam',
    name: 'iAm',
    kind: 'platform',
    role: 'iam-founder',
    summary:
      'Graph-native SaaS platform for measuring and analysing subjective experience in real time. Unifies surveys and real-time reporting into one graph; cross-platform on web, iOS, and Android.',
    url: 'https://iamexplor.ing',
    image: '/work/iam.webp',
    threads: ['consciousness', 'graph', 'ai-native'],
    skills: ['neo4j', 'typescript', 'apollo', 'graphql', 'react', 'capacitor', 'gcp', 'kubernetes'],
    capabilities: ['research-platforms', 'knowledge-graph-systems'],
  }),
  project({
    id: 'atlas',
    name: 'Atlas',
    kind: 'platform',
    role: 'quatt',
    summary:
      'A typed knowledge graph modelling an engineering organisation (670 entities, 41 repos, 600+ device fields) with cross-language type generation, queryable by both engineers and AI agents.',
    threads: ['graph', 'ai-native', 'scale'],
    skills: ['typescript', 'nx', 'neo4j', 'claude-code', 'mcp', 'openapi'],
    capabilities: ['knowledge-graph-systems', 'ai-native-tooling'],
  }),
  project({
    id: 'quatt-cloud',
    name: 'Quatt Cloud',
    kind: 'platform',
    role: 'quatt',
    summary:
      'The cloud platform behind a fleet of 20,000+ IoT-connected heat pumps: telemetry ingestion, real-time processing, APIs, dashboards, and analytics.',
    threads: ['scale', 'ai-native'],
    skills: ['typescript', 'mqtt', 'aws', 'clickhouse', 'mysql', 'redis', 'kafka'],
    capabilities: ['realtime-telemetry', 'platform-architecture'],
  }),
  project({
    id: 'icpr-conference',
    name: 'ICPR Conference Website',
    kind: 'website',
    role: 'open-volunteer',
    year: '2024',
    summary:
      'Built the Interdisciplinary Conference on Psychedelic Research conference website (2024 edition) for the OPEN Foundation.',
    url: 'https://icpr-conference.com',
    image: '/work/icpr-conference.webp',
    skills: ['nextjs', 'react', 'typescript'],
  }),
  project({
    id: 'myguidedgrowth',
    name: 'Guided Growth',
    kind: 'website',
    summary: 'Simple static website for a therapy practice.',
    url: 'https://myguidedgrowth.com',
    image: '/work/myguidedgrowth.webp',
    skills: ['react', 'vite'],
  }),
  project({
    id: 'active-inference',
    name: 'Active Inference Players Map',
    kind: 'tool',
    summary:
      'A small interactive map of people and groups working in active inference and the free-energy principle.',
    url: '/active-inference',
    threads: ['consciousness'],
    skills: ['javascript'],
  }),
]
