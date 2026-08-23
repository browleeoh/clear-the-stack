# V0 execution plan

**Purpose:** Durable, ordered work ledger for the guarded V0 issue-to-merge loop

**Current `origin/main` when created:** `4ce0790` (PR #7, hone-counter foundation)

**Authority:** `docs/product-spec.md` remains the product authority. This ledger controls
execution order but cannot expand product scope.

Every loop-created pull request must pass the repository's `Validate / npm run check`
GitHub Actions check. A missing or skipped validation run is not a passing result.

## Status rules

- `complete`: merged into `main` and verified on `origin/main`.
- `ready`: dependencies are complete and a goal-driven session may select it.
- `queued`: approved in principle but not selectable yet.
- `blocked`: requires a recorded user or external decision.

Only the first `ready` row may be selected. A pull request that completes a row may mark
that row `complete` and promote only its immediate dependent to `ready`. The ledger
update must be part of the reviewed pull-request diff.

## Completed foundation

| Unit | Status | Result |
| --- | --- | --- |
| HOB catalog foundation | complete | 193 generated main-set card records |
| Catalog search and basic card routes | complete | All 193 cards searchable and prerendered |
| Provisional card priorities | complete | First 10, next 15, and alternates documented |
| Authoritative source records | complete | Documents, locators, and first-ten release-note coverage |
| Hone-counter mechanic foundation | complete | Verified shared mechanic guide and scenarios |

## Completed pilot tranche

The first unattended goal processed these four units and demonstrated the guarded loop.

| ID | Unit | Status | Suggested branch |
| --- | --- | --- | --- |
| `V0-08` | Counter, Equipment, and attachment concept foundation | complete | `codex/equipment-concept-foundation` |
| `V0-09` | Triggered ability, Target, and Resolution concept foundation | complete | `codex/interaction-concept-foundation` |
| `V0-10` | Dwalin, Weaponmaster curated guidance | complete | `codex/dwalin-guidance` |
| `V0-11` | Sting, Bilbo's Sword curated guidance | complete | `codex/sting-guidance` |

### V0-08 — Counter, Equipment, and attachment concept foundation

Scope:

- Add the minimum verified shared concepts needed to understand hone counters, Dwalin,
  and Sting: counters, Equipment, attachment, and the distinction between an Equipment
  object and its equip ability.
- Add precise current Comprehensive Rules locators required by the published outcomes.
- Provide beginner summaries, memory aids, easy-to-miss guidance, bounded scenarios,
  source disclosure, search discovery, routes, tests, and mobile validation.

Exclusions:

- No Dwalin or Sting curated card authorship.
- No broad Equipment tutorial beyond cases required by the two cards and hone counters.
- No unrelated mechanic, card, feedback, offline, or navigation work.

Acceptance:

- Every published outcome is verified against current official sources and has a review
  date where the content model supports one.
- Existing hone-counter, Storied, Thorin, catalog, and route behavior remains intact.
- Focused and full validation, source integrity, production build, prerendering,
  `npm run check`, `git diff --check`, and mobile browser checks pass.

### V0-09 — Triggered ability, Target, and Resolution concept foundation

Scope:

- Add the minimum verified Triggered Ability, Target, and Resolution concepts needed by
  Dwalin and Sting, including choosing targets, `up to one`, target legality, checking
  targets on resolution, partial resolution, and the timing distinction between a
  trigger and its effect.
- Add precise current Comprehensive Rules locators required by the published outcomes.
- Provide beginner summaries, memory aids, easy-to-miss guidance, bounded scenarios,
  source disclosure, search discovery, routes, tests, and mobile validation.

Exclusions:

- No Dwalin or Sting curated card authorship.
- No broad stack or priority tutorial beyond what the two cards require.
- No unrelated mechanic, card, feedback, offline, or navigation work.

Acceptance:

- Every published outcome is verified against current official sources and has a review
  date where the content model supports one.
- Existing concept, card, catalog, search, and route behavior remains intact.
- Focused and full validation, source integrity, production build, prerendering,
  `npm run check`, `git diff --check`, and mobile browser checks pass.

### V0-10 — Dwalin, Weaponmaster curated guidance

Scope:

- Add verified beginner summary, linked concepts, easy-to-miss guidance, and bounded
  scenarios for Dwalin using the established hone-counter and Equipment foundations.
- Cover entering or attacking, one counter on each Equipment controlled, multiple
  counters, unattached Equipment, moving Equipment, and ability loss without duplicating
  the shared mechanic page.

Exclusions:

- No Sting authorship and no other first-ten card guidance.
- No new mechanic foundation unless a missing dependency is reported as a blocker.

Acceptance:

- Card enrichment joins by Dwalin's stable Oracle UUID and the existing route slug stays
  unchanged.
- Outcomes use precise official locators, verified scenarios carry review dates, search
  and the card route expose the enrichment, and all required automated/mobile checks
  pass.

### V0-11 — Sting, Bilbo's Sword curated guidance

Scope:

- Add verified beginner summary, linked concepts, easy-to-miss guidance, and bounded
  scenarios for Sting using the established hone-counter and Equipment foundations.
- Cover its enter trigger, target opponent, counter count, `up to one` friendly target,
  target legality, choosing no creature, attachment during resolution, partial
  resolution, and moving Sting later.

Exclusions:

- No other first-ten card guidance.
- Do not claim a card-specific Release Notes entry; preserve its recorded
  `no-card-specific-entry` classification.
- No new mechanic foundation unless a missing dependency is reported as a blocker.

Acceptance:

- Card enrichment joins by Sting's stable Oracle UUID and the existing route slug stays
  unchanged.
- Every outcome is supported by current Oracle text, current Comprehensive Rules, and
  applicable official Hobbit material; verified scenarios carry review dates.
- Search, card-route behavior, sources, focused/full tests, build, prerendering,
  `npm run check`, `git diff --check`, and mobile browser checks pass.

## Continuous implementation ledger

One authorized goal may process this entire ordered ledger without stopping at the
thematic phase labels. Each row remains a separate issue, branch, review, commit, and
pull request. Only the first `ready` row is selectable; merging it may promote only its
immediate `queued` dependent.

All units inherit these requirements:

- Preserve the product, architecture, data, attribution, editorial, and source rules in
  the authoritative repository documents.
- Keep work to the minimum needed by the named unit; do not silently absorb a later
  row or post-V0 work.
- For verified rules content, record current official-source and Oracle-text freshness,
  use normalized locators, add review dates, and cover source integrity in tests.
- For player-facing changes, include search/navigation behavior, focused and regression
  tests, static prerendering where applicable, and mobile browser evidence.
- Pass the full loop contract, including independent review and guarded merge.

### Phase A — Remaining mechanic and first-ten foundations

| ID | Unit | Status | Depends on | Suggested branch |
| --- | --- | --- | --- | --- |
| `V0-12` | Stack, priority, responding, and activated/static ability foundation | complete | `V0-11` | `codex/stack-priority-foundation` |
| `V0-13` | Zones, state-based actions, “this way,” and “and/or” foundation | complete | `V0-12` | `codex/zones-wording-foundation` |
| `V0-14` | Recruit mechanic foundation | complete | `V0-13` | `codex/recruit-foundation` |
| `V0-15` | Celebrate the Mountain-king curated guidance | complete | `V0-14` | `codex/celebrate-guidance` |
| `V0-16` | Amass Goblins and Army token foundation | complete | `V0-15` | `codex/amass-foundation` |
| `V0-17` | Sacrifice, last known information, reflexive triggers, and excess damage foundation | complete | `V0-16` | `codex/amass-interaction-foundation` |
| `V0-18` | Azog, Moria's Ruin curated guidance | complete | `V0-17` | `codex/azog-guidance` |
| `V0-19` | Bolg of the North curated guidance | complete | `V0-18` | `codex/bolg-guidance` |
| `V0-20` | Ferocious and intervening-if foundation | complete | `V0-19` | `codex/ferocious-foundation` |
| `V0-21` | Nasty Little Rabbit curated guidance | complete | `V0-20` | `codex/nasty-little-rabbit-guidance` |
| `V0-22` | Landfall, land entry, and “this way” zone-change foundation | complete | `V0-21` | `codex/landfall-foundation` |
| `V0-23` | Silvan Reveler curated guidance | complete | `V0-22` | `codex/silvan-reveler-guidance` |
| `V0-24` | Artifact, legendary permanent, and static-ability foundation | complete | `V0-23` | `codex/artifact-legendary-foundation` |
| `V0-25` | Bifur, Melodic Rider curated guidance | complete | `V0-24` | `codex/bifur-guidance` |
| `V0-26` | Replacement effects and modified draw/discard foundation | complete | `V0-25` | `codex/replacement-effects-foundation` |
| `V0-27` | Bard, King of Dale curated guidance | complete | `V0-26` | `codex/bard-king-guidance` |

Phase A scope and acceptance:

- Each foundation adds only the concepts needed by the dependent cards and the product
  specification, with beginner summaries, memory aids, bounded scenarios, accessible
  official wording, source locators, search discovery, related links, and routes.
- Recruit covers uninterrupted resolution, land versus nonland discard, drawing and
  discarding modified or impossible, and response timing. Amass covers choosing or
  creating an Army, placing counters, multiple Armies, and zero-toughness concerns.
  Ferocious covers the applicable trigger-time and resolution-time checks. Landfall
  covers lands entering through play or effects and resulting trigger timing.
- Each card unit covers the hypotheses listed for that card in
  `docs/v0-card-priorities.md`, but publishes only outcomes supported by current official
  sources. Stable Oracle UUID joins and existing route slugs must remain unchanged.
- A card unit may add the minimum card-specific locators and explanation needed for its
  verified scenarios when a rules area does not justify a reusable concept page. If the
  missing material is broadly reusable or expands beyond that card's recorded
  hypotheses, report a scope blocker instead of creating an unplanned foundation.
- Phase A completes curated guidance for all first-ten cards without duplicating shared
  concept material on card pages.

### Phase B — Curated cards eleven through twenty

| ID | Unit | Status | Depends on | Suggested branch |
| --- | --- | --- | --- | --- |
| `V0-28` | Saga and lore-counter foundation | complete | `V0-27` | `codex/saga-foundation` |
| `V0-29` | Balin, Loremaster curated guidance | complete | `V0-28` | `codex/balin-guidance` |
| `V0-30` | Bard the Bowman curated guidance | complete | `V0-29` | `codex/bard-bowman-guidance` |
| `V0-31` | Bard's Company curated guidance | complete | `V0-30` | `codex/bards-company-guidance` |
| `V0-32` | The Queen of Dale curated guidance | ready | `V0-31` | `codex/queen-of-dale-guidance` |
| `V0-33` | The Chief Warg curated guidance | queued | `V0-32` | `codex/chief-warg-guidance` |
| `V0-34` | Beorn's Hospitality curated guidance | queued | `V0-33` | `codex/beorns-hospitality-guidance` |
| `V0-35` | Down in the Valley curated guidance | queued | `V0-34` | `codex/down-in-the-valley-guidance` |
| `V0-36` | Dancing from Dark to Dawn curated guidance | queued | `V0-35` | `codex/dancing-guidance` |
| `V0-37` | Goblin Plate Mail curated guidance | queued | `V0-36` | `codex/goblin-plate-mail-guidance` |
| `V0-38` | Rhovanion Rampager curated guidance | queued | `V0-37` | `codex/rhovanion-rampager-guidance` |

Phase B scope and acceptance:

- Add the minimum Saga foundation before the first dependent Saga card; do not create a
  broad advanced Saga tutorial.
- Author the provisional ranks 11–20 in order. Each card covers its recorded hypotheses
  only where verified, reuses established concepts, preserves stable joins/routes, and
  provides search discovery, bounded scenarios, accessible sources, and mobile checks.
- Card-specific rules such as casting permissions, mana abilities, per-opponent event
  tracking, type changes, power/toughness, cast triggers, mana value, or X may be
  explained with precise locators inside the relevant card unit when no reusable
  concept page is warranted. Broad shared teaching remains a reported dependency, not
  silent scope expansion.
- Completion of `V0-38` must leave at least twenty curated verified card records in the
  production dataset and add a dataset-level test enforcing that minimum without
  hard-coding explanatory prose.

### Phase C — Learn, local test instrumentation, and offline release hardening

| ID | Unit | Status | Depends on | Suggested branch |
| --- | --- | --- | --- | --- |
| `V0-39` | Existing Turn Structure Learn page completion audit | queued | `V0-38` | `codex/learn-turn-structure-audit` |
| `V0-40` | Learn: casting and resolving a spell | queued | `V0-39` | `codex/learn-casting-resolution` |
| `V0-41` | Learn: attacking and blocking | queued | `V0-40` | `codex/learn-combat` |
| `V0-42` | Learn: tokens versus counters, targeting, stack, and priority | queued | `V0-41` | `codex/learn-core-concepts` |
| `V0-43` | Search journey completion: grouping, scenario links, recent searches, and beginner-query behavior | queued | `V0-42` | `codex/search-journey-completion` |
| `V0-44` | Unanswered-search capture and no-result save flow | queued | `V0-43` | `codex/unanswered-searches` |
| `V0-45` | Helpfulness and unclear/incorrect feedback capture | queued | `V0-44` | `codex/local-feedback` |
| `V0-46` | Local house-game test-log export and reset | queued | `V0-45` | `codex/test-log-export` |
| `V0-47` | Offline application shell, curated content, and external-image/source fallback | queued | `V0-46` | `codex/offline-hardening` |
| `V0-48` | Accessibility, performance, and mobile-installation readiness audit | queued | `V0-47` | `codex/release-readiness-audit` |

Phase C scope and acceptance:

- `V0-39` brings the existing Turn Structure page through the same editorial and
  verification bar as new Learn content, including its one-screen summary, ordered
  steps, example, common mistake, related concepts, optional technical detail,
  accessible official sources, review evidence, search discovery, and prerender route.
  All Learn pages reuse verified concepts and remain beginner bounded.
- Local instrumentation stores only the fields allowed by the product specification,
  records no names, decks, or game state, survives reloads, and offers understandable
  export/reset controls. Tests must isolate browser storage and cover unavailable or
  malformed stored data.
- By `V0-46`, each test-log record or linked event sequence must export the search query,
  whether a result was selected, the selected result when present, helpfulness response,
  unclear/incorrect report when present, and timestamp. The schema must preserve the
  relationship among a lookup and its later feedback without collecting identity or
  game-state data, and reset must remove the complete local log only after clear user
  confirmation.
- Offline work must keep core text and navigation usable after first load while leaving
  third-party images and source documents remote and optional. Clearly disclose offline
  unavailability without precaching external card imagery.
- The readiness audit verifies the product's timing, touch-target, zoom/text sizing,
  color-independence, keyboard/screen-reader, one-tap-source, and responsive requirements
  with automatable checks, representative mobile viewports, and locally served browser
  evidence. It validates manifest/service-worker readiness and documents the exact
  physical-device checks still pending; deployed physical-phone installation and
  offline verification belong exclusively to the human deployment gate.
- `V0-48` evaluates GitHub issue #17 with measurements and reduces the client chunk only
  if evidence shows a meaningful target-device risk. It produces a version-controlled
  house-game release checklist and evidence record, but may not claim that deployment,
  physical-phone installation, or human sessions occurred.

## Human gates after implementation

These gates are deliberately not selectable by an autonomous implementation goal:

| Gate | Status | Requirement |
| --- | --- | --- |
| Shared deployment and target-phone installation | blocked | The user must select or authorize a hosting provider; then deployment, HTTPS/PWA installation, offline verification, and the exact tested revision can be recorded. |
| Three house-game sessions | blocked | Real players must use the app in at least three sessions under the product-specification test plan. |
| Post-session correction pass and V0 decision | blocked | Review exported logs and observations, implement verified corrections through the same guarded loop, and assess every V0 acceptance criterion and success signal. |

The implementation goal must stop after `V0-48` or earlier at a skill blocker. It must
not infer that a deployment provider is authorized, simulate human play, fabricate
session evidence, or declare V0 validated without the human gates.

V0.5, V1, V1.5, and V2 remain deferred and are outside this ledger.

## Starting the remaining V0 implementation in a fresh session

After this plan is merged, start a new Pursue Goal session from clean, updated `main`:

```text
/goal Use $v0-ralph-loop to complete every implementation-ready work unit from V0-12
through V0-48 in docs/v0-execution-plan.md.

You are authorized to create the scoped GitHub issues, create and switch task branches,
edit in-scope repository files, commit reviewed changes, push only task branches, open
pull requests against main, wait for required CI, merge pull requests that satisfy every
guardrail, close linked issues, and repeat from fresh origin/main.

Do not use force push, administrator bypass, skipped checks, or any scope outside V0-12
through V0-48. Continue across the plan's thematic phases without waiting for routine
user approval. Stop only at the skill's blocker conditions or after V0-48 is merged and
verified on origin/main. Do not cross the deployment or house-game validation gates.
```
