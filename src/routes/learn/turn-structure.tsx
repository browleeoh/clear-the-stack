import { createFileRoute, Link } from '@tanstack/react-router'
import { DetailAccordion } from '@/components/ui/accordion'
import { SourceList } from '@/components/source-list'

export const Route = createFileRoute('/learn/turn-structure')({
  head: () => ({
    meta: [
      { title: 'Turn structure — MTG Helper' },
      {
        name: 'description',
        content: 'A beginner-friendly reference for the phases of a Magic turn.',
      },
    ],
  }),
  component: TurnStructure,
})

export const turnStructurePhases = [
  {
    title: '1. Beginning phase',
    body: 'Untap your permanents, handle upkeep abilities, then draw a card. Players usually act during upkeep or after the draw.',
  },
  {
    title: '2. First main phase',
    body: 'Play a land if you have not played one this turn. Cast creatures, artifacts, enchantments, sorceries, and other spells when the stack is empty.',
  },
  {
    title: '3. Combat phase',
    body: 'Begin combat, choose attackers, let the defending player choose blockers, assign damage, then finish combat.',
  },
  {
    title: '4. Second main phase',
    body: 'You have another chance to play a land or cast main-phase spells. Anything used during combat may change your choices here.',
  },
  {
    title: '5. Ending phase',
    body: 'Resolve end-step abilities. During cleanup, discard down to your maximum hand size and remove marked damage from creatures.',
  },
]

export const turnStructureSourceIds = ['cr-rule-500-1', 'cr-rule-501-1', 'cr-rule-505-6', 'cr-rule-506-1', 'cr-rule-512-1']

export function TurnStructure() {
  return (
    <main className="shell page">
      <div className="breadcrumbs">
        <Link to="/">Look Up</Link>
        <span aria-hidden="true">/</span>
        <span>Learn</span>
      </div>
      <p className="eyebrow">Beginner reference · Verified · Reviewed August 23, 2026</p>
      <h1 className="page-title display-font">Take a turn</h1>
      <p className="lede">
        Every turn follows the same five phases. Most decisions happen during
        the main and combat phases.
      </p>

      <div className="content-stack">
        <section className="content-card content-card--memory" aria-labelledby="turn-summary">
          <h2 id="turn-summary">One-screen summary</h2>
          <p><strong>Beginning → Main → Combat → Main → Ending</strong></p>
          <p>Untap, handle upkeep, draw, make your first main-phase choices, attack and block, make your second main-phase choices, then finish the turn.</p>
        </section>
        {turnStructurePhases.map((phase) => (
          <section className="content-card" key={phase.title}>
            <h2>{phase.title}</h2>
            <p>{phase.body}</p>
          </section>
        ))}
        <section className="content-card">
          <h2>Example turn</h2>
          <p>You untap, resolve an upkeep trigger, and draw. In your first main phase you play a land and cast a creature. You attack with a different creature, then use your second main phase to cast a sorcery. At the end step, an “at the beginning of your end step” ability triggers; cleanup follows.</p>
        </section>
        <section className="content-card content-card--warning">
          <h2>Common mistake</h2>
          <p>Playing a land or casting a sorcery during combat. Normally, those actions wait for one of your main phases while the stack is empty. Instants and many activated abilities can be used in more phases when you have priority.</p>
        </section>
        <section className="content-card">
          <h2>Related concepts</h2>
          <ul>
            <li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'priority' }}>Priority and responding</Link></li>
            <li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'stack' }}>The stack</Link></li>
            <li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'triggered-ability' }}>Triggered abilities</Link></li>
            <li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'zones' }}>Zones</Link></li>
          </ul>
        </section>
        <section className="content-card">
          <h2>Remember this</h2>
          <p>
            Beginning → Main → Combat → Main → Ending. If you are unsure whether
            you can act, ask which phase or step the game is currently in.
          </p>
        </section>
        <section className="content-card">
          <DetailAccordion title="Technical detail and official sources">
            <p>The beginning phase contains untap, upkeep, and draw. Combat contains beginning of combat, declare attackers, declare blockers, combat damage, and end of combat. The ending phase contains the end step and cleanup; players normally do not receive priority during untap or cleanup.</p>
            <SourceList sourceIds={turnStructureSourceIds} />
          </DetailAccordion>
        </section>
      </div>
    </main>
  )
}
