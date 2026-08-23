# Clear the Stack V0 loop contract

Apply this contract once for each `ready` work unit selected from
`docs/v0-execution-plan.md`.

## 1. Establish a clean unit

1. Fetch `origin` and verify the previous unit is merged.
2. Begin from a clean, current `origin/main` in a fresh branch named with the `codex/`
   prefix and the ledger's suggested branch slug.
3. Confirm the base commit, branch, and clean status in the progress log.
4. Create a GitHub issue containing the ledger scope, acceptance criteria, exclusions,
   authoritative-source requirements, and validation requirements. Do not broaden the
   ledger entry while translating it into an issue.

## 2. Implement only the issue

- Preserve stable Oracle UUIDs as enrichment join keys and stable slugs as route keys.
- Keep generated catalog data separate from handwritten enrichment.
- Keep external card images remote and optional; never add them to the repository,
  build output, or service-worker precache.
- Use current official Magic sources for published rules outcomes. Community material
  may identify questions but cannot establish an outcome.
- Before authoring verified content, record the check date, current Comprehensive Rules
  version and effective date, exact locator IDs used, and the current Oracle-text check
  in the issue progress log and review evidence. If the generated catalog is stale or
  conflicts with current Oracle text, stop unless refreshing it is explicitly in scope.
- Record review dates for newly verified scenarios.
- Apply `vercel-react-best-practices` whenever React code is written or changed.
- Do not introduce deferred TanStack packages without a concrete requirement in the
  selected unit.
- Do not include branding, deployment, analytics, backend, or post-V0 work unless the
  selected unit explicitly requires it.

If implementation reveals a necessary scope expansion, stop instead of silently adding
it.

## 3. Validate before review

Run validation proportional to the issue, including at minimum:

- focused tests for changed behavior and source integrity;
- all tests;
- TypeScript checking;
- production build and prerender count;
- complete `npm run check`;
- `git diff --check`;
- working-tree inspection.

For player-facing behavior, use `agent-browser` at a mobile viewport and cover the
changed happy path, relevant source disclosure, and applicable error or fallback state.
Browser output is evidence, not a substitute for content and rules review.

## 4. Obtain independent review

Start a fresh reviewer agent after implementation and validation are complete. Provide:

- the GitHub issue and selected ledger unit;
- authoritative repository documents;
- exact files changed and full diff;
- handwritten-versus-generated distinction;
- source-verification reasoning;
- validation and browser evidence;
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
2. Update the ledger in the same diff so the current unit becomes `complete` and its
   immediate dependent becomes `ready`. Do not promote unrelated units. The ledger
   change itself must be included in the final reviewed diff.
3. Obtain a final reviewer confirmation if the ledger update occurred after the last
   review.
4. Create one descriptive commit that links the issue.
5. Push only the task branch and open a pull request against `main`.
6. Confirm the pushed commit exactly matches the approved commit. Any later change
   invalidates approval and requires another review.
7. Wait for the repository's `Validate / npm run check` pull-request check and every
   other required CI check. Do not weaken, skip, or administratively bypass a check. If
   the validation workflow does not run, treat that as a blocker rather than as a pass.
8. Immediately before merging, fetch a fresh remote PR snapshot and verify that its head
   SHA is still the exact reviewed commit and that the successful checks belong to that
   SHA. Also verify the base SHA has not advanced since validation. If the head changed,
   approval is invalid. If the base advanced and repository settings do not guarantee an
   up-to-date tested branch, update from current `main`, rerun validation, and obtain a
   new review before merging.
9. Merge using a repository-supported method only when review is approved, required CI
   passes for the reviewed SHA, the PR is mergeable, and no post-approval changes exist.
10. Verify the merge on `origin/main` and close the linked issue if the merge did not do
   so automatically.

## 6. Continue or stop

After a verified merge, discard the completed task branch as a work surface and inspect
the ledger on fresh `origin/main`.

- If the next `ready` unit belongs to the authorized tranche, repeat this contract.
- If the tranche is complete, report results and stop.
- If no eligible unit is ready, report the ledger state and stop.

Keep a concise progress log throughout the goal. Do not claim a unit is complete until
its pull request is merged and visible on `origin/main`.
