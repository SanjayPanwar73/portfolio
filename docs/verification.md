# Portfolio verification

Verified on 25 October 2026, branch `redesign/engineering-studio`. No commit, push, merge, deployment, or database seed was performed.

## Completed checks

| Check | Result |
| --- | --- |
| `npm run test:all` | Passed: lint, 17 frontend tests, 23 backend tests, build and 13 browser tests |
| `npm run build` | Passed: TypeScript and Vite production output |
| `npm run lint` | Passed without errors or warnings |
| `npm test` | 17 DOM interaction tests passed |
| `npm run test:server` | 23 isolated HTTP integration tests passed |
| `npm run test:browser` | 13 isolated Chrome browser tests passed; no page/console errors or failed local resources |
| `npm audit --prefix client` and `--prefix server` | Zero reported vulnerabilities after compatible backend fixes |
| `npm ls --prefix client --depth=0` and `--prefix server` | Resolved dependency trees, no invalid packages |
| `git diff --check` | Passed |
| Resume | Real PDF downloaded; expected filename, signature and 651,848-byte size; source/public SHA-256 matched |

## Issues found and fixed

- SPA navigation now moves keyboard focus to the destination heading or anchor. The skip link has a focusable main target. Modified clicks, downloads, named windows, and protocol-relative destinations retain native browser behavior.
- Detailed project and embedded toolkit headings now use the correct hierarchy without changing their approved appearance. Tailwind's badge uses the correct icon rather than matching the letters `ai` inside its name.
- Invalid trimmed contact input focuses its first affected field, exposes accessible error associations, and enforces the email length limit. Saved light mode also initializes the browser theme-color correctly before painting.
- Backend malformed JSON, oversized bodies, unsupported encodings and rejected origins now return 400, 413, 415 and 403 respectively. Missing assets/API URLs retain 404 instead of receiving SPA HTML.
- Backend text types and schema lengths are validated; only validated fields reach models, and persistence failures do not expose raw database errors.
- Project creation now requires a server-configured bearer token and is disabled when none is configured. Public reads remain available. Tests verify rejection and authorized success using fake models.
- The backend lockfile had six affected packages. A compatible `npm audit fix --ignore-scripts` updated nine installed packages without force or major-version bypasses; the final online audits report zero advisories for both client and server.

Playwright now starts/stops its production preview automatically. The root `npm run test:all` command runs the maintained checks together. Node engine declarations now agree on Node 22.12 or newer; this run used Node 24.19.0.

## Backend coverage

The HTTP app is separated from production environment/database startup. Tests inject model and database dependencies, bind temporary localhost ports, and close every server. Coverage includes health state, CORS/preflight, malformed/oversized/encoded requests, static files and page deep links, API/file 404s, missing builds, malformed URLs, input types/lengths, unavailable databases, authorized writes, successful reads/saves, ignored extra fields and persistence failures. Static fixtures are created only in a checked temporary directory and removed afterward.

The tests do not load or modify `server/.env`, connect to MongoDB, or write actual messages/projects.

## Cleanup

The active Vite entry and import graph were checked before removal. Deleted 29 unmodified, version-controlled legacy runtime files: old CRA entry/components/styles/content/API helpers, three unused project-preview JPEGs, and two unused sample-data seed scripts. The seed scripts were not executed.

The user also requested removal of Interactive study. Its two components, exclusive hook, unused icon helper, CSS, and obsolete tests were removed. Uninstalling Three.js, React Three Fiber, Drei and Three.js types removed 53 packages including unused transitive dependencies. Motion remains used by project cards. Project descriptions/categories now come from shared content rather than duplicate component data.

The original portrait and editable social-card SVG are preserved in `docs/assets/`. Only the optimized portrait WebP and sharing PNG remain in public image assets. The optional functioning backend remains intact. Reference evidence in ignored `.qa/` is retained outside production output.

Automatic approval review rejected the original broad deletion of reference history and source assets because it could discard useful design evidence. Cleanup proceeded with the narrower audited runtime file list, while source images were preserved by moving them outside runtime folders.

## Browser coverage

An isolated Chrome profile checks the production preview at `127.0.0.1:4173`, without personal browser sessions.

- Layouts at 320, 375, 640, 641, 768 and 1440 pixels, including both sides of the mobile navigation breakpoint.
- Navigation across all five pages, direct URL reloads, document titles/canonical/Open Graph metadata, and unknown-page recovery.
- Portrait loading, actual resume download, four native project disclosures, and truthful source links.
- No horizontal overflow on the page routes or with project details expanded.
- Mobile bottom tabs: five labels, active-page state, keyboard Tab/Enter, browser Back, viewport fit, and footer controls clear of the bar.
- Persisted light/dark theme, including a dark mobile dock on the dark background. CSS assertions wait for the transition to complete.
- Contact input validation and email-draft encoding are covered by DOM tests. Actual clipboard content and success feedback are checked in Chrome; DOM tests also cover denied access.
- Browser-native required/email/length constraints, safe valid-submit behavior in DOM tests, modified links opening a new tab, skip-link focus, and reduced-motion project cards.
- Actual image signatures/dimensions, favicon, robots, sitemap and structured profile data. No external email application was launched.
- The removed quote and Interactive study sections are absent from the active source. No WebGL runtime remains.

Current captures in ignored `.qa/` are `matched-hero-1440.png`, `matched-hero-768.png`, `matched-hero-375.png`, corresponding `matched-full-*` images, `matched-about-1440.png`, `matched-light-1440.png`, `mobile-dock-375.png`, `matched-mobile-contact.png`, and `matched-mobile-footer-320.png`. Older reference/review captures are retained as history.

## Performance and limits

The production JavaScript entry is approximately 128 kB gzip. The former 888 kB uncompressed Three.js scene chunk is no longer emitted, and the build has no large-chunk warning. No Lighthouse score or real-user performance claim is made.

Keyboard use, focus indication, landmarks, portrait alt text, active-page semantics, and contact feedback were checked. This is not a formal accessibility certification. An external email application's `mailto:` handling depends on the visitor's configuration; the site does not claim message delivery.

Project stories were verified against source through the connected GitHub plugin. Those four separate applications were not runtime-tested or deployed as part of this work. The optional portfolio HTTP API was integration-tested with fake models; live MongoDB persistence and real email delivery remain untested. The portfolio uses local content and email drafts and does not depend on those APIs.
