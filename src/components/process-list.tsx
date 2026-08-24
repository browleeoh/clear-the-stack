type Step = { title: string; body: string } | readonly [string, string]

export function ProcessList({ steps }: { steps: readonly Step[] }) {
  return <ol className="process-list">{steps.map((step) => {
    const [title, body] = 'title' in step ? [step.title, step.body] : step
    return <li key={title}><h2>{title}</h2><p>{body}</p></li>
  })}</ol>
}
