import type { ReactNode } from 'react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { BookIcon, SearchIcon } from '@/components/icons'
import { PwaRegister } from '@/components/pwa-register'
import { LocalFeedback } from '@/components/local-feedback'
import { TestLogControls } from '@/components/test-log-controls'
import { OfflineStatus } from '@/components/offline-status'
import '@/styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        name: 'theme-color',
        content: '#173f35',
      },
      {
        title: 'MTG Helper — Understand the card in front of you',
      },
      {
        name: 'description',
        content:
          'Beginner-friendly Magic card explanations, mechanics, and gameplay scenarios.',
      },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg' },
      { rel: 'manifest', href: '/manifest.webmanifest' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <header className="app-header">
        <div className="shell app-header__inner">
          <Link to="/" className="brand">
            <span className="brand__mark" aria-hidden="true">
              <BookIcon size={19} />
            </span>
            <span className="brand__name">MTG Helper</span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link to="/" className="nav-link" activeProps={{ 'aria-current': 'page' }}>
              Look Up
            </Link>
            <Link
              to="/learn/turn-structure"
              className="nav-link"
              activeProps={{ 'aria-current': 'page' }}
            >
              Learn
            </Link>
          </nav>
        </div>
      </header>

      <OfflineStatus />

      <Outlet />
      {import.meta.env.DEV ? <><LocalFeedback /><TestLogControls /></> : null}
      <PwaRegister />

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <Link to="/" className="nav-link" activeProps={{ 'aria-current': 'page' }}>
          <SearchIcon size={16} /> Look Up
        </Link>
        <Link
          to="/learn/turn-structure"
          className="nav-link"
          activeProps={{ 'aria-current': 'page' }}
        >
          <BookIcon size={16} /> Learn
        </Link>
      </nav>
      {import.meta.env.DEV ? <TanStackRouterDevtools position="bottom-right" /> : null}
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
