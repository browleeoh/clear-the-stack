import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { DetailAccordion } from '@/components/ui/accordion'
import { ScenarioCard } from '@/components/scenario-card'
import { SourceList } from '@/components/source-list'
import { getCardContentBySlug } from '@/content/catalog'
import { getConcept } from '@/content/data'
import type { CatalogCard } from '@/content/schema'

export const Route = createFileRoute('/cards/$cardSlug')({
  loader: ({ params }) => {
    const content = getCardContentBySlug(params.cardSlug)
    if (!content) throw notFound()
    return content
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.catalogCard.name ?? 'Card'} — MTG Helper` },
      {
        name: 'description',
        content:
          loaderData?.enrichment?.summary ??
          loaderData?.catalogCard.oracleText ??
          '',
      },
    ],
  }),
  component: CardPage,
})

function CardImage({ card }: Readonly<{ card: CatalogCard }>) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const showImage = Boolean(card.imageUri) && !imageFailed

  useEffect(() => {
    const image = imageRef.current
    if (image?.complete && image.naturalWidth === 0) setImageFailed(true)
  }, [])

  return (
    <div className="card-visual">
      {showImage ? (
        <img
          ref={imageRef}
          className="card-image"
          src={card.imageUri}
          alt={`Full card image of ${card.name}`}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="card-frame" aria-label={`Text preview of ${card.name}`}>
          <div className="card-art">
            <span>{card.name}</span>
          </div>
          <div className="card-text">
            <strong>
              {card.manaCost ? `${card.manaCost} · ` : ''}
              {card.typeLine}
            </strong>
            {'\n\n'}
            {card.oracleText}
            <div className="statline">
              <span>{card.setCode} #{card.collectorNumber}</span>
            </div>
          </div>
        </div>
      )}
      {!showImage ? (
        <p className="image-status" role="status">
          Card image unavailable. Rules text is shown instead.
        </p>
      ) : null}
      {card.artist ? <p className="image-credit">Illustrated by {card.artist}</p> : null}
    </div>
  )
}

function CardDetails({ card }: Readonly<{ card: CatalogCard }>) {
  if (card.faces?.length) {
    return (
      <section className="content-card card-details" aria-labelledby="card-details-heading">
        <h2 id="card-details-heading">Card details</h2>
        <div className="card-faces">
          {card.faces.map((face) => (
            <article className="card-face" key={face.name}>
              <h3>{face.name}</h3>
              <p>
                {face.manaCost ? <strong>{face.manaCost}</strong> : null}
                {face.manaCost ? ' · ' : null}
                {face.typeLine}
              </p>
              <p style={{ whiteSpace: 'pre-line' }}>{face.oracleText}</p>
            </article>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="content-card card-details" aria-labelledby="card-details-heading">
      <h2 id="card-details-heading">Card details</h2>
      <p className="card-type-line">
        {card.manaCost ? <strong>{card.manaCost}</strong> : null}
        {card.manaCost ? ' · ' : null}
        {card.typeLine}
      </p>
      <p style={{ whiteSpace: 'pre-line' }}>{card.oracleText}</p>
    </section>
  )
}

function CardPage() {
  const { catalogCard: card, enrichment } = Route.useLoaderData()

  return (
    <main className="shell page">
      <div className="breadcrumbs">
        <Link to="/">Look Up</Link>
        <span aria-hidden="true">/</span>
        <span>{card.name}</span>
      </div>
      <p className="eyebrow">
        {card.setCode} #{card.collectorNumber} ·{' '}
        {enrichment ? 'Verified guidance' : 'Basic card reference'}
      </p>
      <h1 className="page-title display-font">{card.name}</h1>

      <div className="card-layout">
        <CardDetails card={card} />
        <CardImage key={card.id} card={card} />

        <div className="content-stack" style={{ marginTop: 0 }}>
          {enrichment ? (
            <section className="content-card">
              <h2>What this card does</h2>
              <p>{enrichment.summary}</p>
            </section>
          ) : null}

          {enrichment ? (
            <>
              <section className="content-card">
                <h2>Mechanics on this card</h2>
                <div className="suggestion-row">
                  {enrichment.conceptIds.map((conceptId) => {
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
                  {enrichment.easyToMiss.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              {enrichment.scenarios.map((scenario) => (
                <ScenarioCard key={scenario.id} scenario={scenario} />
              ))}
            </>
          ) : null}

          <section className="content-card">
            <DetailAccordion title="Oracle text and official sources">
              <p style={{ whiteSpace: 'pre-line' }}>{card.oracleText}</p>
              {enrichment ? <SourceList sourceIds={enrichment.sourceIds} /> : null}
              <p>
                <a href={card.scryfallUri} target="_blank" rel="noreferrer">
                  View this printing on Scryfall
                </a>
              </p>
            </DetailAccordion>
          </section>
        </div>
      </div>
    </main>
  )
}
