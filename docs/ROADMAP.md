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

## 3. Usability and accessibility

- Label icon controls and announce progress and feedback.
- Review touch targets, responsive layouts and answer interactions.
- Add keyboard/tap alternatives to drag-only interactions.
- Explain device-local storage and lack of account synchronization.

## 4. Security and regression coverage

- Audit dependency/platform advisories and review plugin upgrades.
- Remove unnecessary permissions and inline handlers; tighten CSP.
- Test question generation, scoring, persistence, resets and worksheets.
- Add browser lesson-completion coverage.

The initial static security review found no confirmed exploitable
vulnerabilities. Dependency, native platform and runtime checks remain pending;
this is not a guarantee against attacks.

## 5. Deployment

- Package browser assets in a private GHCR image.
- Extract releases into host Nginx's static directory.
- Add a dedicated OIDC role and fixed SSM deployment command.
- Reuse the server-wide deployment lock and verify releases.
- Test public routing and isolation from sibling demo storage.
- Preserve Cordova builds separately; do not claim native verification without
  building and testing on the target platforms.
