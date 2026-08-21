import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
  /(?:^|[^a-zA-Z0-9])(0x[a-fA-F0-9]{40})(?:[^a-zA-Z0-9]|$)/, // Live ETH address
  /(?:^|[^a-zA-Z0-9])(bc1[a-zA-HJ-NP-Z0-9]{25,71})(?:[^a-zA-Z0-9]|$)/, // Live BTC address
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/, // Private keys
  /AKIA[0-9A-Z]{16}/, // AWS Access Key
  /re_[0-9a-zA-Z]{24,}/, // Resend API Key
];

const IGNORED_PATHS = [
  'node_modules',
  '.git',
  '.next',
  '.scratch',
  'dev.db',
  'package-lock.json',
  'tests',
];

function scanDirectory(dir: string): boolean {
  let hasViolation = false;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (IGNORED_PATHS.some((p) => file.includes(p))) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (scanDirectory(fullPath)) hasViolation = true;
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.py') || file.endsWith('.json')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.test(content) && !fullPath.includes('adapters/etherscan_v2.py')) {
            console.error(`🚨 Potential secret detected in ${fullPath}: matches ${pattern}`);
            hasViolation = true;
          }
        }
      }
    }
  }

  return hasViolation;
}

console.log('🔍 Auditing repository for hardcoded secrets...');
const foundSecrets = scanDirectory(process.cwd());
if (foundSecrets) {
  console.error('❌ Secret audit failed. Clean up hardcoded secrets before publishing.');
  process.exit(1);
} else {
  console.log('✅ Clean audit: Zero secrets detected in source files!');
}
