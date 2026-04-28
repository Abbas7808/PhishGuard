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

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function normalizeHomoglyphs(str) {
  let normalized = str.toLowerCase();
  for (const [char, glyphs] of Object.entries(HOMOGLYPHS)) {
    for (const glyph of glyphs) {
      normalized = normalized.replaceAll(glyph, char);
    }
  }
  return normalized;
}

export function detectBrandImpersonation(domain) {
  const cleanDomain = domain.replace(/\.(com|net|org|io|co|info|biz|xyz|tk|ml|ga|cf|gq).*$/, '');
  const parts = cleanDomain.split('.').filter(Boolean);
  const findings = [];

  for (const part of parts) {
    const normalized = normalizeHomoglyphs(part);

    for (const brand of KNOWN_BRANDS) {
      if (normalized === brand) continue;

      const distance = levenshtein(normalized, brand);
      const maxLen = Math.max(normalized.length, brand.length);
      const similarity = 1 - distance / maxLen;

      if (similarity >= 0.75 && distance <= 3 && distance > 0) {
        findings.push({
          brand,
          suspect: part,
          similarity: Math.round(similarity * 100),
          type: 'typosquat',
        });
      }

      if (normalized.includes(brand) && normalized !== brand && normalized.length > brand.length + 2) {
        findings.push({
          brand,
          suspect: part,
          similarity: 80,
          type: 'brand-embedding',
        });
      }
    }
  }

  const unique = [];
  const seen = new Set();
  for (const f of findings) {
    const key = `${f.brand}-${f.type}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(f);
    }
  }
  return unique;
}
