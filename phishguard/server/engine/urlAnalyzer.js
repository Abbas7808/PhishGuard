import validator from 'validator';

const TRUSTED_TLDS = new Set(['.com', '.org', '.net', '.edu', '.gov', '.mil', '.int']);

const WELL_KNOWN_DOMAINS = new Set([
  'google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'x.com',
  'instagram.com', 'linkedin.com', 'github.com', 'stackoverflow.com',
  'reddit.com', 'wikipedia.org', 'amazon.com', 'apple.com', 'microsoft.com',
  'netflix.com', 'spotify.com', 'paypal.com', 'stripe.com', 'zoom.us',
  'slack.com', 'discord.com', 'twitch.tv', 'pinterest.com', 'tumblr.com',
  'medium.com', 'notion.so', 'figma.com', 'vercel.com', 'netlify.com',
  'cloudflare.com', 'aws.amazon.com', 'azure.microsoft.com',
]);

export function analyzeURL(rawUrl) {
  let url;
  try {
    if (!/^https?:\/\//i.test(rawUrl)) rawUrl = 'http://' + rawUrl;
    url = new URL(rawUrl);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (!validator.isURL(rawUrl, { require_protocol: true })) {
    return { valid: false, error: 'URL failed validation' };
  }

  const protocol = url.protocol;
  const hostname = url.hostname.toLowerCase();
  const pathname = url.pathname;
  const fullDomain = hostname;
  const parts = hostname.split('.');
  const tld = '.' + parts[parts.length - 1];
  const registeredDomain = parts.slice(-2).join('.');
  const subdomains = parts.slice(0, -2);

  const isHttps = protocol === 'https:';
  const isTrustedTLD = TRUSTED_TLDS.has(tld);
  const isWellKnown = WELL_KNOWN_DOMAINS.has(registeredDomain);

  const domainAge = simulateDomainAge(registeredDomain);

  return {
    valid: true,
    url: url.href,
    protocol,
    hostname: fullDomain,
    registeredDomain,
    pathname,
    tld,
    subdomains,
    subdomainDepth: subdomains.length,
    isHttps,
    isTrustedTLD,
    isWellKnown,
    domainAge,
    urlLength: rawUrl.length,
  };
}

function simulateDomainAge(domain) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = ((hash << 5) - hash + domain.charCodeAt(i)) | 0;
  }
  const seed = Math.abs(hash);

  if (WELL_KNOWN_DOMAINS.has(domain)) {
    return { days: 3000 + (seed % 5000), category: 'established' };
  }

  const days = seed % 3650;
  let category;
  if (days < 30) category = 'brand-new';
  else if (days < 180) category = 'recent';
  else if (days < 365) category = 'moderate';
  else category = 'established';

  return { days, category };
}
