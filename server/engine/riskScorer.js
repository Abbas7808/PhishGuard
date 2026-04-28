import { analyzeURL } from './urlAnalyzer.js';
import { detectBrandImpersonation } from './brandDetector.js';
import { checkBlacklist } from './blacklist.js';
import { analyzeHeuristics } from './heuristics.js';

const WEIGHTS = {
  https: 15,
  domainAge: 20,
  blacklisted: 30,
  suspiciousTLD: 10,
  suspiciousKeywords: 3,
  brandImpersonation: 25,
  heuristics: 1,
  wellKnownBonus: -20,
};

export function computeRiskScore(rawUrl) {
  const parsed = analyzeURL(rawUrl);
  if (!parsed.valid) return { error: parsed.error };

  let score = 0;
  const details = [];
  const recommendations = [];

  // HTTPS
  if (!parsed.isHttps) {
    score += WEIGHTS.https;
    details.push({ category: 'Protocol', severity: 'warning', message: 'No HTTPS encryption detected', icon: 'lock-open' });
    recommendations.push('Connection is not encrypted — avoid entering sensitive data');
  } else {
    details.push({ category: 'Protocol', severity: 'safe', message: 'HTTPS encryption active', icon: 'lock' });
  }

  // Domain age
  const age = parsed.domainAge;
  if (age.category === 'brand-new') {
    score += WEIGHTS.domainAge;
    details.push({ category: 'Domain Age', severity: 'danger', message: `Domain is only ~${age.days} days old`, icon: 'calendar' });
    recommendations.push('Newly registered domain — exercise extreme caution');
  } else if (age.category === 'recent') {
    score += Math.round(WEIGHTS.domainAge * 0.5);
    details.push({ category: 'Domain Age', severity: 'warning', message: `Domain is ~${age.days} days old`, icon: 'calendar' });
  } else {
    details.push({ category: 'Domain Age', severity: 'safe', message: `Domain is ~${age.days} days old — established`, icon: 'calendar' });
  }

  // TLD
  if (!parsed.isTrustedTLD) {
    score += 5;
    details.push({ category: 'TLD', severity: 'info', message: `Uses "${parsed.tld}" — less common TLD`, icon: 'globe' });
  }

  // Blacklist
  const bl = checkBlacklist(parsed.url, parsed.hostname);
  if (bl.isBlacklisted) {
    score += WEIGHTS.blacklisted;
    details.push({ category: 'Blacklist', severity: 'critical', message: 'Domain found on known malicious list', icon: 'shield-x' });
    recommendations.push('This site is flagged as malicious — leave immediately');
  }
  for (const flag of bl.flags) {
    if (flag.type === 'suspicious-tld') {
      score += WEIGHTS.suspiciousTLD;
      details.push({ category: 'TLD Risk', severity: 'warning', message: flag.message, icon: 'alert-circle' });
    }
  }
  const kwFlags = bl.flags.filter(f => f.type === 'suspicious-keyword');
  if (kwFlags.length > 0) {
    score += kwFlags.length * WEIGHTS.suspiciousKeywords;
    const kws = kwFlags.map(f => f.message.match(/"([^"]+)"/)?.[1]).filter(Boolean);
    details.push({
      category: 'Suspicious Keywords',
      severity: kwFlags.length > 3 ? 'danger' : 'warning',
      message: `Found ${kws.length} suspicious keyword(s): ${kws.join(', ')}`,
      icon: 'search',
    });
  }

  // Brand impersonation
  const brands = detectBrandImpersonation(parsed.hostname);
  if (brands.length > 0) {
    const top = brands[0];
    score += WEIGHTS.brandImpersonation;
    details.push({
      category: 'Brand Impersonation',
      severity: 'danger',
      message: `Possible impersonation of "${top.brand}" (${top.type}, ${top.similarity}% match)`,
      icon: 'alert-triangle',
    });
    recommendations.push(`May be impersonating ${top.brand} — verify the official URL`);
    recommendations.push('Do not enter credentials or personal information');
  }

  // Heuristics
  const heur = analyzeHeuristics(parsed.url, parsed.hostname, parsed.pathname);
  score += heur.score;
  for (const flag of heur.flags) {
    details.push({ category: 'Heuristic', severity: flag.severity, message: flag.message, icon: 'cpu' });
  }

  // Well-known bonus
  if (parsed.isWellKnown) {
    score += WEIGHTS.wellKnownBonus;
    details.unshift({ category: 'Reputation', severity: 'safe', message: 'Domain is a well-known, trusted website', icon: 'verified' });
  }

  score = Math.min(Math.max(Math.round(score), 0), 100);

  let classification;
  if (score <= 30) classification = 'safe';
  else if (score <= 70) classification = 'suspicious';
  else classification = 'dangerous';

  if (recommendations.length === 0) {
    if (classification === 'safe') {
      recommendations.push('This URL appears safe based on our analysis');
    } else {
      recommendations.push('Verify domain ownership before entering information');
      recommendations.push('Look for the padlock icon in your browser address bar');
    }
  }

  return {
    url: parsed.url,
    domain: parsed.hostname,
    registeredDomain: parsed.registeredDomain,
    score,
    classification,
    isHttps: parsed.isHttps,
    domainAge: parsed.domainAge,
    subdomainDepth: parsed.subdomainDepth,
    brandFindings: brands,
    details,
    recommendations,
    analyzedAt: new Date().toISOString(),
  };
}
