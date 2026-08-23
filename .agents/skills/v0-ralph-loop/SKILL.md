---
name: v0-ralph-loop
description: Run the Clear the Stack V0 issue-to-merge loop for approved work units in docs/v0-execution-plan.md. Use when a goal-driven session should select the next ready unit, implement it on a fresh branch, obtain independent review, open and merge a guarded pull request, and repeat without routine user steering. Do not use for roadmap work outside V0 or for unlisted product decisions.
---

# V0 Ralph Loop

Use this skill only when the user has authorized the external GitHub actions needed by
the run. Persistence never expands permission to create issues, push branches, open
pull requests, or merge them.

Read these repository files before selecting work:

- `docs/v0-execution-plan.md`
- `docs/product-spec.md`
- `docs/architecture.md`
- `docs/card-data.md`
- `docs/v0-card-priorities.md`

Then read [references/loop-contract.md](references/loop-contract.md) completely and
follow it for each work unit.

## Selection boundary

Select only the first work unit whose status is `ready`. Do not infer new work from the
roadmap, reorder units, combine units, or promote a `queued` unit whose dependencies
are incomplete. One goal may process only the tranche named in the user's goal.

## Authority boundary

The goal must explicitly say which GitHub writes and merge actions are authorized.
Without that authority, stop before the first external write and request it. Never use
force push, administrator bypass, disabled checks, destructive history rewriting, or a
merge method forbidden by repository settings.

## Required independence

Implementation and final review must be separate agent roles. Give a fresh reviewer
the issue, authoritative repository documents, exact diff, and validation evidence.
The reviewer must inspect rather than trust the implementation report and must not
edit the implementation. Apply corrections only in the implementation role, then
obtain review of the new exact diff.

## Stop conditions

Stop the loop and report a blocker when:

- official sources conflict, are unavailable, or do not support a proposed outcome;
- ownership, product intent, or scope requires a user decision;
- the next unit is not `ready` or lies outside the authorized tranche;
- authentication, branch protection, required CI, or merging remains blocked after
  three meaningful attempts;
- review cannot be satisfied without expanding the approved unit;
- the working tree contains unexplained changes;
- completing the unit would require V0.5-V2 work or speculative infrastructure.

When the authorized tranche is merged, report issue links, branches, commits, pull
requests, merge commits, validation evidence, and the next ledger state, then stop.
