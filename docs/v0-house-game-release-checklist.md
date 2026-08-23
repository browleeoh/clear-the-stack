# V0 house-game release readiness

Audit date: 2026-08-23

Implementation base: `ce875d9179408e32bcddddef1188eebc7eecc30d` (`origin/main` after V0-47)

Audit work unit: V0-48 / issue #91

This record covers implementation readiness only. It does not claim a deployment, a physical-phone installation, offline testing on a physical phone, or any human house-game session.

## Automated and locally served evidence

- `npm run check` passes type checking, all tests, production client/server builds, and 231 prerendered routes.
- The largest client JavaScript chunk is 474.64 kB uncompressed and 138.23 kB gzip. This is below Vite’s 500 kB warning threshold and down from issue #17’s 538.29 kB / 151.82 kB gzip baseline. No extra split is justified without target-device evidence.
- Lighthouse 13.4.1 mobile simulation on the local production build scored 100 with a representative modern-phone profile (390×844 viewport, 2× CPU slowdown, 40 ms RTT, 10 Mbps down): first contentful paint, largest contentful paint, and interactive were each 484 ms, with 0 ms total blocking time. This meets the two-second first-install search-readiness target with substantial margin.
- A second conservative default Lighthouse mobile run scored 95: first contentful paint 2,255 ms, largest contentful paint 2,405 ms, interactive 2,464 ms, and total blocking time 5.5 ms. This slower-than-target profile is retained as a useful lower-end reference rather than hidden.
- From the loaded 390×844 production page, dispatching a real search input and waiting for the exact Thorin result to render took 2.8 ms, well below the 150 ms local-search target.
- The production manifest has a stable app ID, root scope/start URL, standalone display, theme/background colors, and a scalable any/maskable icon.
- A clean service-worker install—after unregistering workers and clearing CacheStorage—cached the shell, core route documents, shared bundles, content data, card/mechanic route chunks, and scenario chunk.
- With the browser then placed in actual offline mode, direct loads of `/cards/thorin-oakenshield` and `/mechanics/storied` rendered their full bundled guidance.
- Representative 390×844 mobile journeys covered grouped search, exact-title priority, anchored scenarios, recent searches, unanswered save, linked feedback, JSON export, confirmed reset, and offline disclosure. The no-result save action and mobile brand were measured at 44 px high; suggestions were 44 px and bottom navigation targets 55 px.
- Semantic browser snapshots expose one H1 per page, grouped result regions with headings, labelled navigation, pressed-state feedback buttons, live status messages, and collapsed source controls. Keyboard focus is visibly outlined, reduced-motion preferences disable smooth scrolling/transitions, zoom is not restricted, and primary mobile controls have a 44 px minimum target.
- Official sources remain one-tap links. Meaning is not conveyed by color alone: labels, text, icons/initials, borders, `aria-pressed`, and status copy carry state.

## Release operator checklist — still pending

- [ ] Select and authorize a hosting provider.
- [ ] Deploy the reviewed `origin/main` revision over HTTPS and record its exact commit.
- [ ] Install that revision on each target physical phone from the browser’s install flow.
- [ ] Verify launch, text sizing/zoom, safe areas, touch targets, card-text fallback, and offline Thorin/Storied journeys on each phone.
- [ ] Run three real house-game sessions under the product test plan without prompting normal use.
- [ ] Export and review the local logs after those sessions.
- [ ] Route any corrections through new sourced, reviewed work units before making a V0 decision.

The deployment and human-validation gates remain blocked until the user performs or separately authorizes them.
