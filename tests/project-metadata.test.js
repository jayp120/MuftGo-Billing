const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '..');
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'codemeta.json'), 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('CodeMeta preserves the canonical Posnic product identity', () => {
  assert.equal(metadata['@context'], 'https://w3id.org/codemeta/3.0');
  assert.equal(metadata['@type'], 'SoftwareSourceCode');
  assert.equal(metadata['@id'], 'https://github.com/jayp120/MuftGo-Billing');
  assert.equal(metadata.name, 'MuftGo Billing');
  assert.equal(metadata.codeRepository, 'https://github.com/jayp120/MuftGo-Billing');
  assert.equal(metadata.issueTracker, packageJson.bugs.url);
  assert.equal(metadata.url, packageJson.homepage);
});

test('CodeMeta states a version, and it cannot drift from package.json', () => {
  // Machine-readable identity without a version is far less useful: indexers
  // and citation tools key on it, and "which release is this describing?" has
  // no answer without it. Asserting equality rather than a literal is the point
  // - a hardcoded version in a second file is a stale version waiting to happen,
  // and this file already cross-checks issueTracker, url and author the same way.
  assert.equal(metadata.version, packageJson.version);
  assert.match(metadata.version, /^\d+\.\d+\.\d+/);

  // CITATION.cff describes the same release, and codemeta.json points straight
  // at it. Two identity files disagreeing about the version is worse than one
  // omitting it: a reader has no way to tell which is stale. Read with a regex
  // rather than a YAML parser to keep this test dependency-free.
  const citation = fs.readFileSync(path.join(root, 'CITATION.cff'), 'utf8');
  const cffVersion = /^version:\s*(.+)$/m.exec(citation);
  assert.ok(cffVersion, 'CITATION.cff states no version');
  assert.equal(cffVersion[1].trim().replace(/^['"]|['"]$/g, ''), packageJson.version);

  const cffReleaseDate = /^date-released:\s*(.+)$/m.exec(citation);
  assert.ok(cffReleaseDate, 'CITATION.cff states no release date');
  assert.equal(cffReleaseDate[1].trim(), '2026-08-28');

  /* Prefix, not equality: white-label tags carry a -muftgo.N suffix whose
     counter the release workflow owns, so the exact tag is data. What must
     not regress is pointing at this repository's releases rather than the
     upstream's, for the version this file describes. */
  assert.ok(
    metadata.releaseNotes.startsWith(
      `https://github.com/jayp120/MuftGo-Billing/releases/tag/v${packageJson.version}`,
    ),
    `releaseNotes points at ${metadata.releaseNotes}`,
  );

  const cffLicense = /^license:\s*(.+)$/m.exec(citation);
  assert.equal(cffLicense[1].trim(), packageJson.license);
});

test('CodeMeta preserves the source licence and package-component boundary', () => {
  assert.equal(packageJson.license, 'AGPL-3.0-only');
  assert.equal(metadata.license, 'https://spdx.org/licenses/AGPL-3.0-only.html');
  assert.equal(metadata.isAccessibleForFree, true);
  assert.match(metadata.description, /separately licensed components/i);
  assert.match(metadata.description, /MongoDB Community Server under SSPL-1\.0/i);
});

test('CodeMeta publishes the verified publisher and supported platforms', () => {
  assert.equal(metadata.author.name, packageJson.author);
  assert.equal(metadata.publisher.name, packageJson.author);
  assert.deepEqual(metadata.operatingSystem, ['Windows', 'macOS', 'Linux']);
  assert.equal(metadata.maintainer.url, 'https://github.com/sridharkalaibala');
});

test('CodeMeta uses only secure canonical links', () => {
  const links = [
    metadata['@id'],
    metadata.author.url,
    metadata.publisher.url,
    metadata.maintainer.url,
    metadata.codeRepository,
    metadata.issueTracker,
    metadata.continuousIntegration,
    metadata.license,
    metadata.url,
    metadata.downloadUrl,
    metadata.softwareHelp,
    metadata.citation,
    metadata.releaseNotes,
    ...metadata.relatedLink,
  ];

  for (const link of links) assert.match(link, /^https:\/\//);
  assert.equal(packageJson.homepage, 'https://muftgo.com/');
  assert.equal(metadata.url, 'https://muftgo.com/');
  assert.equal(metadata.isSourceCodeOf.url, 'https://muftgo.com/');
});

test('README exposes the public POS evaluation and recovery resources', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

  assert.match(
    readme,
    /https:\/\/posnic\.github\.io\/open-source-pos-evaluation-checklist\.html/,
  );
  assert.match(
    readme,
    /https:\/\/posnic\.github\.io\/offline-pos-backup-checklist\.html/,
  );
  assert.doesNotMatch(readme, /https:\/\/(?:www\.)?posnic\.io(?:\/|\b)/);
});

test('APT repository page uses canonical Posnic discovery links', () => {
  const packageIndex = fs.readFileSync(
    path.join(root, 'builds', 'linux', 'packages-index.html'),
    'utf8',
  );
  const workflow = fs.readFileSync(
    path.join(root, '.github', 'workflows', 'publish-apt.yml'),
    'utf8',
  );

  assert.match(packageIndex, /href="https:\/\/www\.posnic\.com\/"/);
  assert.match(packageIndex, /href="https:\/\/github\.com\/Posnic\/POS"/);
  assert.doesNotMatch(packageIndex, /https?:\/\/(?:www\.)?posnic\.io(?:\/|\b)/);
  assert.doesNotMatch(packageIndex, /https?:\/\/posnic\.com(?:\/|\b)/);
  assert.match(workflow, /aws s3 cp builds\/linux\/packages-index\.html/);
});

test('CLA workflow links to the agreement on the active development branch', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'cla.yml'), 'utf8');

  assert.ok(fs.existsSync(path.join(root, '.github', 'CLA.md')));
  assert.match(workflow, /Posnic\/POS\/blob\/develop\/\.github\/CLA\.md/);
  assert.doesNotMatch(workflow, /Posnic\/POS\/blob\/main\/\.github\/CLA\.md/);
  assert.match(workflow, /branch:\s*cla-signatures/);
});
