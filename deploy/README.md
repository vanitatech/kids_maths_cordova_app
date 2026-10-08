# Maths Kids deployment

Public target: `https://vanitatech.co.uk/demos/kids-maths/`.
This guide prepares a new static route on the existing EC2 server; it does not
replace the portfolio, store or password-protected Hindi routes.

## What is ready and what is not

The repository provides browser packaging, test/image/deploy CI, root-installed
release scripts, an Nginx location snippet, and a CloudFormation template for
the restricted GitHub role and SSM command. These are not yet installed on AWS.
Local release and browser tests pass. Docker image building, Nginx configuration,
CloudFormation validation and the actual OIDC/SSM deployment still require
verification in CI/on the server. Native builds are not part of this deployment.

The user chose to keep the short URL throughout, rather than versioned public
URLs. The current release symlink changes atomically, and responses use
`Cache-Control: no-store`. An already-open page can still mix assets across an
update; reload after deployments, especially if a lesson behaves unexpectedly.
This does not erase IndexedDB/localStorage, but unfinished questions may need
to be restarted. Do not configure a CDN cache override for this route.

## 1. Publish a tested image

Push the reviewed local commits to `main` when ready. CI runs unit tests,
the production dependency audit and vendored-file check. It builds a browser
release and runs the Chromium suite against that output before packaging.
Main runs publish:

```text
ghcr.io/vanitatech/kids_maths_cordova_app:FULL_COMMIT_SHA
```

Pull requests do not publish or deploy. The image is a scratch delivery package,
not a running service. Source Cordova files stay unchanged; browser packaging
removes the native runtime tag/bridge exceptions and adds the source SHA and
SHA-256 asset manifest.

After the first image publication, use GitHub Packages settings to verify
**Private** visibility and repository access. Publishing CI does not enforce
package visibility. The server's existing root registry login must have read
access to this new package; do not put registry credentials in this repository
or share them in chat.

## 2. Install server scripts

On the existing Ubuntu server, use your normal SSH/Instance Connect session.
Copy these reviewed files from this checkout into a temporary directory on
the server (for example `/home/ubuntu/kids-maths-deploy/`):

- `deploy-kids-maths.sh`
- `verify-release.sh`
- `nginx-kids-maths.conf`

Then install:

```bash
sudo install -d -o root -g root -m 755 /var/www/kids-maths
sudo install -d -o root -g root -m 755 /var/www/kids-maths/releases
sudo install -o root -g root -m 755 \
  /home/ubuntu/kids-maths-deploy/deploy-kids-maths.sh \
  /usr/local/sbin/deploy-kids-maths
sudo install -o root -g root -m 755 \
  /home/ubuntu/kids-maths-deploy/verify-release.sh \
  /usr/local/sbin/verify-kids-maths-release
```

The script uses `/run/lock/vanitatech-deploy.lock` shared by the other apps.
It pulls only the fixed Maths image with a validated 40-character lowercase SHA,
creates a stopped container, and extracts files without running image code.
It rejects symlinks/special files, malformed manifests, unexpected files,
changed hashes and mismatched source SHAs before switching `current`.
Existing releases are retained; a repeated SHA must match its original manifest.

Review/install script changes manually. Normal deployment images cannot replace
these root scripts or edit Nginx.

## 3. Add the Nginx route

Back up the active configuration using the same method as your previous
deployments. Insert the contents of `nginx-kids-maths.conf` **inside the existing
`vanitatech.co.uk` HTTPS server block**, without changing other locations,
certificates or ACME renewal configuration.

This route serves only `/var/www/kids-maths/current/`. There is no SPA fallback,
directory listing or application container/port. It sends CSP, anti-framing,
no-sniff, referrer and cache headers. Explicit headers are included because
Nginx location-level `add_header` directives override inherited headers;
preserve any additional site-wide headers appropriate to this location.
Ensure the existing Nginx `mime.types` include remains enabled for JS/CSS/fonts.

```bash
sudo nginx -t
sudo systemctl reload nginx
```

The Maths path may return 404 before the first release; this is expected.
Verify the portfolio and store still load and Hindi still requires authentication.

