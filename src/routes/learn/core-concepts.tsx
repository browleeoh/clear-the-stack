import { createFileRoute, Link } from '@tanstack/react-router'
import { SourceList } from '@/components/source-list'
import { DetailAccordion } from '@/components/ui/accordion'

export const coreConceptSections = [
  ['1. Token', 'A token represents a permanent that is not represented by a card. A creature token on the battlefield is a creature permanent, but it is not a card.'],
  ['2. Counter', 'A counter is a marker placed on a player or object. It is not a permanent or token. A +1/+1 counter changes a creature while it remains on that object.'],
  ['3. Target', 'A spell or ability targets only when its rules text or the rules for a keyword say “target.” Required targets are chosen as that spell or ability is put on the stack.'],
  ['4. Stack', 'Most spells and activated or triggered abilities wait on the stack. A new object goes on top, and the top object resolves first.'],
  ['5. Priority', 'Priority is permission for one player at a time to take an action. When everyone passes in succession, the top stack object resolves—or the current phase or step ends if the stack is empty.'],
] as const

export const coreConceptSourceIds = ['cr-rule-110-1', 'cr-rule-111-1', 'cr-rule-111-7', 'cr-rule-122-1', 'cr-rule-122-2', 'cr-rule-115-1', 'cr-rule-115-1d', 'cr-rule-608-2b', 'cr-rule-405-1', 'cr-rule-405-2', 'cr-rule-405-5', 'cr-rule-117-1', 'cr-rule-117-3b', 'cr-rule-117-3d', 'cr-rule-117-4', 'cr-rule-117-5', 'cr-rule-117-7', 'cr-rule-603-3']

export const Route = createFileRoute('/learn/core-concepts')({
  head: () => ({ meta: [{ title: 'Core game concepts — MTG Helper' }, { name: 'description', content: 'A beginner guide to tokens, counters, targets, the stack, and priority.' }] }),
  component: CoreConceptGuide,
})

export function CoreConceptGuide() {
  return (
    <main className="shell page">
      <div className="breadcrumbs"><Link to="/">Look Up</Link><span aria-hidden="true">/</span><Link to="/learn/turn-structure">Learn</Link></div>
      <p className="eyebrow">Beginner reference · Verified · Reviewed August 23, 2026</p>
      <h1 className="page-title display-font">Five core game concepts</h1>
      <p className="lede">Tokens and counters describe game pieces. Targets, the stack, and priority explain how players choose, respond, and resolve actions.</p>
      <div className="content-stack">
        <section className="content-card content-card--memory" aria-labelledby="core-summary"><h2 id="core-summary">One-screen summary</h2><p><strong>Token = permanent. Counter = marker. Target = chosen subject. Stack = waiting order. Priority = permission to act.</strong></p></section>
        {coreConceptSections.map(([title, body]) => <section className="content-card" key={title}><h2>{title}</h2><p>{body}</p></section>)}
        <section className="content-card"><h2>Example</h2><p>Your 2/2 creature token has a +1/+1 counter, so it is 3/3. You cast a spell targeting it. Your opponent gets priority and responds with an instant that returns the token to your hand. The response resolves first; the token leaves the battlefield and then ceases to exist. Your original spell’s only target is now illegal, so that spell does not resolve.</p></section>
        <section className="content-card content-card--warning"><h2>Common mistakes</h2><ul><li>Counting a +1/+1 counter as another permanent. It is only a marker.</li><li>Calling every affected object a target. Look for the word “target” or a targeting keyword rule.</li><li>Resolving every stack object after one round of passing. Resolve only the top object, then players receive priority again.</li></ul></section>
        <section className="content-card"><h2>Related verified concepts</h2><ul><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'token' }}>Token</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'counter' }}>Counter</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'target' }}>Target</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'stack' }}>Stack</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'priority' }}>Priority and responding</Link></li><li><Link to="/mechanics/$mechanicSlug" params={{ mechanicSlug: 'resolution' }}>Resolution</Link></li></ul></section>
        <section className="content-card"><DetailAccordion title="Technical detail and official sources"><p>Counters are not objects and normally do not move with a card across zones. Target legality is checked again as a spell or ability would resolve. Passing priority does not empty the whole stack: after the top object resolves, state-based actions and triggers are handled before the active player receives priority again.</p><SourceList sourceIds={coreConceptSourceIds} /></DetailAccordion></section>
      </div>
    </main>
  )
}
