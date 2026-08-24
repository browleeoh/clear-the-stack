import { createFileRoute, Link } from '@tanstack/react-router'
import { SourceList } from '@/components/source-list'
import { DetailAccordion } from '@/components/ui/accordion'
import { ProcessList } from '@/components/process-list'

export const combatSteps = [
  ['1. Begin combat', 'The combat phase starts with a beginning of combat step. Players can act before attackers are declared.'],
  ['2. Declare attackers', 'The active player chooses all attackers at once, checks attack requirements and restrictions, and taps each attacker unless an effect says otherwise. This declaration does not use the stack.'],
  ['3. Handle attack triggers and responses', 'Abilities that triggered from attacking go on the stack. Players may cast instants or activate legal abilities before blockers are declared.'],
  ['4. Declare blockers', 'The defending player chooses all blocks at once. Each blocker normally blocks one attacker, while several creatures may block the same attacker. This declaration does not use the stack.'],
  ['5. Handle block triggers and responses', 'Abilities that triggered from blocking go on the stack. Players may act again before combat damage.'],
  ['6. Deal combat damage', 'Attacking and blocking creatures assign combat damage, then that damage is dealt simultaneously. An unblocked attacker normally deals its damage to what it attacked.'],
  ['7. End combat', 'Players get one final chance to act in the end of combat step, then creatures stop being attacking or blocking.'],
] as const

export const combatSourceIds = ['cr-rule-506-1', 'cr-rule-507-2', 'cr-rule-508-1', 'cr-rule-508-1m', 'cr-rule-508-2', 'cr-rule-509-1', 'cr-rule-509-2', 'cr-rule-510-1', 'cr-rule-511-1', 'cr-rule-117-4']

export const Route = createFileRoute('/learn/combat')({
  head: () => ({ meta: [{ title: 'Attacking and blocking — MTG Helper' }, { name: 'description', content: 'A beginner guide to declaring attackers, blockers, responses, and combat damage.' }] }),
  component: CombatGuide,
})

export function CombatGuide() {
  return (
    <main className="shell page">
      <div className="breadcrumbs"><Link to="/">Look Up</Link><span aria-hidden="true">/</span><Link to="/learn/turn-structure">Learn</Link></div>
      <p className="eyebrow">Beginner reference · Verified · Reviewed August 23, 2026</p>
      <h1 className="page-title display-font">Attack and block</h1>
      <p className="lede">Attackers are chosen first, blockers second, and combat damage comes after both sides have chances to respond.</p>
      <div className="content-stack">
        <section className="content-card content-card--memory" aria-labelledby="combat-summary"><h2 id="combat-summary">One-screen summary</h2><p><strong>Begin → Attack → Respond → Block → Respond → Damage → End</strong></p><p>Choices are declared together. Nobody responds in the middle of declaring attackers or blockers, but players can act afterward before the next combat step.</p></section>
        <ProcessList steps={combatSteps} />
        <section className="content-card"><h2>Example</h2><p>You attack with a 3/3 and a 2/2. Your opponent blocks the 3/3 with a 2/2 and leaves the other attacker unblocked. After both players finish responding, the blocked creatures deal damage to each other and the unblocked 2/2 deals 2 damage to the defending player.</p></section>
        <section className="content-card content-card--warning"><h2>Common mistake</h2><p>Trying to add another attacker after seeing blockers. Attackers are declared together and that choice is finished before blockers are chosen. You may use spells or abilities after blockers, but they do not let you redeclare attackers unless they explicitly say so.</p></section>
        <section className="content-card"><h2>Related concepts and guides</h2><ul className="related-links"><li><Link to="/learn/turn-structure">Turn structure</Link></li><li><Link to="/learn/casting-resolution">Casting and resolving a spell</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'priority' }}>Priority and responding</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'triggered-ability' }}>Triggered abilities</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'stack' }}>The stack</Link></li></ul></section>
        <section className="content-card"><DetailAccordion title="Technical detail and official sources"><p>The combat phase has five steps. Declaring attackers and blockers are turn-based actions that do not use the stack. Triggered abilities are stacked afterward, then the active player receives priority. First strike or double strike can create a second combat damage step.</p><SourceList sourceIds={combatSourceIds} /></DetailAccordion></section>
      </div>
    </main>
  )
}
