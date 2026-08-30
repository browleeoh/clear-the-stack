---
name: v01-ralph-loop
description: Run the Clear the Stack V0.1 field-guidance issue-to-merge loop for approved ready units in docs/v0.1-execution-plan.md. Use for the bounded FG-01–FG-08 correction ledger; do not use for new roadmap or product decisions.
---

# V0.1 Field-Guidance Ralph Loop

Use this skill only when the user has authorized the external GitHub actions needed by
the run. Persistence never expands permission to create issues, push branches, open
pull requests, or merge them.

Read these repository files before selecting work:

- `docs/v0.1-execution-plan.md`
- `docs/product-spec.md`
- `docs/architecture.md`
- `docs/card-data.md`
- `docs/v0-house-game-release-checklist.md`

Then read [references/loop-contract.md](references/loop-contract.md) completely and
follow it for each selected unit.

## Selection boundary

Select only the first approved work unit whose status is `ready` in
`docs/v0.1-execution-plan.md`. Do not infer new work from coverage gaps, reorder units,
combine units, or promote a `queued` unit whose dependencies are incomplete. Never
expand the FG-01–FG-08 roadmap, including by adding a concept, card, or product
decision not named in the ledger.

FG-01–FG-03 are Tranche A. After FG-03, stop at the mandatory deployed real-device and
house-game validation gate. Do not select FG-04 or later until the user explicitly
approves continuation and records that approval by making FG-04 `ready`.

## Authority boundary

The goal must explicitly state which GitHub writes and merges are authorized. Without
that authority, stop before the first external write and request it. Never use force
push, administrator bypass, disabled or skipped checks, destructive history rewriting,
or a merge method forbidden by repository settings.

## Required independence

Implementation and final review must be separate agent roles. Give a fresh reviewer the
issue, authoritative repository documents, exact diff, and validation evidence. The
reviewer must inspect rather than trust the implementation report and must not edit the
implementation. Apply corrections only in the implementation role, then obtain review
of the new exact diff.

## Stop conditions

Stop the loop and report a blocker when:

- official sources conflict, are unavailable, or have advanced in a way that changes
  the approved scope;
- the normalized HOB catalog conflicts with current Oracle text;
- ownership, product intent, or scope requires a user decision;
- the next unit is not `ready`, lies outside FG-01–FG-08, or crosses the post-FG-03
  validation gate without explicit approval;
- a broadly reusable dependency outside the ledger is required;
- authentication, branch protection, required CI, or merging remains blocked after
  three meaningful attempts;
- review cannot be satisfied without expanding the approved unit;
- the working tree contains unexplained changes; or
- completing the unit would require a database, multi-set architecture, analytics,
  image/audio search, unrelated product work, or speculative infrastructure.

When the authorized boundary is complete, report issue links, branches, commits, pull
requests, merge commits, validation evidence, source versions, and the next ledger
state, then stop.
