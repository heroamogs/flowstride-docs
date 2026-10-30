import assert from 'node:assert/strict';

/** Validate npm's completed report before applying any advisory policy. */
export function validateAuditReport(audit) {
  assert(audit && typeof audit === 'object' && !Array.isArray(audit) && !audit.error,
    'Dependency audit did not complete');
  const counts = audit.metadata?.vulnerabilities;
  assert(counts && audit.vulnerabilities && typeof audit.vulnerabilities === 'object' &&
    !Array.isArray(audit.vulnerabilities), 'Dependency audit did not complete: missing report data');
  const actual = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
  for (const finding of Object.values(audit.vulnerabilities)) {
    assert(finding && Object.hasOwn(actual, finding.severity) && Array.isArray(finding.via) &&
      Array.isArray(finding.nodes) && finding.nodes.length > 0 &&
      finding.nodes.every(node => typeof node === 'string' && node.startsWith('node_modules/')),
    'Dependency audit did not complete: malformed finding');
    actual[finding.severity]++;
  }
  for (const [severity, count] of Object.entries(actual)) {
    assert(Number.isSafeInteger(counts[severity]) && counts[severity] === count,
      'Dependency audit did not complete: inconsistent vulnerability counts');
  }
  assert(counts.total === Object.values(actual).reduce((sum, count) => sum + count, 0),
    'Dependency audit did not complete: inconsistent total');
  return counts;
}
