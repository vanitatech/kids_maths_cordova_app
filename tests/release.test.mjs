import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, rm, readFile, writeFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildBrowser, releaseFiles } from '../tools/build-browser.mjs';

const sha = 'a'.repeat(40);
const verifier = fileURLToPath(new URL('../deploy/verify-release.sh', import.meta.url));

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'kids-maths-release-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const site = join(directory, 'site');
  await buildBrowser(site, sha);
  return site;
}

function verify(site, expected = sha) {
  return spawnSync('bash', [verifier, site, expected], { encoding: 'utf8' });
}

test('browser release excludes native runtime, preserves assets and verifies every hash', async t => {
  const site = await fixture(t);
  const html = await readFile(join(site, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /cordova\.js|gap:|ssl\.gstatic\.com/);
  assert.match(html, /frame-src 'none'/);
  assert.equal(await readFile(join(site, 'release.txt'), 'utf8'), `${sha}\n`);
  assert.ok((await releaseFiles(site)).includes('worksheets/placeholder-worksheet.pdf'));
  const result = verify(site);
  assert.equal(result.status, 0, result.stderr);
  assert.notEqual(verify(site, 'b'.repeat(40)).status, 0);
  assert.match(await readFile(new URL('../www/index.html', import.meta.url), 'utf8'), /cordova\.js/);
});

test('release builder rejects invalid SHA and reused output directories', async t => {
  const site = await fixture(t);
  await assert.rejects(buildBrowser(site, 'bad'), /RELEASE_SHA/);
  await assert.rejects(buildBrowser(site, sha), /EEXIST/);
  await assert.rejects(buildBrowser(fileURLToPath(new URL('../www/output', import.meta.url)), sha),
    /outside the Cordova source/);
});

test('release verifier rejects modified files, missing files and unlisted files', async t => {
  const site = await fixture(t);
  const index = await readFile(join(site, 'index.html'));
  await writeFile(join(site, 'index.html'), 'tampered');
  assert.notEqual(verify(site).status, 0);
  await writeFile(join(site, 'index.html'), index);
  await writeFile(join(site, 'extra.txt'), 'unexpected');
  assert.notEqual(verify(site).status, 0);
  await rm(join(site, 'extra.txt'));
  await rm(join(site, 'css/index.css'));
  assert.notEqual(verify(site).status, 0);
});

test('release verifier rejects symlinks and traversal/duplicate manifest entries', async t => {
  const site = await fixture(t);
  await symlink('/etc/passwd', join(site, 'link'));
  assert.notEqual(verify(site).status, 0);
  await rm(join(site, 'link'));
  const manifest = await readFile(join(site, 'SHA256SUMS'), 'utf8');
  const line = manifest.split('\n')[0];
  for (const invalid of [
    `${manifest}${line}\n`,
    `${'0'.repeat(64)}  ../outside\n`,
    `${'0'.repeat(64)}  /etc/passwd\n`,
    `${'0'.repeat(64)}  css/../index.html\n`,
  ]) {
    await writeFile(join(site, 'SHA256SUMS'), invalid);
    assert.notEqual(verify(site).status, 0);
  }
});

test('deployment resources restrict the GitHub role and command parameter', async () => {
  const template = JSON.parse(await readFile(new URL('../deploy/aws-stack.json', import.meta.url)));
  const role = template.Resources.DeployRole.Properties;
  const trust = role.AssumeRolePolicyDocument.Statement[0];
  assert.equal(trust.Condition.StringEquals['token.actions.githubusercontent.com:sub'],
    'repo:vanitatech@132825275/kids_maths_cordova_app@637397646:ref:refs/heads/main');
  const statements = role.Policies[0].PolicyDocument.Statement;
  assert.deepEqual(statements.map(s => s.Action), ['ssm:SendCommand', 'ssm:GetCommandInvocation']);
  assert.equal(statements[0].Resource.length, 2);
  const document = template.Resources.DeployDocument.Properties.Content;
  assert.equal(document.parameters.CommitSha.allowedPattern, '^[0-9a-f]{40}$');
  assert.equal(document.parameters.CommitSha.interpolationType, 'ENV_VAR');
  assert.deepEqual(document.mainSteps[0].inputs.runCommand,
    ['/usr/local/sbin/deploy-kids-maths "$SSM_CommitSha"']);
});

test('all deployment scripts parse and reject invalid invocation arguments', () => {
  for (const script of ['deploy-kids-maths.sh', 'verify-release.sh', 'wait-for-command.sh']) {
    const path = fileURLToPath(new URL(`../deploy/${script}`, import.meta.url));
    const syntax = spawnSync('bash', ['-n', path], { encoding: 'utf8' });
    assert.equal(syntax.status, 0, syntax.stderr);
    const invalid = spawnSync('bash', [path, 'not-a-sha-or-command'], { encoding: 'utf8' });
    assert.equal(invalid.status, 2, invalid.stderr);
  }
});

test('SSM polling reports success, server failure and API failure truthfully', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'kids-maths-ssm-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, 'aws'), `#!/bin/bash
case "$MOCK_SSM_STATUS" in
  ApiError) echo "AccessDenied" >&2; exit 1 ;;
  Success) echo "Success" ;;
  Failed) echo "Failed" ;;
esac
`, { mode: 0o755 });
  const script = fileURLToPath(new URL('../deploy/wait-for-command.sh', import.meta.url));
  for (const [status, expected] of [['Success', 0], ['Failed', 1], ['ApiError', 1]]) {
    const result = spawnSync('bash', [script, 'a'.repeat(36), 'i-019b5c487c103508a'], {
      encoding: 'utf8',
      timeout: 5000,
      env: { ...process.env, PATH: `${directory}:${process.env.PATH}`, MOCK_SSM_STATUS: status },
    });
    assert.equal(result.status, expected, result.stderr);
    if (status === 'Failed') assert.match(result.stderr, /ended with status: Failed/);
    if (status === 'ApiError') assert.match(result.stderr, /AccessDenied/);
  }
});
