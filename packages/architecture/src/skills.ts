import { skill, type SkillCategory } from '@noahclark/schema'

// [id, display name, category] — kept compact; skill() validates each.
const defs: Array<[string, string, SkillCategory]> = [
  // languages
  ['typescript', 'TypeScript', 'lang'],
  ['javascript', 'JavaScript', 'lang'],
  ['python', 'Python', 'lang'],
  ['php', 'PHP', 'lang'],
  ['matlab', 'MATLAB', 'lang'],
  // databases
  ['neo4j', 'Neo4j', 'db'],
  ['postgresql', 'PostgreSQL', 'db'],
  ['mysql', 'MySQL', 'db'],
  ['mongodb', 'MongoDB', 'db'],
  ['clickhouse', 'ClickHouse', 'db'],
  ['redis', 'Redis', 'db'],
  ['sqlite', 'SQLite', 'db'],
  // infrastructure
  ['aws', 'AWS', 'infra'],
  ['gcp', 'Google Cloud', 'infra'],
  ['kubernetes', 'Kubernetes (GKE)', 'infra'],
  ['docker', 'Docker', 'infra'],
  ['heroku', 'Heroku', 'infra'],
  ['openstack', 'OpenStack', 'infra'],
  ['mqtt', 'MQTT / AWS IoT Core', 'infra'],
  ['kafka', 'Kafka', 'infra'],
  ['nx', 'Nx', 'infra'],
  ['github-actions', 'GitHub Actions', 'infra'],
  // frontend
  ['react', 'React', 'frontend'],
  ['angular', 'Angular', 'frontend'],
  ['tailwind', 'Tailwind CSS', 'frontend'],
  ['capacitor', 'Capacitor', 'frontend'],
  ['d3', 'D3.js', 'frontend'],
  ['cytoscape', 'Cytoscape.js', 'frontend'],
  // data / API
  ['graphql', 'GraphQL', 'data'],
  ['apollo', 'Apollo Server', 'data'],
  ['prisma', 'Prisma', 'data'],
  ['openapi', 'OpenAPI', 'data'],
  ['asyncapi', 'AsyncAPI', 'data'],
  // ai-native
  ['claude-code', 'Claude Code', 'ai'],
  ['mcp', 'MCP Protocol', 'ai'],
  // practice
  ['scrum', 'Scrum / Agile', 'practice'],
  ['tdd', 'TDD', 'practice'],
  ['ci-cd', 'CI/CD', 'practice'],
  ['e2e-testing', 'E2E Testing', 'practice'],
]

export const skills = defs.map(([id, name, category]) => skill({ id, name, category }))
