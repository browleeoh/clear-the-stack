import type { Scenario } from '@/content/schema'

const answerLabels: Record<Scenario['answer'], string> = {
  yes: 'Yes',
  no: 'No',
  depends: 'It depends',
  explanation: 'Answer',
}

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <article className="content-card scenario-card" id={scenario.id}>
      <span className="scenario-answer">{answerLabels[scenario.answer]}</span>
      <h2>{scenario.title}</h2>
      <ul>
        {scenario.setup.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p><strong>{scenario.question}</strong></p>
      <p>{scenario.explanation}</p>
      {scenario.canRespond ? (
        <p><strong>Can players respond?</strong> {scenario.canRespond}</p>
      ) : null}
      {scenario.commonMistake ? (
        <p><strong>Common mistake:</strong> {scenario.commonMistake}</p>
      ) : null}
    </article>
  )
}
