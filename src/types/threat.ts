export type Classification = 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';

export type ThreatType =
  | 'PHISHING'
  | 'MALWARE'
  | 'SCAM'
  | 'BRAND IMPERSONATION'
  | 'SUSPICIOUS WEBSITE'
  | 'CREDENTIAL HARVESTING'
  | 'MALICIOUS DOWNLOAD'
  | 'UNKNOWN'
  | 'NONE';

export interface SecurityIndicators {
  https: boolean;
  suspiciousDomain: boolean;
  brandImpersonation: boolean;
  phishingSignals: boolean;
  malwareSignals: boolean;
  suspiciousParameters: boolean;
  contentAccessible: boolean;
}

export interface DomainInfo {
  submittedUrl: string;
  normalizedUrl: string;
  domain: string;
  protocol: string;
  hostname: string;
  pathname: string;
  queryParamsCount: number;
  hasIpHost?: boolean;
  hasUncommonTld?: boolean;
  subdomainCount?: number;
}

export interface ExternalReputation {
  provider: string;
  status: 'CLEAN' | 'MALICIOUS' | 'SUSPICIOUS' | 'UNAVAILABLE';
  details: string;
}

export interface ThreatAnalysisResult {
  classification: Classification;
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100
  url: string;
  domain: string;
  threatType: ThreatType;
  summary: string;
  reasons: string[];
  indicators: SecurityIndicators;
  recommendation: string;
  technicalDetails: string[];
  limitations: string[];
  domainInfo: DomainInfo;
  externalReputation?: ExternalReputation;
  inspectedAt: string;
  pageInspectionStatus: 'FETCHED' | 'UNREACHABLE' | 'SKIPPED';
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  url: string;
  domain: string;
  classification: Classification;
  riskScore: number;
  threatType: ThreatType;
  fullResult: ThreatAnalysisResult;
}

export interface ScanStats {
  total: number;
  safe: number;
  suspicious: number;
  malicious: number;
  unknown: number;
}
