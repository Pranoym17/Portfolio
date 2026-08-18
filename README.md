# Pranoy Mukherjee — Living Workspace Portfolio

> **Resuming work on this project? Read [`docs/START-HERE.md`](docs/START-HERE.md) first.**
> It carries the current verified state, how the system works, every bug already
> found and fixed, what is left, and what is parked for later.

A deploy-ready portfolio template built around a warm editorial visual system, product-grade UI, a reactive WebGL point-cloud portrait, procedural 3D workspace objects, a scroll-driven hero-to-bento handoff, expandable project stories, architecture X-Ray views, a mobile navigation system, and optional server-side contact delivery.

The core requirement is simple: the site must be understandable in seconds even if every decorative interaction is ignored.

## What ships

### Recruiter path
- immediate name / Computer Engineering positioning / value statement
- selected work within the first short scroll
- accessible resume links in hero, navigation and contact
- experience, skills, About and direct contact
- project case-study routes with architecture, challenges and next steps

### Signature experience
- warm charcoal + orange/red editorial/product design system
- serif display + clean UI sans + mono technical labels
- runtime point-cloud portrait based on a replaceable source image
- one React Three Fiber canvas with a laptop, PCB, notebook and coffee object
- subtle pointer-reactive depth/parallax
- GSAP ScrollTrigger hero-to-bento transition
- responsive/static fallback and reduced-motion path

### Product interactions
- expandable project cards with GSAP Flip
- Product / X-Ray project views
- SVG architecture diagrams with moving request packets
- skill-to-project evidence tooltips
- command palette (`Ctrl/Cmd + K`)
- hidden terminal (`~`)
- accessible mobile navigation dialog
- copy-email feedback and optional contact form

### Backend / production
- `GET /api/health` health endpoint
- `POST /api/contact` optional Resend-powered contact endpoint
- input validation, payload limits, same-origin checks, honeypot and best-effort rate limiting
- security response headers
- sitemap, robots, manifest, OG image, favicon and route error boundary
- source/asset audits and deployment smoke-test script
- Playwright browser/API tests

## Intentionally excluded

- statistics/count-up cards
- vanity counters
- Spotify/music
- blog/articles
- mascot
- full game mode
- AI chatbot
- autoplay audio
- skill percentage bars
- fake desktop OS

## Local setup

```bash
npm install
npm run dev
```

The first install generates `package-lock.json`; commit that lockfile before production deployment so CI and Vercel resolve the exact same dependency tree.

Open `http://localhost:3000`.

Playwright browser binaries are a one-time install on a fresh machine:

```bash
npx playwright install
```

## Validation

```bash
npm run audit:static
npm run audit:assets
npm run typecheck
npm run lint
npm run test:e2e
npm run build
```

Or:

```bash
npm test
```

The pre-launch audit is intentionally stricter and will fail while template content remains:

```bash
npm run prelaunch
```

## Contact backend

The site works perfectly without a backend contact form: email, copy-email, GitHub, LinkedIn and Resume remain available. To enable the form, configure all three server-side environment variables:

```env
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Portfolio <portfolio@yourdomain.com>
```

The form is only rendered when all values are available. The API uses Resend's REST endpoint directly, so no extra email package is required.

## Deploy

Recommended: GitHub → Vercel.

Set:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

and the optional contact variables above. After deployment:

```bash
BASE_URL=https://yourdomain.com npm run smoke
```

## Customize first

All portfolio copy is centralized under `src/content/`. See `docs/CUSTOMIZATION.md` for the exact replacement checklist.

## Documentation

- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/FEATURE_MATRIX.md`
- `docs/CUSTOMIZATION.md`
- `docs/QA.md`
- `docs/DEPLOYMENT.md`
- `docs/BACKEND.md`
- `docs/HANDOFF.md`
