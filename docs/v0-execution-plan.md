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

## Pilot tranche

The first unattended goal should process exactly these four units. Stop after all four
are merged, even if later work is ready.

| ID | Unit | Status | Suggested branch |
| --- | --- | --- | --- |
| `V0-08` | Counter, Equipment, and attachment concept foundation | complete | `codex/equipment-concept-foundation` |
| `V0-09` | Triggered ability, Target, and Resolution concept foundation | complete | `codex/interaction-concept-foundation` |
| `V0-10` | Dwalin, Weaponmaster curated guidance | ready | `codex/dwalin-guidance` |
| `V0-11` | Sting, Bilbo's Sword curated guidance | queued | `codex/sting-guidance` |

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

## Remaining V0 queue after the pilot

These groups are deliberately not decomposed into selectable issues yet. After the
pilot, review its history and create the next bounded tranche without changing the
product specification.

1. Recruit and its required supporting concepts.
2. Amass Goblins and its required supporting concepts.
3. Ferocious and its required supporting concepts.
4. Landfall and its required supporting concepts.
5. Remaining first-ten card guidance in the approved authoring order.
6. Remaining approved curated cards to reach at least twenty verified cards.
7. Remaining Learn topics.
8. Recent and unanswered-search logging.
9. Helpfulness and correction feedback.
10. Test-log export and reset.
11. Offline behavior and external-resource fallback.
12. Accessibility, mobile installation, and house-game validation.

V0.5, V1, V1.5, and V2 remain deferred roadmap directions and are not selectable by
this ledger.

## Starting the pilot in a fresh session

After this setup is merged, start a new session from clean, updated `main` and use:

```text
/goal Use $v0-ralph-loop to complete the four-unit pilot tranche in
docs/v0-execution-plan.md. You are authorized to create the scoped GitHub issues,
create and switch task branches, edit in-scope repository files, commit reviewed
changes, push only task branches, open pull requests against main, wait for required CI,
merge pull requests that satisfy every guardrail, close linked issues, and repeat from
fresh origin/main. Do not use force push, administrator bypass, skipped checks, or any
scope outside the pilot. Stop only at the skill's blocker conditions or after all four
pilot pull requests are merged and verified on origin/main.
```
