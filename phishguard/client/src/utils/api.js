const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function analyzeUrl(url) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Analysis failed');
  }

  return response.json();
}