## 4. Test a manual release

Use the exact SHA from a successful main-branch image job:

```bash
sudo /usr/local/sbin/deploy-kids-maths FULL_LOWERCASE_COMMIT_SHA
```

The script creates a protected deployment record under
`/var/backups/vanitatech/kids-maths/`, including the prior symlink target.
It compares the served HTML, main JS/CSS, Dexie, PDF and release marker through
local HTTPS Nginx, bypassing Cloudflare, and requires no-store/no-sniff headers.
Any mismatch fails explicitly.
No blind automatic rollback or database reset occurs.

Open the public demo and exercise a full lesson, reload, reset and worksheet
request. Check the response headers in browser devtools:

```bash
curl -I https://vanitatech.co.uk/demos/kids-maths/
curl -I https://vanitatech.co.uk/demos/kids-maths/cordova.js
```

Expect 200 with `Cache-Control: no-store` on the demo, and 404 for `cordova.js`.
Check `/demos/kids-maths` redirects to the trailing-slash URL. If Cloudflare
changes/caches responses, compare with the origin before changing Nginx.
The app uses the same origin and existing browser storage keys; path routing
does not isolate it from other apps' scripts.

## 5. Create AWS resources

Using the administrator identity in the AWS console:

1. Select account `451195512799`, region **Europe (Stockholm) / eu-north-1**.
2. Open CloudFormation, **Create stack - With new resources (standard)**.
3. Upload `deploy/aws-stack.json`.
4. Name the stack `vanitatech-kids-maths-deploy`.
5. Keep `InstanceId=i-019b5c487c103508a`.
6. Review and acknowledge creation of named IAM resources, then create.
7. Wait for `CREATE_COMPLETE`, and inspect the stack outputs.

The template reuses the account's existing GitHub OIDC provider and EC2 SSM
instance role; it creates neither a new instance nor a database. Expected
resources are `github-deploy-kids-maths` and `Vanitatech-DeployKidsMaths`.
Do not create separate resources with those names before creating the stack.

The role permits SendCommand only for this fixed document and instance.
GetCommandInvocation needs `Resource: "*"` because AWS does not support
resource-level permissions for that action. There are no AWS keys stored in
GitHub, general shell-document permissions or administrator rights in this role.

The trust uses the repository ID `637397646` verified through GitHub, and the
ID-qualified subject pattern used by your other deployments:

```text
repo:vanitatech@132825275/kids_maths_cordova_app@637397646:ref:refs/heads/main
```

The first actual OIDC run still needs confirmation. If GitHub's subject differs,
inspect the actual failed subject as before; do not broaden trust to wildcards.
Keep the EC2 SSM agent updated so `ENV_VAR` parameter interpolation is supported.

The workflow intentionally invokes document version `1`. If the command content
changes later, CloudFormation creates a new version; review/test it and update
the workflow's explicit version together rather than silently using `$LATEST`.

## 6. Enable automated deployment

Only after the manual server deployment and CloudFormation setup succeed:

1. In this repository, go to **Settings - Secrets and variables - Actions**.
2. On **Variables**, add repository variable `MATHS_DEPLOY_ENABLED` = `true`.
3. Run **Actions - CI - Run workflow** on `main`.
4. Verify the deploy job's SSM command actually succeeds and the live marker
   `/demos/kids-maths/release.txt` matches that run's source SHA.

The gate lets image publishing/testing work before AWS setup is complete.
Removing the variable or setting it to `false` pauses future deployments.
GitHub serializes Maths deployments; the host lock coordinates all demos.
Canceling GitHub does not cancel an SSM command already sent. On failure/timeout,
inspect Systems Manager and the protected server record before retrying.

## Rollback and storage maintenance

For a reviewed rollback to a previous compatible release, invoke the same
deployment script with that older published SHA. This switches static code
only; it never restores/deletes learner databases. Check compatibility before
rolling back code that changed the local database schema.

Releases and deployment records currently accumulate. Monitor disk space and
plan retention/off-server backups before frequent deployments. Never delete
the active release. No automatic broad cleanup is configured.
