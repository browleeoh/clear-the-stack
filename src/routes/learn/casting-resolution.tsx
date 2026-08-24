import { createFileRoute, Link } from '@tanstack/react-router'
import { SourceList } from '@/components/source-list'
import { DetailAccordion } from '@/components/ui/accordion'
import { ProcessList } from '@/components/process-list'

export const castingSteps = [
  ['1. Put the spell on the stack', 'Move the card from the zone you are casting it from to the stack and announce that you are casting it.'],
  ['2. Make its choices', 'Choose modes, announce X or optional costs, choose every required target, and divide anything the spell tells you to divide.'],
  ['3. Work out and pay the cost', 'Determine the total cost, activate mana abilities if needed, then pay every cost. A spell is not cast until this process is complete.'],
  ['4. Give players a chance to respond', 'The spell waits on the stack. Players receive priority and may add legal spells or abilities above it.'],
  ['5. Resolve the top object', 'After every player passes without adding anything, resolve only the top spell or ability by following its instructions in order.'],
  ['6. Put it in the right place', 'A resolving permanent spell enters the battlefield. A resolving instant or sorcery goes to its owner’s graveyard after its instructions finish.'],
] as const

export const castingSourceIds = ['cr-rule-601-2', 'cr-rule-405-1', 'cr-rule-405-2', 'cr-rule-117-4', 'cr-rule-608-1', 'cr-rule-608-2b', 'cr-rule-608-2c', 'cr-rule-608-2n', 'cr-rule-608-3a']

export const Route = createFileRoute('/learn/casting-resolution')({
  head: () => ({ meta: [{ title: 'Casting and resolving a spell — MTG Helper' }, { name: 'description', content: 'A beginner guide to casting a Magic spell, responses, and resolution.' }] }),
  component: CastingResolution,
})

export function CastingResolution() {
  return (
    <main className="shell page">
      <div className="breadcrumbs"><Link to="/">Look Up</Link><span aria-hidden="true">/</span><Link to="/learn/turn-structure">Learn</Link></div>
      <p className="eyebrow">Beginner reference · Verified · Reviewed August 23, 2026</p>
      <h1 className="page-title display-font">Cast and resolve a spell</h1>
      <p className="lede">Casting puts a spell on the stack. It resolves only after every player gets a chance to respond and all players pass.</p>
      <div className="content-stack">
        <section className="content-card content-card--memory" aria-labelledby="casting-summary"><h2 id="casting-summary">One-screen summary</h2><p><strong>Announce → Choose → Pay → Respond → Resolve → Move</strong></p><p>Finish casting first. Then players respond. The top object resolves first, one object at a time.</p></section>
        <ProcessList steps={castingSteps} />
        <section className="content-card"><h2>Example</h2><p>You cast a spell that says “Destroy target creature.” Put it on the stack, choose the creature, and pay the cost. Your opponent may respond with an instant. That instant goes on top and resolves first. If your target is still legal when your spell reaches the top, destroy it; then put your instant or sorcery card into its owner’s graveyard.</p></section>
        <section className="content-card content-card--warning"><h2>Common mistake</h2><p>Applying a spell’s effect as soon as its mana is paid. Paying finishes casting; it does not resolve the spell. Players still receive priority before the top object resolves.</p></section>
        <section className="content-card"><h2>Related concepts</h2><ul className="related-links"><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'stack' }}>The stack</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'priority' }}>Priority and responding</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'target' }}>Targets</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'resolution' }}>Resolution</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'zones' }}>Zones</Link></li></ul></section>
        <section className="content-card"><DetailAccordion title="Technical detail and official sources"><p>Casting follows the ordered process in rule 601.2. A player cannot pause that process to take unrelated actions. When all players pass in succession, only the top stack object resolves. Targets are checked again on resolution, and instructions are followed in order without a priority window between them.</p><SourceList sourceIds={castingSourceIds} /></DetailAccordion></section>
      </div>
    </main>
  )
}
