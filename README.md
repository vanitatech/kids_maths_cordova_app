# Kids Cordova Maths App

**Live browser demo:** [Maths Kids](https://vanitatech.co.uk/demos/kids-maths/).

A mobile-first mathematics learning application for young children, built with Apache Cordova and vanilla JavaScript. The app helps children build confidence with core numeracy skills such as counting, addition, subtraction, and worksheet practice, while tracking progress across lessons and unlocking mascots as they advance.

This project is designed to showcase practical front-end development skills, data-driven UX, and cross-platform mobile app structure in a portfolio-friendly format.

## Project overview

Improvement and deployment plan: [docs/ROADMAP.md](docs/ROADMAP.md).
Browser release and AWS setup guide: [deploy/README.md](deploy/README.md).
The app now initializes in ordinary browsers as well as Cordova. Serve `www/`
over HTTP(S), including under a trailing-slash subdirectory; do not open the
HTML directly with `file://` for browser testing. Browser worksheets use
relative bundled PDF downloads; native builds retain the file plugins.
Startup storage errors are shown without automatically resetting progress.
Progress stays on this device/browser and is not account-synced. Reset affects
only Maths Kids' database and known storage keys, not other demos. The parental
reset prompt requires acknowledgement and a correct challenge answer.
Lesson activities, number choices and mascots support keyboard activation as
well as taps. Progress and answer feedback include accessible text, and worksheet
completion stars are awarded once even if the PDF is downloaded again.
Run `npm test` for startup, seeding, progress, question-generation and security
regression checks. `npm run test:browser` exercises lesson completion, keyboard
interaction, scoring, persistence, reset and CSP enforcement in Chromium.
Native platform builds still require separate device/emulator verification.

## Browser hardening and dependency status

Inline event handlers and global controller exports have been replaced with
module-bound actions. Pending actions cannot overlap, and failures are logged
and displayed rather than reported as success. CSP blocks inline scripts,
`eval`, remote media and embedded objects. It allows bundled styles/fonts/images
and existing image-only CSS data URLs. A narrow Android TalkBack script path
and the legacy iOS `gap:` frame bridge remain for Cordova compatibility.
The offline app no longer declares wildcard network access or external URL
intents. These restrictions do not remove native plugin permissions.

The browser ships pinned Dexie 3.2.7. Its vendored file is generated from npm
without stripping upstream license notices; `npm run check:vendor` checks the
bytes match. When changing Dexie, run `npm run vendor:dexie` and commit both
dependency files and the generated runtime.

On 2026-10-08, `npm audit --omit=dev` reported no production dependency
advisories. The full audit still reports **9 Cordova-tooling findings
(7 high, 2 moderate)**, including the browser platform's shared build tooling.
Native platform/plugin major upgrades were explicitly deferred; Android/iOS
builds are not verified or ready to certify for distribution. Do not use
`npm audit fix --force`: its current suggestions include platform downgrades.
An npm advisory count is not a runtime exploit assessment or a guarantee of
security. Apps sharing an origin can still access each other's browser storage.

The Maths App is an educational game-style app where learners:

- progress through a series of maths lessons
- complete activities based on counting, addition, and subtraction
- practice with worksheet activities
- earn points and unlock mascots
- revisit previous lessons and monitor learning progress

The application uses a local database to store lesson content, activity definitions, and user progress so the learning experience feels persistent and personalized.

## Why I built this project

This project was created to explore:

- mobile app development with Apache Cordova
- front-end logic for interactive educational experiences
- local persistence and data seeding for app content
- user progression systems and gamified engagement
- building a full-featured product experience with a simple but scalable architecture

It is a strong example of a full-stack-like front-end project where product thinking, UI behavior, and data modeling all work together.

## Features

- Multi-lesson maths progression system
- Activity types including counting, addition, subtraction, and worksheets
- Progress tracking for completed lessons and current learning state
- Point system for engagement and reward feedback
- Mascot unlock and selection system
- Local database seeding for curriculum content
- Cross-platform packaging via Cordova
- Lightweight, dependency-based front-end architecture using ES modules

## Tech stack

- JavaScript (ES modules)
- Apache Cordova
- Dexie.js for IndexedDB access
- HTML/CSS for the mobile UI
- Local asset-based content structure

## Architecture

The app follows a lightweight MVC-style structure:

- Models manage data access and state
- Views render UI updates
- Controllers coordinate app logic and user flows
- Database seeding populates lessons and activities on first run

This keeps the project easy to navigate while showing modular design patterns and separation of responsibilities.

## Project structure

```text
.
├── config.xml
├── package.json
├── www/
│   ├── css/
│   ├── data/
│   ├── img/
│   ├── js/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── models/
│   │   ├── services/
│   │   ├── views/
│   │   └── index.js
│   └── index.html
├── typings/
└── README.md
```

## How it works

On app startup, the application:

1. starts in the browser, or waits for Cordova device readiness on native platforms
2. seeds the local database if it is empty
3. loads the current lesson and related activities
4. shows user progress and points
5. renders the active mascot and lesson content
6. lets the learner interact with the activity flow

This makes the app feel dynamic while maintaining a simple data model for educational content.

## Getting started

### Prerequisites

- Node.js 22 and npm for the test tooling
- Apache Cordova CLI
- Android/iOS/browser platform tooling if you want to run on device/emulator

### Installation

```bash
npm ci --ignore-scripts
npm run check:vendor
npm test
```

### Browser preview and regression tests

```bash
node tools/serve.mjs
```

Open `http://127.0.0.1:8769/demos/kids-maths/`. This loopback-only preview
server is for development/tests, not production hosting. Stop it before running
the browser suite, which starts its own server on that port.

```bash
npx playwright install --only-shell chromium
npm run test:browser
```

On a Linux machine missing browser libraries, use
`npx playwright install --with-deps --only-shell chromium`. CI runs unit/browser
checks, the vendored-file check and the production dependency audit before
publishing a SHA-tagged browser image on main. AWS deployment is gated by
`MATHS_DEPLOY_ENABLED=true` after the setup guide is complete. CI does not build
native apps. Browser tests intercept worksheet click
requests and verify the PDF is served; they do not verify a saved download.

### Build a browser release

```bash
RELEASE_SHA=$(git rev-parse HEAD) npm run build:browser
MATHS_PREVIEW_ROOT=dist/site npm run test:browser
```

The builder requires a new output directory (`dist/site` by default); remove
only that generated directory before rebuilding, or pass a different output
directory with `npm run build:browser -- /absolute/path/to/new-site`.
Release output has no Cordova runtime request and includes a SHA-256 inventory.
The source remains suitable for separate Cordova builds.

### Build for a platform

Native migration is pending. Retained platform versions need their own
compatible SDK/JDK/Xcode setup and device testing; the browser CI is not
evidence that these native builds work.

```bash
npx cordova build android
```

or

```bash
npx cordova build ios
```

## Current status

This project is a working prototype / learning-focused application demonstrating a complete educational app flow. It is a strong portfolio project for software engineering roles, particularly for:

- front-end development
- mobile app development
- user experience design in product settings
- data-driven application logic
- practical JavaScript architecture

## Strengths for a portfolio

- demonstrates product thinking and user-centered design
- shows real-world application flow beyond basic CRUD
- includes gamification and learning progression patterns
- uses an actual local database and persistent state
- reflects cross-platform mobile app development experience

## Potential improvements

This project could be extended with:

- a more advanced analytics dashboard
- audio feedback and sound effects
- accessibility improvements for children
- drag-and-drop activities
- teacher/parent progress export
- stronger error handling and validation
- complete server setup and verify automated AWS deployment

## License

This project is licensed under the Apache License 2.0.

## Author

Vanita Applebee