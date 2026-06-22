import type { CareerIndex } from '@noahclark/graph-engine'

export type View = 'portfolio' | 'repo' | 'story'
export type Lens = 'timeline' | 'capabilities' | 'graph' | 'projects'

/** Side-effects a command asks the UI to perform. The console never touches the DOM. */
export type Intent =
  | { type: 'setView'; view: View }
  | { type: 'setLens'; lens: Lens }
  | { type: 'highlightSkill'; id: string }
  | { type: 'highlightThread'; id: string }
  | { type: 'openEntity'; id: string }
  | { type: 'downloadResume' }
  | { type: 'clear' }

export type Tone = 'normal' | 'muted' | 'accent' | 'error'
export interface Line {
  text: string
  tone?: Tone
}

export interface CommandContext {
  index: CareerIndex
  profile: { name: string; title: string; email: string; location: string; links: readonly { label: string; href: string }[] }
}

export interface CommandResult {
  output: Line[]
  intents: Intent[]
}

export interface Command {
  name: string
  usage: string
  describe: string
  run: (args: string[], ctx: CommandContext) => CommandResult
}
