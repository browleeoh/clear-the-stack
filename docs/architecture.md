# Architecture decisions

## Current vertical slice

- TanStack Start and file-based TanStack Router
- React and TypeScript
- Vite and static prerendering
- Tailwind CSS with Base UI primitives
- Zod-validated, version-controlled content
- MiniSearch local full-text index
- Vite PWA service worker and web app manifest
- No backend, accounts, analytics service, or runtime secret

## Deferred packages

- **TanStack Query:** add when content or feedback comes from a remote service.
- **TanStack DB:** add when collections become editable, synchronized, or large enough to benefit from reactive joins.
- **TanStack AI:** add only with a source-grounded server-side answer pipeline.
- **TanStack Form:** add when forms exceed the simple feedback controls planned for V0.
- **TanStack Virtual:** add only if a real screen needs to render a long list.
- **TanStack Pacer:** add when remote search, autosave, or rate-limited work needs explicit scheduling.

## Route model

```text
/
/cards/$cardSlug
/mechanics/$mechanicSlug
/learn/turn-structure
```

## Content rule

All published outcome claims must reference an authoritative source and carry a verification status. Relationships among cards, mechanics, concepts, scenarios, and sources aid navigation and retrieval; they are not an executable Magic rules engine.

Source records represent documents once. Normalized source locators point to a parent
source and identify a named section, rule number, or card-specific coverage status.
Card coverage explicitly distinguishes a dedicated release-note entry, a card used only
as a general mechanic example, and the verified absence of a card-specific entry.
Dataset validation rejects duplicate source and locator IDs, invalid locator parents,
and source references that resolve to neither a document nor a locator.
