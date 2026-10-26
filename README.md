# Sanjay Panwar - Developer Portfolio

A portfolio for a final-year B.Tech CSE (AI) student and full stack developer. The interface follows the user's reference: a narrow, near-black layout, serif headings, restrained borders, a real portrait, and compact project cards. A light theme is available. On mobile, five labelled icon tabs sit in a rounded bottom bar that follows the active theme, with the current page highlighted blue.

The application uses local typed content. Browsing projects, downloading the resume, and making contact require no backend or API credentials.

## Run locally

Use Node.js 22.12 or newer and npm. From the repository root:

```bash
npm install
npm ci --prefix client
npm run dev
```

Open **http://127.0.0.1:5173**.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite client |
| `npm run typecheck` | Check client TypeScript |
| `npm run lint` | Run the configured ESLint checks |
| `npm test` | Run DOM interaction tests |
| `npm run test:server` | Run isolated backend HTTP integration tests |
| `npm run test:all` | Run lint, frontend/backend tests, production build, and browser tests |
| `npm run build` | Type-check and build into `client/dist` |
| `npm run preview` | Serve the production build at port 4173 |
| `npm run test:browser` | Run Playwright; starts/stops production preview automatically |
| `npm run server` | Start the preserved optional Express server in development |
| `npm start` | Start the optional Express server |

For browser review, run `npm run build`, then `npm run test:browser`. Playwright starts the preview at port 4173 and stops it after the run, or reuses an existing preview outside CI. On Windows it uses installed Google Chrome; set `PLAYWRIGHT_CHROME_PATH` for a different executable. Other systems use Playwright's installed Chromium. Screenshots and traces are written to ignored `.qa/`.

To run the complete suite, install the optional server test dependencies once with `npm ci --prefix server`, then run `npm run test:all`. Backend tests use injected fake models and temporary HTTP servers; they do not load `server/.env`, connect to MongoDB, or store real messages/projects.

## Pages and implementation

| Route | Content |
| --- | --- |
| `/` | Introduction, toolkit, current learning, selected projects, and contact |
| `/skills` | Expanded technical toolkit and learning focus |
| `/work` | Four verified project case studies with source links |
| `/experience` | BharatCares, Elevate Labs, and education |
| `/about` | Background, education, and toolkit |

The original React 18.2/Create React App setup was inspected locally and through the connected GitHub plugin before migration to React 19 and Vite 7 with TypeScript. The client uses Tailwind CSS 4, Motion 14, and Lucide React. Peer dependencies resolve without `--force` or `--legacy-peer-deps`. Geist, Geist Mono, and Instrument Serif are bundled locally.

The layouts and components were written for this repository using the user's [visual reference](https://my-portfolio-one-roan-33.vercel.app/). Profile details, experience, and project stories belong to Sanjay. The mobile bottom navigation follows the separately supplied image.

| File | Edit here for |
| --- | --- |
| `client/src/studio/content.ts` | Profile, skills, projects, internship facts, and education |
| `client/src/studio/App.tsx` | Routes, page composition, metadata, and footer |
| `client/src/studio/Navigation.tsx` | Desktop navigation, mobile bottom tabs, clock, and theme toggle |
| `client/src/studio/Hero.tsx` | Portrait, introduction, social links, and resume actions |
| `client/src/studio/SelectedWork.tsx` | Project cards and native case-study disclosures |
| `client/src/studio/Contact.tsx` | Contact form, email draft, and copy feedback |
| `client/src/studio/styles.css` | Responsive layout and dark/light design tokens |
| `client/index.html` | Initial metadata and no-JavaScript contact/resume fallback |
| `server/app.js` | Optional HTTP app, routing, CORS, static hosting, and error responses |
| `server/index.js` | Environment loading, database connection, and production startup |

`src/studio` is the active application. The old CRA UI, unused project preview images, duplicate sample seed scripts, and unused helpers were removed. The requested Interactive study section and its Three.js, React Three Fiber, and Drei dependencies were also removed. The original portrait and editable social-card source are preserved in `docs/assets/`, outside the shipped site; `.qa/` contains local reference and review evidence.

The contact form validates input and opens an addressed email draft in the visitor's email application. It does not claim that a message was sent. Direct email and copy-email actions remain available. No frontend secrets are needed.

## Verified content and assets

Project stories were checked against repository source through the GitHub plugin. No unverified live demos, business metrics, or project screenshots are presented.

| Project | Verified implementation |
| --- | --- |
| [Samadhan-Setu](https://github.com/SanjayPanwar73/Samadhan-Setu) | React/FastAPI grievance workflows, Transformers classification, FAISS retrieval, explainable priority, and staff routing |
| [SearchNest](https://github.com/SanjayPanwar73/SearchNest) | FastAPI, Jinja2, SQLAlchemy, provider adapters, hashed API keys, quotas, and request activity |
| [DietTracker](https://github.com/SanjayPanwar73/DietTracker) | React/Express/MongoDB nutrition logging, JWT-protected records, charts, and external meal-planning services |
| [SnapTrip](https://github.com/SanjayPanwar73/SnapTrip) | Express/EJS listing management, MongoDB sessions, Passport authentication, favorites, reviews, and maps |

SnapTrip uses EJS; booking and payment flows are not claimed. DietTracker's estimator uses food-name text; image recognition is not claimed. Research is in [SearchNest and Samadhan notes](docs/searchnest-samadhan-research.md) and [DietTracker and SnapTrip notes](docs/diettracker-snaptrip-research.md).

The portrait comes from the original repository image. The downloadable resume is the actual updated PDF supplied by the user, including BharatCares (June-July 2026), Elevate Labs (August-September 2025), and Mandsaur University (2023-2027). See [asset provenance](docs/asset-notes.md).

## Static hosting

| Setting | Value |
| --- | --- |
| Root directory | `client` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | None required |

Vercel rewrites in `client/vercel.json` and Netlify's `public/_redirects` support direct navigation and refresh on all five routes. Equivalent hosts need an SPA fallback to `index.html` for page routes while serving public files normally.

Metadata currently uses the existing portfolio origin `https://portfolio-ten-omega-73.vercel.app/`. When changing domains, update `profile.siteUrl` in `content.ts`, the canonical/Open Graph/JSON-LD URLs in `client/index.html`, and `public/robots.txt` and `public/sitemap.xml`.

The preserved Express server can also host `client/dist`: install its dependencies with `npm ci --prefix server`, build the client, and run `npm start`. It defaults to port 5000. Optional API configuration is documented in `server/.env.example`; MongoDB is needed only for those APIs. The portfolio makes no API requests.

`GET /api/projects` is public. Project creation is an admin operation: set a private `PROJECT_ADMIN_TOKEN` on the server and send it as `Authorization: Bearer <token>` for `POST /api/projects`. Writes are disabled when no token is configured. Never place that token in frontend code. The contact API validates and stores messages when MongoDB is connected; the website itself uses email drafts instead.

See [verification notes](docs/verification.md) for checks, screenshot evidence, and scope limits. No deployment, push, merge, or database seed is part of this implementation.
