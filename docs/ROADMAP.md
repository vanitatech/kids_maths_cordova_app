# Maths Kids improvement and deployment plan

Target: a public browser demo at `/demos/kids-maths/` on the existing EC2
server, preserving Cordova mobile support and the current curriculum.

## 1. Reliable browser deployment (implemented; native verification pending)

- Start in an ordinary browser as well as on Cordova device readiness.
- Await database inserts and stop initialization on errors.
- Display actionable startup errors rather than an endless spinner.
- Download bundled worksheets in browsers without Cordova plugins.
- Add focused regression tests and verify the mounted browser experience.

Verification: six automated startup/seeding/path tests pass. A mounted browser
preview at `/demos/kids-maths/` rendered Lesson 1 and all four activity types.
The worksheet controller produced the correct mounted PDF URL and filename;
actual browser download completion was not confirmed by the browser tooling.
Simulated unavailable IndexedDB displayed the startup alert and hid the spinner.
Native download and device builds remain unverified. Ordinary web hosting
currently returns a harmless 404 for the optional `cordova.js` runtime; browser
release packaging should remove that script tag, not ship a fake Cordova runtime.

## 2. Safe local progress (implemented; verification below)

- Replace broad localStorage clearing with app-specific reset.
- Validate stored progress and improve parental reset confirmation.
- Preserve existing progress where possible; document any migrations.

Retains existing key names and database name; no migration or silent reset.
Startup validates numeric progress, lesson/mascot/activity references and
reward totals. Invalid data is reported through the startup error panel.
Reset deletes only the known `userProgress.*` and `dailyTarget.*` fields,
not arbitrary prefixes or other apps' keys. The dialog explains data loss,
requires explicit acknowledgement and the parent maths challenge, and includes
keyboard focus containment and Escape cancellation.
Storage isolation prevents accidental clearing, not same-origin security
isolation between apps. Browser privacy settings and clearing site data can
still remove device-local progress.

Verification: all 11 startup/progress tests pass. Mounted browser checks
confirmed reset returns to Lesson 1 with zero points while preserving a sibling
store key. The acknowledgement guard, focus containment, Escape cancellation
and focus restoration work at a 390px viewport without horizontal overflow.
An invalid saved lesson ID shows the startup error and is not silently erased.
Native WebView keyboard/focus behavior remains unverified.

## 3. Usability and accessibility (implemented; native/accessibility audit pending)

- Label icon controls and announce progress and feedback.
- Review touch targets, responsive layouts and answer interactions.
- Add keyboard/tap alternatives to drag-only interactions.
- Explain device-local storage and lack of account synchronization.

Lessons, answer cards and mascot choices now use native buttons with accessible
names, keyboard activation and visible focus. Progress has accessible values;
answer feedback includes live text rather than relying on faces/colours alone.
Activity controls retain the existing tap interaction and add keyboard support
(the reviewed implementation did not require drag-and-drop).
Activity colours were darkened for white text contrast, and device-local
progress is explained. Worksheet re-download remains available and no longer
awards the same completion bonus repeatedly.

Verification: all 14 tests pass. Browser keyboard checks completed all five
counting questions, awarded five stars and returned focus to lessons.
Addition slot selection/checking and subtraction retry/advance were exercised.
Locked mascots announce the required and available stars. Intercepted browser
download requests used the mounted worksheet URL; two requests awarded only
one five-star bonus, and reload preserved the total. Actual PDF download
completion and the native download plugin were not verified. No horizontal overflow
was observed at 390px and 320px widths. These checks are not a full WCAG audit;
screen-reader and native mobile verification remain pending.

## 4. Browser hardening and regression coverage (implemented; native migration deferred)

- Audit dependency/platform advisories and review plugin upgrades.
- Remove unnecessary permissions and inline handlers; tighten CSP.
- Test question generation, scoring, persistence, resets and worksheets.
- Add browser lesson-completion coverage.

