import fs from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { validateAuditReport } from './audit-report.mjs';

export function checkDependencyAudit(audit) {
  const counts = validateAuditReport(audit);
  const blocked = Object.entries(audit.vulnerabilities)
    .filter(([, finding]) => ['high', 'critical'].includes(finding.severity))
    .map(([name]) => name);
  assert.equal(blocked.length, 0, `Unapproved high/critical dependency findings: ${blocked.join(', ')}`);
  return counts;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const counts = checkDependencyAudit(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')));
  console.log(`Full dependency audit passed: ${counts.high} high, ${counts.critical} critical; ${counts.moderate} moderate.`);
}
