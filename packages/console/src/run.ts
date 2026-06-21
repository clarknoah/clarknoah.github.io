import { commands } from './commands'
import type { CommandContext, CommandResult } from './types'

const registry = new Map(commands.map((c) => [c.name, c]))

/** Command names, for autocomplete. */
export const commandNames = commands.map((c) => c.name)

/** Parse + dispatch a single line. Pure: returns output + intents, performs nothing. */
export function run(input: string, ctx: CommandContext): CommandResult {
  const tokens = input.trim().split(/\s+/).filter(Boolean)
  const name = tokens[0]
  if (!name) return { output: [], intents: [] }
  const cmd = registry.get(name)
  if (!cmd) {
    return { output: [{ text: `command not found: ${name} — try "help"`, tone: 'error' }], intents: [] }
  }
  return cmd.run(tokens.slice(1), ctx)
}
