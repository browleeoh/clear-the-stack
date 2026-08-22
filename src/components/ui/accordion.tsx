import { Accordion } from '@base-ui/react/accordion'
import type { ReactNode } from 'react'

export function DetailAccordion({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Accordion.Root>
      <Accordion.Item value="details">
        <Accordion.Header>
          <Accordion.Trigger className="accordion-trigger">
            {title}
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel className="accordion-panel">
          {children}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  )
}
