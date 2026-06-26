import { org } from '@noahclark/schema'

// Org ids are namespaced (org-*) so they never collide with role/project ids of the
// same slug (e.g. the Questor role vs the Questor org). Ids must be globally unique.
export const orgs = [
  org({ id: 'org-usaf', name: 'United States Air Force', sector: 'defense' }),
  org({ id: 'org-questor', name: 'Questor Federal', sector: 'gov' }),
  org({ id: 'org-thermopylae', name: 'Thermopylae Sciences & Technology', sector: 'defense' }),
  org({ id: 'org-cmu', name: 'Carnegie Mellon University', sector: 'academia' }),
  org({ id: 'org-ga', name: 'General Assembly', sector: 'edtech' }),
  org({ id: 'org-nderf', name: 'Near Death Experience Research Foundation', sector: 'research' }),
  org({ id: 'org-sei', name: 'Strategic Education Inc.', sector: 'edtech', url: 'https://workforceedge.com' }),
  org({ id: 'org-iam', name: 'iAm', sector: 'own', url: 'https://iamexplor.ing' }),
  org({ id: 'org-quatt', name: 'Quatt', sector: 'iot', url: 'https://quatt.io' }),
  org({ id: 'org-open', name: 'OPEN Foundation', sector: 'research' }),
]
