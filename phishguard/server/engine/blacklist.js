const BLACKLISTED_DOMAINS = new Set([
  'malware-site.com', 'phishing-example.net', 'fake-bank-login.com',
  'steal-credentials.xyz', 'free-iphone-winner.tk', 'account-verify-now.ml',
  'secure-update-login.ga', 'paypal-verify.cf', 'apple-id-locked.gq',
  'netflix-payment-update.tk', 'amazon-refund-claim.ml',
]);

const BLACKLISTED_TLDS = new Set([
  '.tk', '.ml', '.ga', '.cf', '.gq', '.buzz', '.top', '.xyz',
  '.club', '.work', '.date', '.racing', '.win', '.bid', '.stream',
  '.download', '.loan', '.men', '.click', '.link', '.gdn',
]);

const BLACKLISTED_KEYWORDS = [
  'login', 'verify', 'secure', 'account', 'update', 'confirm',
  'banking', 'password', 'credential', 'suspended', 'locked',
  'urgent', 'immediately', 'winner', 'prize', 'free', 'claim',
  'wallet', 'crypto', 'bitcoin', 'recover', 'restore',
];

export function checkBlacklist(url, domain) {
  const results = { isBlacklisted: false, flags: [] };

  if (BLACKLISTED_DOMAINS.has(domain)) {
    results.isBlacklisted = true;
    results.flags.push({ type: 'domain-blacklist', severity: 'critical', message: `Domain "${domain}" is on the known malicious domains list` });
  }

  const tld = '.' + domain.split('.').pop();
  if (BLACKLISTED_TLDS.has(tld)) {
    results.flags.push({ type: 'suspicious-tld', severity: 'warning', message: `TLD "${tld}" is commonly associated with malicious websites` });
  }

  const domainLower = domain.toLowerCase();
  let urlPath = '';
  try {
    const parsed = new URL(url);
    urlPath = (parsed.pathname + parsed.search + parsed.hash).toLowerCase();
  } catch {}

  for (const keyword of BLACKLISTED_KEYWORDS) {
    if (domainLower.includes(keyword) || urlPath.includes(keyword)) {
      results.flags.push({ type: 'suspicious-keyword', severity: 'warning', message: `URL contains suspicious keyword: "${keyword}"` });
    }
  }

  return results;
}
