import { org } from '@noahclark/schema'

export const orgs = [
  org({ id: 'usaf', name: 'United States Air Force', sector: 'defense' }),
  org({ id: 'questor', name: 'Questor Federal', sector: 'gov' }),
  org({ id: 'thermopylae', name: 'Thermopylae Sciences & Technology', sector: 'defense' }),
  org({ id: 'cmu', name: 'Carnegie Mellon University', sector: 'academia' }),
  org({ id: 'ga', name: 'General Assembly', sector: 'edtech' }),
  org({ id: 'nderf', name: 'Near Death Experience Research Foundation', sector: 'research' }),
  org({ id: 'sei', name: 'Strategic Education Inc.', sector: 'edtech', url: 'https://workforceedge.com' }),
  org({ id: 'iam', name: 'iAm', sector: 'own', url: 'https://iamexplor.ing' }),
  org({ id: 'quatt', name: 'Quatt', sector: 'iot', url: 'https://quatt.io' }),
]
