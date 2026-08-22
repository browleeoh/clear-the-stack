import { createFileRoute } from '@tanstack/react-router'
import { SearchExperience } from '@/components/search-experience'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="shell page">
      <p className="eyebrow">Playing The Hobbit</p>
      <h1 className="page-title display-font">Understand the card in front of you.</h1>
      <p className="lede">
        Search a card, mechanic, or question. Get the quick answer first, then
        open examples and official details only when you need them.
      </p>
      <SearchExperience />
    </main>
  )
}
