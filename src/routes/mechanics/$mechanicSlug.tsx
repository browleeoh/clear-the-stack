import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { DetailAccordion } from '@/components/ui/accordion'
import { ScenarioCard } from '@/components/scenario-card'
import { SourceList } from '@/components/source-list'
import { getRelatedCatalogCards } from '@/content/catalog'
import { getConcept } from '@/content/data'

const conceptKindLabels = {
  'keyword-ability': 'Keyword ability',
  'keyword-action': 'Keyword action',
  'set-mechanic': 'Set mechanic',
  'game-concept': 'Rules concept',
  object: 'Game object',
} as const

export const Route = createFileRoute('/mechanics/$mechanicSlug')({
  loader: ({ params }) => {
    const concept = getConcept(params.mechanicSlug)
    if (!concept) throw notFound()
    return concept
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? 'Mechanic'} — MTG Helper` },
      { name: 'description', content: loaderData?.summary ?? '' },
    ],
  }),
  component: MechanicPage,
})

function MechanicPage() {
  const concept = Route.useLoaderData()
  const relatedConcepts = concept.relatedConceptIds.flatMap((id) => {
    const relatedConcept = getConcept(id)
    return relatedConcept ? [relatedConcept] : []
  })
  const relatedCards = getRelatedCatalogCards(concept.id)

  return (
    <main className="shell page">
      <div className="breadcrumbs">
        <Link to="/">Look Up</Link>
        <span aria-hidden="true">/</span>
        <span>{concept.name}</span>
      </div>
      <p className="eyebrow">
        {conceptKindLabels[concept.kind]} · Verified
      </p>
      <h1 className="page-title display-font">{concept.name}</h1>

      <div className="content-stack">
        <section className="content-card">
          <h2>In plain English</h2>
          <p>{concept.summary}</p>
        </section>

        <section className="content-card content-card--memory">
          <h2>Remember this</h2>
          <p>{concept.memoryAid}</p>
        </section>

        <section className="content-card content-card--warning">
          <h2>Easy to miss</h2>
          <ul>
            {concept.easyToMiss.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        {concept.scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}

        <section className="content-card">
          <h2>Related cards and concepts</h2>
          <div className="suggestion-row">
            {relatedConcepts.map((relatedConcept) => (
              <Link className="suggestion" key={relatedConcept.id} to="/mechanics/$mechanicSlug" params={{ mechanicSlug: relatedConcept.id }}>
                {relatedConcept.name}
              </Link>
            ))}
            {relatedCards.map((relatedCard) => (
              <Link className="suggestion" key={relatedCard.id} to="/cards/$cardSlug" params={{ cardSlug: relatedCard.slug }}>
                {relatedCard.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="content-card">
          <DetailAccordion title="Official wording and sources">
            {concept.officialText ? <p>{concept.officialText}</p> : null}
            <SourceList sourceIds={concept.sourceIds} />
          </DetailAccordion>
        </section>
      </div>
    </main>
  )
}
