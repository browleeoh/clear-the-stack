import { createFileRoute, Link } from '@tanstack/react-router'
import { SourceList } from '@/components/source-list'
import { DetailAccordion } from '@/components/ui/accordion'
import { ProcessList } from '@/components/process-list'

export const combatSteps = [
  ['1. Beginning of combat — act before attacking', 'This is the first decision window. Players may cast an instant or activate an ability that can be used now before attackers are chosen.'],
  ['2. Declare attackers — choose all at once', 'The active player chooses legal attackers at once, then taps the chosen creatures unless an effect says otherwise. This turn-based action does not use the stack, so nobody can respond halfway through it.'],
  ['3. After attackers — respond before blocks', 'Attack triggers go on the stack, then players get priority. This is the window to use a combat-ready instant or activated ability before blockers are declared.'],
  ['4. Declare blockers — choose all at once', 'The defending player chooses legal blockers at once. This turn-based action does not use the stack, so nobody can respond halfway through the blocks.'],
  ['5. After blockers — respond before damage', 'Block triggers go on the stack, then players get priority. This is the window to use an instant or activated ability before combat damage. A creature that was blocked stays blocked if its blocker later leaves combat.'],
  ['6. Combat damage — deal the assigned damage', 'Attacking and blocking creatures assign combat damage under the current rules, then deal it at the same time. If first strike or double strike creates another combat damage step, players get priority after the first one and before the regular one.'],
  ['7. End of combat — one final window', 'Players get priority in the end of combat step. Then the combat phase ends and creatures stop being attacking or blocking.'],
] as const

export const combatActionExamples = [
  'After blockers: cast an instant that gives your blocked 3/3 +2/+2 before combat damage.',
  'After attackers or blockers: activate a legal ability such as “{1}: This creature gets +1/+1 until end of turn” before combat damage.',
] as const

export const multipleBlockScenario = [
  'Your 4/4 attacker is blocked by a 2/2 and a 1/1. Multiple creatures may block that one attacker.',
  'When combat damage is assigned, you choose how to divide your attacker’s 4 damage between those two blockers: 4 and 0, 3 and 1, 2 and 2, 1 and 3, or 0 and 4 are all current-rule choices.',
  'Each blocker assigns its own damage to the attacker. If both blockers leave combat before damage, the attacker remains blocked and assigns no combat damage to the defending player.',
] as const

export const combatSourceIds = ['cr-rule-506-1', 'cr-rule-506-3', 'cr-rule-506-4', 'cr-rule-506-4b', 'cr-rule-507-2', 'cr-rule-508-1', 'cr-rule-508-1a', 'cr-rule-508-1f', 'cr-rule-508-1m', 'cr-rule-508-2', 'cr-rule-509-1', 'cr-rule-509-1a', 'cr-rule-509-1h', 'cr-rule-509-2', 'cr-rule-510-1', 'cr-rule-510-1a-e', 'cr-rule-511-1', 'cr-rule-117-4']

export const Route = createFileRoute('/learn/combat')({
  head: () => ({ meta: [{ title: 'Attacking and blocking — MTG Helper' }, { name: 'description', content: 'A beginner guide to declaring attackers, blockers, responses, and combat damage.' }] }),
  component: CombatGuide,
})

export function CombatGuide() {
  return (
    <main className="shell page">
      <div className="breadcrumbs"><Link to="/">Look Up</Link><span aria-hidden="true">/</span><Link to="/learn/turn-structure">Learn</Link></div>
      <p className="eyebrow">Beginner reference · Verified · Reviewed August 30, 2026</p>
      <h1 className="page-title display-font">Attack and block</h1>
      <p className="lede">Attackers are chosen first, blockers second, and players get clear windows to act before, between, and after those choices.</p>
      <div className="content-stack">
        <section className="content-card content-card--memory" aria-labelledby="combat-summary"><h2 id="combat-summary">One-screen summary</h2><p><strong>Before attackers → after attackers → after blockers → between damage steps when first strike applies</strong></p><p>Attackers and blockers are each declared together. Nobody responds in the middle of either declaration, but players can act in the windows that follow.</p></section>
        <ProcessList steps={combatSteps} />
        <section className="content-card"><h2>Example</h2><p>You attack with a 3/3 and a 2/2. After both players pass, your opponent declares a 2/2 blocker for the 3/3. Now both players get priority: you may cast an instant or activate an ability that can be used now before damage. Neither player can go back and add an attacker or change that block just because the other player acted.</p></section>
        <section className="content-card"><h2>What can I do in a combat window?</h2><ul><li>{combatActionExamples[0]}</li><li>{combatActionExamples[1]}</li></ul><p>These actions use the stack, so each player gets a chance to respond before one resolves.</p></section>
        <section className="content-card"><h2>One attacker, two blockers</h2><ol><li>{multipleBlockScenario[0]}</li><li>{multipleBlockScenario[1]}</li><li>{multipleBlockScenario[2]}</li></ol><p>Normally, each blocker chooses one attacker to block. The attacking creature’s controller chooses its damage split; that choice does not use damage-order terminology.</p></section>
        <section className="content-card content-card--warning"><h2>Common mistake</h2><p>Trying to respond while attackers or blockers are being declared. Each declaration is one turn-based action: wait until it finishes, then use the following priority window. Tapping or untapping a creature already in combat does not by itself remove it from combat or stop its combat damage.</p></section>
        <section className="content-card"><h2>Related concepts and guides</h2><ul className="related-links"><li><Link to="/learn/turn-structure">Turn structure</Link></li><li><Link to="/learn/casting-resolution">Casting and resolving a spell</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'priority' }}>Priority and responding</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'triggered-ability' }}>Triggered abilities</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'stack' }}>The stack</Link></li></ul></section>
        <section className="content-card"><DetailAccordion title="Technical detail and official sources"><p>The combat phase has five steps. Declaring attackers and blockers are turn-based actions that do not use the stack. Triggered abilities are stacked afterward, then the active player receives priority. First strike or double strike can create a second combat damage step. Combat damage assignments follow current rule 510.1; trample is covered separately.</p><SourceList sourceIds={combatSourceIds} /></DetailAccordion></section>
      </div>
    </main>
  )
}
