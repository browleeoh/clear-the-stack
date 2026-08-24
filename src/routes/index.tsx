import { createFileRoute } from '@tanstack/react-router'
import { SearchExperience } from '@/components/search-experience'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="shell page">
      <p className="eyebrow">Playing The Hobbit</p>
      <h1 className="page-title display-font">Understand your card.</h1>
      <SearchExperience />
    </main>
  )
}
