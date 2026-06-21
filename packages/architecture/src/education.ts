import { education } from '@noahclark/schema'

export const educationList = [
  education({
    id: 'trident-bs',
    institution: 'Trident University International',
    credential: 'B.S. Computer Science',
    field: 'Computer Science',
    honors: 'Cum Laude',
    start: '2009-02',
    end: '2012-12',
  }),
  education({
    id: 'ga-immersive',
    institution: 'General Assembly',
    credential: 'Software Engineering Immersive',
    field: '500-hour full-stack program',
    start: '2020-09',
    end: '2020-12',
  }),
  education({
    id: 'udemy-algos',
    institution: 'Udemy',
    credential: 'JavaScript Algorithms & Data Structures Masterclass',
    start: '2021-01',
    end: '2021-01',
  }),
]
