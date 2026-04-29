function shannonEntropy(str) {
  const freq = {};
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
  const len = str.length;
  let entropy = 0;
  for (const count of Object.values(freq)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

export function analyzeHeuristics(url, domain, pathname) {
  const flags = [];
  let score = 0;

  // URL length
  if (url.length > 150) {
    score += 15;
    flags.push({ type: 'very-long-url', severity: 'warning', message: `URL is excessively long (${url.length} characters) — common in phishing` });
  } else if (url.length > 75) {
    score += 10;
    flags.push({ type: 'long-url', severity: 'info', message: `URL is unusually long (${url.length} characters)` });
  }

  // IP address as domain
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) {
    score += 25;
    flags.push({ type: 'ip-address', severity: 'danger', message: 'Domain is an IP address — legitimate sites use domain names' });
  }

  // Subdomain depth
  const subdomainCount = domain.split('.').length - 2;
  if (subdomainCount > 2) {
    score += 10 + (subdomainCount - 2) * 5;
    flags.push({ type: 'deep-subdomains', severity: 'warning', message: `Excessive subdomain depth (${subdomainCount} levels) — used to mimic legitimate domains` });
  }

  // Special characters in URL
  const atSign = url.includes('@');
  if (atSign) {
    score += 20;
    flags.push({ type: 'at-sign', severity: 'danger', message: 'URL contains "@" symbol — can be used to redirect to a different domain' });
  }

  const dashCount = domain.split('-').length - 1;
  if (dashCount > 3) {
    score += 10;
    flags.push({ type: 'excessive-dashes', severity: 'warning', message: `Domain contains ${dashCount} hyphens — uncommon in legitimate domains` });
  }

  // Entropy analysis
  const domainEntropy = shannonEntropy(domain);
  if (domainEntropy > 4.0) {
    score += 15;
    flags.push({ type: 'high-entropy', severity: 'warning', message: `Domain has high randomness (entropy: ${domainEntropy.toFixed(2)}) — may be auto-generated` });
  }

  // Numeric domain
  const numericRatio = (domain.match(/\d/g) || []).length / domain.length;
  if (numericRatio > 0.3) {
    score += 10;
    flags.push({ type: 'numeric-domain', severity: 'warning', message: 'Domain contains excessive numbers — uncommon in legitimate sites' });
  }

  // Path analysis
  if (pathname) {
    if (pathname.split('/').length > 6) {
      score += 5;
      flags.push({ type: 'deep-path', severity: 'info', message: 'URL has an unusually deep path structure' });
    }
    if (/\.(php|asp|cgi|exe)$/i.test(pathname)) {
      score += 5;
      flags.push({ type: 'suspicious-extension', severity: 'info', message: 'URL points to a potentially suspicious file type' });
    }
  }

  // Punycode / IDN
  if (domain.startsWith('xn--')) {
    score += 15;
    flags.push({ type: 'punycode', severity: 'warning', message: 'Domain uses internationalized encoding (Punycode) — can be used for visual spoofing' });
  }

  // Double TLD
  if (/\.(com|net|org)\.(com|net|org|tk|ml)$/.test(domain)) {
    score += 15;
    flags.push({ type: 'double-tld', severity: 'warning', message: 'Domain appears to have a double TLD — common phishing pattern' });
  }

  return { score: Math.min(score, 50), flags };
}
