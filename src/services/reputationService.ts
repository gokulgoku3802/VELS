import { ExternalReputation } from '../types/threat';

export interface ReputationCheckResult {
  provider: string;
  status: 'CLEAN' | 'MALICIOUS' | 'SUSPICIOUS' | 'UNAVAILABLE';
  details: string;
  threatTypes?: string[];
}

export interface IReputationProvider {
  name: string;
  check(url: string): Promise<ReputationCheckResult>;
}

/**
 * Google Safe Browsing v4 Reputation Provider
 * Checks threat matches against Google Safe Browsing lookup API if an API key is available.
 * If no key or not configured, cleanly reports 'External reputation check unavailable'.
 */
export class SafeBrowsingReputationProvider implements IReputationProvider {
  name = 'Google Safe Browsing API';

  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  async check(url: string): Promise<ReputationCheckResult> {
    if (!this.apiKey) {
      return {
        provider: this.name,
        status: 'UNAVAILABLE',
        details: 'External reputation check unavailable (No Safe Browsing API key configured).',
      };
    }

    try {
      const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.apiKey}`;
      const payload = {
        client: {
          clientId: 'threadmind-ai',
          clientVersion: '1.0.0',
        },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return {
          provider: this.name,
          status: 'UNAVAILABLE',
          details: `Reputation service returned HTTP status ${res.status}. Falling back to heuristic & AI analysis.`,
        };
      }

      const data = await res.json();
      if (data.matches && data.matches.length > 0) {
        const foundThreats = data.matches.map((m: { threatType: string }) => m.threatType);
        return {
          provider: this.name,
          status: 'MALICIOUS',
          details: `Flagged on threat list: ${foundThreats.join(', ')}`,
          threatTypes: foundThreats,
        };
      }

      return {
        provider: this.name,
        status: 'CLEAN',
        details: 'No matches found on Google Safe Browsing threat databases.',
      };
    } catch {
      return {
        provider: this.name,
        status: 'UNAVAILABLE',
        details: 'External reputation check unavailable (Network timeout or request failure).',
      };
    }
  }
}

/**
 * Default composite reputation checker
 */
export async function reputationCheck(url: string, apiKey?: string): Promise<ExternalReputation> {
  const provider = new SafeBrowsingReputationProvider(apiKey);
  const result = await provider.check(url);
  return {
    provider: result.provider,
    status: result.status,
    details: result.details,
  };
}
