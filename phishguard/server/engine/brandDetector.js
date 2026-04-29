const KNOWN_BRANDS = [
  'google', 'facebook', 'apple', 'amazon', 'microsoft', 'paypal', 'netflix',
  'instagram', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'snapchat',
  'spotify', 'adobe', 'dropbox', 'github', 'stackoverflow', 'reddit',
  'yahoo', 'bing', 'outlook', 'hotmail', 'gmail', 'icloud', 'chase',
  'wellsfargo', 'bankofamerica', 'citibank', 'capitalone', 'americanexpress',
  'visa', 'mastercard', 'stripe', 'square', 'venmo', 'cashapp', 'zelle',
  'coinbase', 'binance', 'kraken', 'robinhood', 'fidelity', 'schwab',
  'walmart', 'target', 'bestbuy', 'ebay', 'etsy', 'shopify', 'alibaba',
  'zoom', 'slack', 'discord', 'twitch', 'youtube', 'tiktok', 'pinterest',
  'uber', 'lyft', 'airbnb', 'booking', 'expedia', 'tripadvisor',
  'fedex', 'ups', 'usps', 'dhl', 'steam', 'epicgames', 'playstation',
  'xbox', 'nintendo', 'samsung', 'huawei', 'oneplus', 'dell', 'hp', 'lenovo',
];

const HOMOGLYPHS = {
  'a': ['@', 'а', 'ɑ', 'α'],
  'e': ['е', 'ё', 'ε', '3'],
  'i': ['і', 'ı', '1', 'l', '|'],
  'o': ['о', '0', 'ο', 'ø'],
  'l': ['1', 'I', '|', 'ℓ'],
  'c': ['с', 'ϲ', 'ç'],
  'p': ['р', 'ρ'],
  's': ['ѕ', '$', '5'],
  'n': ['п', 'ñ'],
  'g': ['ɡ', '9'],
  't': ['τ', '+'],
  'u': ['υ', 'ü', 'µ'],
  'y': ['у', 'ý'],
  'b': ['ь', '6'],
  'd': ['ԁ', 'ð'],
  'h': ['һ', 'ħ'],
  'k': ['κ', 'ĸ'],
  'r': ['г', 'ɾ'],
  'w': ['ω', 'ш'],
  'x': ['х', '×'],
};

const HOMOGLYPH_MAP = new Map();
for (const [char, glyphs] of Object.entries(HOMOGLYPHS)) {
  for (const glyph of glyphs) {
    HOMOGLYPH_MAP.set(glyph, char);
  }
}

function levenshtein(a, b, maxDistance) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > maxDistance) return maxDistance + 1;

  let prev = Array(n + 1);
  let curr = Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    let rowMin = i;
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > maxDistance) return maxDistance + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function normalizeHostname(hostname) {
  let normalized = hostname.toLowerCase();
  let result = '';
  for (const char of normalized) {
    result += HOMOGLYPH_MAP.get(char) || char;
  }
  return result;
}

export function detectBrandImpersonation(hostname) {
  const normalized = normalizeHostname(hostname);
  const parts = normalized.split('.');
  const findings = [];

  for (const brand of KNOWN_BRANDS) {
    // 1. Exact match in subdomains or SLD
    for (const part of parts) {
      if (part === brand) {
        // If it's the exact brand but not the official domain (this is a simplified check)
        // In a real app, we'd check against a list of official domains
        findings.push({ brand, type: 'exact-match', similarity: 100 });
        break;
      }
      
      // 2. Substring match (e.g., "secure-paypal")
      if (part.includes(brand) && part !== brand) {
        findings.push({ brand, type: 'substring-match', similarity: 90 });
        break;
      }

      // 3. Typosquatting / Levenshtein
      if (part.length >= brand.length - 1 && part.length <= brand.length + 1) {
        const dist = levenshtein(part, brand, 2);
        if (dist > 0 && dist <= 2) {
          const similarity = Math.round((1 - dist / Math.max(part.length, brand.length)) * 100);
          findings.push({ brand, type: 'typosquatting', similarity });
          break;
        }
      }
    }
  }

  return findings.sort((a, b) => b.similarity - a.similarity);
}
