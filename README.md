# MTG Helper

A mobile-first progressive web app that explains *Magic: The Gathering | The Hobbit* cards and mechanics through plain-English guidance, common mistakes, and verified gameplay scenarios.

## Current scope

This repository contains the first vertical slice:

- Local search across sample cards, mechanics, concepts, and learning topics
- Complete Storied mechanic guide
- Thorin Oakenshield card guide
- Beginner turn-structure reference
- Zod-validated structured content
- Static prerendering and installable PWA behavior

The next content milestone imports all 193 mechanically distinct HOB main-set cards for basic search and card pages, then adds curated scenarios to 20–25 high-confusion cards.

## Run locally

Requirements: Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Validate

```bash
npm run check
```

This runs TypeScript checks, tests, and a production build.

## Project structure

```text
src/content/       Verified cards, concepts, scenarios, and sources
src/components/    Application and UI components
src/lib/           Local search and application utilities
src/routes/        TanStack Router routes
docs/              Product and architecture decisions
public/            PWA icons and public assets
```

## Content policy

Oracle text and gameplay outcomes should be verified against current official sources. Community resources may identify confusing questions but should not be the sole authority for a published rules answer.

## Deployment

TanStack Start supports multiple hosting targets. V0 contains no required backend or runtime secrets, so it can initially be deployed as a statically prerendered application. Provider-specific configuration will be added only when a hosting provider is selected.
