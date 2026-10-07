import { ScanHistoryItem, ScanStats, ThreatAnalysisResult } from '../types/threat';

const STORAGE_KEY = 'threadmind_scan_history_v1';
const MAX_HISTORY_ITEMS = 50;

export function getScanHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    if (Array.isArray(items)) {
      return items;
    }
    return [];
  } catch (err) {
    console.error('Failed to read scan history from localStorage:', err);
    return [];
  }
}

export function saveScanItem(result: ThreatAnalysisResult): ScanHistoryItem[] {
  try {
    const existing = getScanHistory();
    const newItem: ScanHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      url: result.url,
      domain: result.domain,
      classification: result.classification,
      riskScore: result.riskScore,
      threatType: result.threatType,
      fullResult: result,
    };

    // Filter out duplicate recent entry with identical URL within last 1 minute, or just prepend
    const filtered = existing.filter(item => item.url !== newItem.url || Date.now() - item.timestamp > 60000);
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save scan item to localStorage:', err);
    return [];
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear scan history:', err);
  }
}

export function calculateScanStats(history: ScanHistoryItem[]): ScanStats {
  const stats: ScanStats = {
    total: history.length,
    safe: 0,
    suspicious: 0,
    malicious: 0,
    unknown: 0,
  };

  for (const item of history) {
    if (item.classification === 'SAFE') stats.safe++;
    else if (item.classification === 'SUSPICIOUS') stats.suspicious++;
    else if (item.classification === 'MALICIOUS') stats.malicious++;
    else stats.unknown++;
  }

  return stats;
}
