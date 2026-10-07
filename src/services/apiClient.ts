import { ThreatAnalysisResult } from '../types/threat';

export async function analyzeUrlWithGemini(url: string): Promise<ThreatAnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || `Analysis request failed with HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  if (!data || !data.classification) {
    throw new Error('Received malformed threat analysis response from server.');
  }

  return data as ThreatAnalysisResult;
}
