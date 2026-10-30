import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDependencyAudit } from '../scripts/check-dependency-audit.mjs';

function report(severity) {
  const counts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0 };
  const vulnerabilities = {};
  if (severity) {
    counts[severity] = counts.total = 1;
    vulnerabilities.tool = { severity, dev: true, via: [], nodes: ['node_modules/tool'] };
  }
  return { metadata: { vulnerabilities: counts }, vulnerabilities };
}

test('a completed clean full-tree audit passes', () => assert.equal(checkDependencyAudit(report()).total, 0));
test('moderate findings remain visible without pretending they are high severity', () => assert.equal(checkDependencyAudit(report('moderate')).moderate, 1));
for (const severity of ['high', 'critical']) {
  test(`${severity} development-tool findings block the build`, () => {
    assert.throws(() => checkDependencyAudit(report(severity)), /Unapproved high\/critical.*tool/);
  });
}
for (const [label, change] of [
  ['registry error', value => { value.error = { code: 'ENETUNREACH' }; }],
  ['missing metadata', value => { delete value.metadata; }],
  ['missing vulnerability details', value => { delete value.vulnerabilities; }],
  ['array in place of findings', value => { value.vulnerabilities = []; }],
  ['unrecognized severity', value => { value.vulnerabilities.tool = { severity: 'unknown' }; }],
  ['missing package paths', value => { value.vulnerabilities.tool = { severity: 'high', via: [] }; }],
  ['hidden high finding', value => { value.vulnerabilities = report('high').vulnerabilities; }],
  ['inconsistent total', value => { value.metadata.vulnerabilities.total = 1; }],
]) {
  test(`${label} fails closed`, () => {
    const value = report(); change(value);
    assert.throws(() => checkDependencyAudit(value), /Dependency audit did not complete/);
  });
}
for (const value of [null, [], {}, { metadata: {} }]) {
  test(`incomplete report ${JSON.stringify(value)} cannot pass`, () => {
    assert.throws(() => checkDependencyAudit(value), /Dependency audit did not complete/);
  });
}
