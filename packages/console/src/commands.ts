import type { Command, CommandResult, Line } from './types'

const ok = (output: Line[], intents: CommandResult['intents'] = []): CommandResult => ({ output, intents })
const line = (text: string, tone?: Line['tone']): Line => ({ text, tone })
const err = (text: string): CommandResult => ok([line(text, 'error')])

export const commands: Command[] = [
  {
    name: 'help',
    usage: 'help',
    describe: 'List available commands.',
    run: () =>
      ok([
        line('commands:', 'muted'),
        ...commands.map((c) => line(`  ${c.usage.padEnd(26)} ${c.describe}`)),
        line('tip: most things you can click, you can also type.', 'muted'),
      ]),
  },
  {
    name: 'view',
    usage: 'view <portfolio|story|repo>',
    describe: 'Switch the page view.',
    run: (args) => {
      const v = args[0]
      if (v !== 'portfolio' && v !== 'repo' && v !== 'story') return err('usage: view <portfolio|story|repo>')
      return ok([line(`→ ${v} view`, 'accent')], [{ type: 'setView', view: v }])
    },
  },
  {
    name: 'lens',
    usage: 'lens <timeline|capabilities|graph>',
    describe: 'Switch the portfolio lens.',
    run: (args) => {
      const l = args[0]
      if (l !== 'timeline' && l !== 'capabilities' && l !== 'graph') return err('usage: lens <timeline|capabilities|graph>')
      return ok([line(`→ ${l}`, 'accent')], [{ type: 'setView', view: 'portfolio' }, { type: 'setLens', lens: l }])
    },
  },
  {
    name: 'query',
    usage: 'query skill|thread <id>',
    describe: 'Trace a skill or thread across the career.',
    run: (args, ctx) => {
      const [sub, id] = args
      if (sub === 'skill') {
        if (!id) return err('usage: query skill <id>')
        const skill = ctx.index.skill(id)
        if (!skill) return err(`no skill "${id}". try: ls skills`)
        const { roles, projects } = ctx.index.usingSkill(id)
        return ok(
          [
            line(`${skill.name} — ${roles.length} role(s), ${projects.length} project(s)`, 'accent'),
            ...roles.map((r) => line(`  role     ${r.title}`)),
            ...projects.map((p) => line(`  project  ${p.name}`)),
          ],
          [{ type: 'setView', view: 'portfolio' }, { type: 'setLens', lens: 'graph' }, { type: 'highlightSkill', id }],
        )
      }
      if (sub === 'thread') {
        if (!id) return err('usage: query thread <id>')
        const thread = ctx.index.thread(id)
        if (!thread) return err(`no thread "${id}". try: ls threads`)
        const { roles, projects } = ctx.index.inThread(thread.id)
        return ok(
          [
            line(`${thread.label} — ${roles.length} role(s), ${projects.length} project(s)`, 'accent'),
            line(`  ${thread.blurb}`, 'muted'),
          ],
          [{ type: 'setView', view: 'portfolio' }, { type: 'setLens', lens: 'graph' }, { type: 'highlightThread', id }],
        )
      }
      return err('usage: query skill|thread <id>')
    },
  },
  {
    name: 'open',
    usage: 'open <id>',
    describe: 'Open an entity (role, project, …).',
    run: (args, ctx) => {
      const id = args[0]
      if (!id) return err('usage: open <id>')
      const e = ctx.index.entity(id)
      if (!e) return err(`no entity "${id}".`)
      return ok([line(`opening ${e.kind} ${e.label}`, 'accent')], [{ type: 'openEntity', id }])
    },
  },
  {
    name: 'ls',
    usage: 'ls <roles|projects|skills|threads|capabilities>',
    describe: 'List entities of a type.',
    run: (args, ctx) => {
      const d = ctx.index.dataset
      const map: Record<string, { id: string; label: string }[]> = {
        roles: d.roles.map((r) => ({ id: r.id, label: r.title })),
        projects: d.projects.map((p) => ({ id: p.id, label: p.name })),
        skills: d.skills.map((s) => ({ id: s.id, label: s.name })),
        threads: d.threads.map((t) => ({ id: t.id, label: t.label })),
        capabilities: d.capabilities.map((c) => ({ id: c.id, label: c.name })),
      }
      const items = map[args[0] ?? '']
      if (!items) return err('usage: ls <roles|projects|skills|threads|capabilities>')
      return ok(items.map((i) => line(`  ${i.id.padEnd(22)} ${i.label}`)))
    },
  },
  {
    name: 'whoami',
    usage: 'whoami',
    describe: 'Who is this.',
    run: (_a, ctx) =>
      ok([
        line(ctx.profile.name, 'accent'),
        line(ctx.profile.title),
        line(ctx.profile.location, 'muted'),
      ]),
  },
  {
    name: 'contact',
    usage: 'contact',
    describe: 'Email and links.',
    run: (_a, ctx) =>
      ok([
        line(ctx.profile.email, 'accent'),
        ...ctx.profile.links.map((l) => line(`  ${l.label.padEnd(10)} ${l.href}`)),
      ]),
  },
  {
    name: 'resume',
    usage: 'resume',
    describe: 'Download the résumé.',
    run: () => ok([line('downloading résumé…', 'accent')], [{ type: 'downloadResume' }]),
  },
  {
    name: 'clear',
    usage: 'clear',
    describe: 'Clear the terminal.',
    run: () => ok([], [{ type: 'clear' }]),
  },
]
