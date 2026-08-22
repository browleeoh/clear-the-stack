import { createFileRoute, Link } from '@tanstack/react-router'

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

const phases = [
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

function TurnStructure() {
  return (
    <main className="shell page">
      <div className="breadcrumbs">
        <Link to="/">Look Up</Link>
        <span aria-hidden="true">/</span>
        <span>Learn</span>
      </div>
      <p className="eyebrow">Beginner reference</p>
      <h1 className="page-title display-font">Take a turn</h1>
      <p className="lede">
        Every turn follows the same five phases. Most decisions happen during
        the main and combat phases.
      </p>

      <div className="content-stack">
        {phases.map((phase) => (
          <section className="content-card" key={phase.title}>
            <h2>{phase.title}</h2>
            <p>{phase.body}</p>
          </section>
        ))}
        <section className="content-card content-card--memory">
          <h2>Remember this</h2>
          <p>
            Beginning → Main → Combat → Main → Ending. If you are unsure whether
            you can act, ask which phase or step the game is currently in.
          </p>
        </section>
      </div>
    </main>
  )
}
