# Clear the Stack V0.1 field-guidance loop contract

Apply this contract once for each `ready` work unit selected from
`docs/v0.1-execution-plan.md`.

## 1. Establish a clean unit

1. Fetch `origin` and verify the previous unit is merged.
2. Begin from a clean, current `origin/main` in a fresh branch named with the `codex/`
   prefix and the ledger's suggested branch slug.
3. Confirm the base commit, branch, and clean status in the progress log.
4. Create a GitHub issue containing the exact ledger scope, acceptance criteria,
   exclusions, source requirements, and validation requirements. Do not broaden the
   ledger entry while translating it into an issue.

## 2. Implement only the issue

- Preserve stable Oracle UUIDs as enrichment join keys and stable slugs as route keys.
- Keep generated catalog data separate from handwritten enrichment.
- Keep external card images remote and optional; never add them to the repository,
  build output, or service-worker precache.
- Before authoring verified content, record the check date, current Comprehensive Rules
  version and effective date, exact locator IDs used, current Oracle-text check, and
  the required Hobbit Release Notes absence check in the issue progress log and review
  evidence. If the generated catalog is stale or conflicts with current Oracle text,
  stop unless refreshing it is explicitly in scope.
- Use current official Magic sources for published outcomes. Community material may
  identify questions but cannot establish an outcome. Record review dates for newly
  verified scenarios.
- Treat current CR 510.1 as authoritative; never reintroduce obsolete damage-assignment
  order or lethal-before-next-blocker teaching.
- Preserve exact-title and short partial-card-name ranking. For explanatory queries,
  concepts may outrank incidental Oracle-text matches.
- Apply `vercel-react-best-practices` whenever React code is written or changed. Do not
  introduce deferred TanStack packages without a concrete requirement in the selected
  unit.
- Do not add a rules engine, AI answers, database, backend, multi-set architecture,
  analytics, image/audio search, unrelated card curation, deployment, branding, or
  post-milestone work.

If implementation reveals a necessary scope expansion, stop instead of silently adding
it.

## 3. Validate before review

Run validation proportional to the issue, including at minimum:

- focused tests for changed behavior and source integrity;
- all tests;
- TypeScript checking;
- production build and prerender count;
- complete `npm run check`;
- `git diff --check`; and
- working-tree inspection.

For player-facing behavior, use `agent-browser` at a mobile viewport and cover the
changed happy path, relevant source disclosure, and applicable error or fallback state.
Browser output is evidence, not a substitute for content and rules review.

## 4. Obtain independent review

Start a fresh reviewer agent after implementation and validation are complete. Provide:

- the GitHub issue and selected ledger unit;
- authoritative repository documents and the approved ledger;
- exact files changed and full diff;
- handwritten-versus-generated distinction;
- source-verification reasoning, including source version and Oracle freshness;
- validation and browser evidence; and
- current status and confirmation that nothing is committed or pushed.

The reviewer must check actual evidence and return either `approved` or concrete,
prioritized findings. Treat passing tests as necessary but not sufficient.

For each finding:

1. Return to the implementation role.
2. Apply only the smallest correction that resolves it.
3. Rerun focused and full validation.
4. Submit the new exact diff to a fresh review pass.

Do not commit while findings remain.

## 5. Ship the approved exact diff

After approval:

1. Confirm the working tree contains only reviewed files and `git diff --check` still
   passes.
2. Update the ledger in the same diff: mark the merged unit `complete` and promote only
   its immediate successor to `ready`. After FG-03, mark FG-03 `complete` and FG-04
   `blocked` with the mandatory validation-gate reason; do not promote FG-04.
3. Obtain final reviewer confirmation if the ledger update occurred after the last
   review.
4. Create one descriptive commit that links the issue.
5. Push only the task branch and open a pull request against `main`.
6. Confirm the pushed commit exactly matches the approved commit. Any later change
   invalidates approval and requires another review.
7. Wait for the repository's `Validate / npm run check` pull-request check and every
   other required CI check. A missing or skipped validation run is a blocker.
8. Immediately before merging, fetch a fresh remote PR snapshot and verify that its
   head SHA is still the exact reviewed commit, successful checks belong to that SHA,
   and the base SHA has not advanced without a repository guarantee of up-to-date
   testing. If it has, update from current `main`, rerun validation, and obtain a new
   review before merging.
9. Merge using a repository-supported method only when review is approved, required CI
   passes for the reviewed SHA, the PR is mergeable, and no post-approval changes exist.
10. Verify the merge on `origin/main` and close the linked issue if the merge did not do
    so automatically.

## 6. Continue or stop

After a verified merge, discard the completed task branch as a work surface and inspect
the ledger on fresh `origin/main`.

- Continue only with the first `ready` unit inside the expressly authorized boundary.
- After FG-03, stop for deployed real-device and house-game validation; continue only
  after explicit user approval changes FG-04 to `ready`.
- If no eligible unit is ready, report the ledger state and stop.

Keep a concise progress log throughout the goal. Do not claim a unit is complete until
its pull request is merged and visible on `origin/main`.
