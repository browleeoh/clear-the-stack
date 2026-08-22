import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { DetailAccordion } from '@/components/ui/accordion'
import { ScenarioCard } from '@/components/scenario-card'
import { SourceList } from '@/components/source-list'
import { getCard, getConcept } from '@/content/data'

export const Route = createFileRoute('/cards/$cardSlug')({
  loader: ({ params }) => {
    const card = getCard(params.cardSlug)
    if (!card) throw notFound()
    return card
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? 'Card'} — MTG Helper` },
      { name: 'description', content: loaderData?.summary ?? '' },
    ],
  }),
  component: CardPage,
})

function CardPage() {
  const card = Route.useLoaderData()

  return (
    <main className="shell page">
      <div className="breadcrumbs">
        <Link to="/">Look Up</Link>
        <span aria-hidden="true">/</span>
        <span>{card.name}</span>
      </div>
      <p className="eyebrow">{card.setCode} #{card.collectorNumber} · Verified</p>
      <h1 className="page-title display-font">{card.name}</h1>

      <div className="card-layout">
        <div className="card-frame" aria-label={`Text preview of ${card.name}`}>
          <div className="card-art">
            <span>{card.name}</span>
          </div>
          <div className="card-text">
            <strong>{card.manaCost} · {card.typeLine}</strong>
            {'\n\n'}
            {card.oracleText}
            <div className="statline">
              <span>{card.setCode} #{card.collectorNumber}</span>
              <span>{card.power}/{card.toughness}</span>
            </div>
          </div>
        </div>

        <div className="content-stack" style={{ marginTop: 0 }}>
          <section className="content-card">
            <h2>What this card does</h2>
            <p>{card.summary}</p>
          </section>

          <section className="content-card">
            <h2>Mechanics on this card</h2>
            <div className="suggestion-row">
              {card.conceptIds.map((conceptId) => {
                const concept = getConcept(conceptId)
                if (!concept) return null
                return (
                  <Link
                    className="suggestion"
                    key={concept.id}
                    to="/mechanics/$mechanicSlug"
                    params={{ mechanicSlug: concept.id }}
                  >
                    {concept.name}
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="content-card content-card--warning">
            <h2>Easy to miss</h2>
            <ul>
              {card.easyToMiss.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          {card.scenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}

          <section className="content-card">
            <DetailAccordion title="Oracle text and official sources">
              <p style={{ whiteSpace: 'pre-line' }}>{card.oracleText}</p>
              <SourceList sourceIds={card.sourceIds} />
            </DetailAccordion>
          </section>
        </div>
      </div>
    </main>
  )
}
