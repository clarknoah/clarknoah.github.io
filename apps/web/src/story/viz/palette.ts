// Shared multicolour palette for the story visualizations.
export const PALETTE = [
  '#2f7dc4', // blue
  '#8157d6', // violet
  '#c95f33', // terracotta
  '#3a9663', // green
  '#e0a23b', // amber
  '#5ec8c0', // teal
  '#d2683f', // orange
]

export const at = (i: number): string => PALETTE[i % PALETTE.length] as string