Inline handlers and controller globals were removed in favour of delegated,
allowlisted module actions. Pending actions are serialized to avoid duplicate
requests, with explicit logged/live errors. CSP no longer permits inline
scripts/styles, eval, arbitrary network/media sources or embedded objects.
Bundled fonts and CSS image data URLs remain allowed; the documented narrow
Android TalkBack script path and legacy iOS gap frame bridge were retained.
The app declares no remote network/URL-intent permissions. Saved object-image
names must match the bundled allowlist before rendering.

Dexie was pinned and the shipped runtime updated from 3.2.4 to 3.2.7 with a
repeatable vendor/check command retaining upstream license notices.
Cordova browser tooling was updated to 7.0.0 and non-breaking dependency
fixes applied. The user chose to defer Android/iOS/platform-plugin migration.
Their direct installed versions remain unchanged. The full npm audit on
2026-10-08 decreased from 24 findings (including one critical) to 9
(7 high, 2 moderate). Remaining chains are braces/micromatch/fast-glob through
Cordova common/platform tooling and uuid/xcode through iOS tooling.
The production-only audit reports zero findings. No native build or plugin
execution was verified. The suggested forced audit fixes include downgrades
and were deliberately not applied.

Curriculum regression tests exposed subtraction questions below zero.
With user approval, the generated minuend now starts at the subtrahend when
needed, so answers are non-negative and match the object-counting interface.
Existing saved progress and database schema are preserved.

Verification: 23 Node tests pass, including all bundled counting/addition/
subtraction definitions, action serialization/error reporting, CSP structure
and unsafe image rejection. Four Chromium tests pass under the mounted path:
keyboard completion of all three activities, worksheet request/re-request
(20 total stars without duplicate bonus), reload/advance to Lesson 2,
wrong-answer retry/advance, mascot cost feedback, reset preserving sibling
storage, invalid saved-image errors and blocked inline-script execution.
Normal interactions produce no CSP violations; 390px layout has no horizontal
overflow. Worksheet clicks are intercepted and PDF serving checked, not actual
download completion. CI now runs these checks without deploying.

The initial static review found no confirmed exploitable vulnerabilities;
the dependency audit is not a runtime exploit assessment. Outstanding native
migration, native CSP/plugin verification, screen-reader testing, and
same-origin isolation remain separate work. This is not a guarantee against
attacks or clearance of every development-tool advisory.

## 5. Deployment (repository prepared; live setup and verification pending)

- Package browser assets in a private GHCR image.
- Extract releases into host Nginx's static directory.
- Add a dedicated OIDC role and fixed SSM deployment command.
- Reuse the server-wide deployment lock and verify releases.
- Test public routing and isolation from sibling demo storage.
- Preserve Cordova builds separately; do not claim native verification without
  building and testing on the target platforms.

Browser-only packaging strips the native runtime tag/bridge CSP allowances
without modifying Cordova source. Releases include the source SHA and a strict
SHA-256 file inventory. The delivery image is extracted from a stopped container,
never executed. The root script validates the full release before atomically
switching the current symlink, retains old releases and records the previous
target. Origin HTTPS checks compare served HTML/JS/CSS/Dexie/PDF/marker bytes.
The user chose to retain the short public URL; no-store headers reduce stale
caching, but already-open pages may need reloading after an update.

A scoped CloudFormation template creates the dedicated GitHub role and fixed
SSM document using the verified repository ID. CI publishes main-branch images
after testing, with AWS deployment gated by MATHS_DEPLOY_ENABLED until server
installation, manual release and infrastructure setup pass.
See [the deployment guide](../deploy/README.md) for the staged setup.

Verification: 30 unit tests and five Chromium tests pass against built browser
assets, including full lesson completion, persistence, reset, CSP and no Cordova
request. Release tests cover file inventory/hash tampering, symlinks, traversal,
invalid SHAs, IAM/document restrictions and SSM success/failure reporting.
All shell scripts pass syntax checks.
Local Docker daemon access is denied, so image building remains for CI.
Nginx/CloudFormation/live AWS/OIDC/SSM checks are not yet performed.
No server/AWS changes, live demo claim or native release certification was made.
